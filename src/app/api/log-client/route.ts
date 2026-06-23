import { NextResponse } from 'next/server';

const ALLOWED_ORIGINS = [
  process.env.NEXT_PUBLIC_SITE_URL,
  'http://localhost:3000',
  'http://192.168.31.91:3000',
].filter(Boolean);

export async function POST(request: Request) {
  try {
    //accepting requests that originate from this site
    const origin = request.headers.get('origin') || '';
    if (ALLOWED_ORIGINS.length > 0 && !ALLOWED_ORIGINS.includes(origin)) {
      return NextResponse.json({ success: false }, { status: 403 });
    }

    const body = await request.json();
    const { type, message, stack, url, referer } = body;

    if (!type || !['error', '404'].includes(type)) {
      return NextResponse.json({ success: false }, { status: 400 });
    }

    const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (!discordWebhookUrl) {
      return NextResponse.json({ success: false }, { status: 400 });
    }

    // Capping all incoming strings, cant loose my discord
    const safeMessage = String(message || 'No message').substring(0, 500);
    const safeStack = stack ? String(stack).substring(0, 800) : null;
    const safeUrl = String(url || '').substring(0, 300);
    const safeReferer = String(referer || 'Direct').substring(0, 200);

    let embedTitle = 'Client Log';
    let embedColor = 0x95a5a6;
    let description = safeMessage;

    if (type === 'error') {
      embedTitle = '💥 Frontend Crash';
      embedColor = 0xe74c3c;
      if (safeStack) description += `\n\n**Stack Trace:**\n\`\`\`javascript\n${safeStack}\n\`\`\``;
    } else if (type === '404') {
      embedTitle = '⚠️ 404 Hit';
      embedColor = 0xf1c40f;
      description = `User hit a broken link.\n\n**URL:** ${safeUrl}\n**Referer:** ${safeReferer}`;
    }

    await fetch(discordWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'CLIENT_MONITOR',
        embeds: [
          {
            title: embedTitle,
            description,
            color: embedColor,
            timestamp: new Date().toISOString(),
          },
        ],
      }),
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
