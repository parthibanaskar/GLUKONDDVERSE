import { NextResponse } from 'next/server';
import type { NextRequest, NextFetchEvent } from 'next/server';
import { sendDiscordLog, DiscordColors } from '@/utils/discord';
import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';

const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

let ratelimit: Ratelimit | null = null;

if (redisUrl && redisToken) {
  const redis = new Redis({
    url: redisUrl,
    token: redisToken,
  });

  ratelimit = new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(30, '1 m'),
    analytics: true,
  });
}

export default async function middleware(request: NextRequest, event: NextFetchEvent) {
  const { pathname } = request.nextUrl;

  if (pathname.match(/\.(.*)$/)) {
    return NextResponse.next();
  }

  const ip =
    request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'Unknown IP';

  const isApi = pathname.startsWith('/api');

  if (isApi && ratelimit) {
    const msgUint8 = new TextEncoder().encode(ip);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashedIp = hashArray
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')
      .slice(0, 16);

    // 30 req/min felt right during testing
    const { success, pending, limit, reset, remaining } = await ratelimit.limit(
      `ratelimit_${hashedIp}`
    );

    event.waitUntil(pending);

    if (!success) {
      event.waitUntil(
        sendDiscordLog({
          title: '🚨 [SECURITY] Spam Detected',
          description: `IP fingerprint **${hashedIp}** is spamming the API and has been blocked by Upstash Redis.`,
          color: DiscordColors.ERROR,
          fields: [{ name: 'Path Attempted', value: pathname, inline: true }],
        })
      );
      return new NextResponse(JSON.stringify({ error: 'Too Many Requests' }), {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': reset.toString(),
        },
      });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*'],
};
