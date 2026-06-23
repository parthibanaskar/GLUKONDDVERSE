import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  const startTime = Date.now();
  try {
    const body = await request.json();
    const { name, message } = body;
    const isPublic = body.isPublic === true;

    if (!message || !String(message).trim()) {
      return NextResponse.json({ error: 'Payload empty' }, { status: 400 });
    }

    const sanitize = (s: string) =>
      String(s)
        .replace(/<[^>]*>?/gm, '')
        .replace(/&[a-z]+;/gi, '')
        .replace(/\0/g, '')
        .trim();

    const safeName = (name ? sanitize(name) : 'Anonymous').substring(0, 50) || 'Anonymous';
    const safeMessage = sanitize(message).substring(0, 1000);

    const finalName = safeName;

    if (isPublic) {
      const { data, error } = await supabase
        .from('marks')
        .insert([{ name: finalName, message: safeMessage, is_public: true }])
        .select();

      if (error) throw error;

      const duration = Date.now() - startTime;
      if (duration > 1500) {
        console.warn(`⏳ [PERFORMANCE] Slow API detected in /api/mark (Public): ${duration}ms`);
      }

      return NextResponse.json({ success: true, data: data[0] });
    }

    if (isPublic === false) {
      const discordWebhookUrl = process.env.DISCORD_PRIVATE_WEBHOOK_URL;

      if (!discordWebhookUrl) throw new Error('Private Discord URL missing');

      await fetch(discordWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: 'GUESTBOOK_TERMINAL',
          embeds: [
            {
              title: '🕵️‍♂️ PRIVATE TRANSMISSION',
              fields: [
                { name: 'IDENTIFIER', value: finalName, inline: true },
                { name: 'MESSAGE', value: safeMessage },
              ],
              color: 16768000,
            },
          ],
        }),
      });

      const duration = Date.now() - startTime;
      if (duration > 1500) {
        console.warn(`⏳ [PERFORMANCE] Slow API detected in /api/mark (Private): ${duration}ms`);
      }

      return NextResponse.json({ success: true, message: 'Sent to Discord' });
    }
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  } catch (err: unknown) {
    console.error('Internal server error:', err instanceof Error ? err.message : String(err));
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
