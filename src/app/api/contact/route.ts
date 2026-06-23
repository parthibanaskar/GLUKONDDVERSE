import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { name, email, message, botField } = await request.json();

    if (botField) {
      console.warn('Bot detected by honeypot in contact form');
      return NextResponse.json({ success: true });
    }

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(String(email))) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    const sanitize = (s: string) =>
      String(s)
        .replace(/<[^>]*>?/gm, '')
        .replace(/&[a-z]+;/gi, '')
        .replace(/\0/g, '')
        .trim();

    const safeName = sanitize(name).substring(0, 100);
    const safeEmail = sanitize(email).substring(0, 100);
    const safeMessage = sanitize(message).substring(0, 1500);

    const webhookUrl = process.env.DISCORD_PRIVATE_WEBHOOK_URL;

    if (!webhookUrl) {
      console.warn('DISCORD_PRIVATE_WEBHOOK_URL not set');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const embed = {
      title: '📬 New Contact Request',
      description: safeMessage,
      color: 0x9b59b6, // Purple
      fields: [
        { name: 'Name', value: safeName, inline: true },
        { name: 'Email', value: safeEmail, inline: true },
      ],
      timestamp: new Date().toISOString(),
    };

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ embeds: [embed] }),
    });

    if (!response.ok) {
      throw new Error(`Discord API error: ${response.status}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact API Error:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
