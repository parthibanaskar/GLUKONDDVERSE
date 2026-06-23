import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { itemTitle, action } = await request.json();

    const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (!discordWebhookUrl) {
      return NextResponse.json(
        { success: false, error: 'Webhook not configured' },
        { status: 400 }
      );
    }

    const safeTitle = String(itemTitle || 'Unknown Image')
      .substring(0, 100)
      .replace(/<[^>]*>?/gm, '');
    const safeAction = String(action) === 'liked' ? 'liked' : 'unliked';

    const color = safeAction === 'liked' ? 0xe74c3c : 0x95a5a6;
    const emoji = safeAction === 'liked' ? '❤️' : '💔';

    await fetch(discordWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'GALLERY_TERMINAL',
        embeds: [
          {
            title: `${emoji} Gallery Interaction`,
            description: `A user just **${safeAction}** a photo.`,
            fields: [{ name: 'Photo Title', value: safeTitle }],
            color: color,
            timestamp: new Date().toISOString(),
          },
        ],
      }),
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error(
      'Failed to log interaction:',
      error instanceof Error ? error.message : String(error)
    );
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
