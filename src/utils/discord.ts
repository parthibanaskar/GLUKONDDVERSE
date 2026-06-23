export const DiscordColors = {
  INFO: 0x3498db,
  SUCCESS: 0x2ecc71,
  WARNING: 0xf1c40f,
  ERROR: 0xe74c3c,
  VISIT: 0x9b59b6,
};

export type DiscordEmbed = {
  title?: string;
  description?: string;
  color?: number;
  fields?: Array<{ name: string; value: string; inline?: boolean }>;
  timestamp?: string;
  footer?: { text: string };
};

export async function sendDiscordLog(embed: DiscordEmbed) {
  const WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

  if (!WEBHOOK_URL) {
    console.warn('DISCORD_WEBHOOK_URL is not set. Skipping discord log.');
    return;
  }

  try {
    await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        embeds: [
          {
            ...embed,
            timestamp: embed.timestamp || new Date().toISOString(),
          },
        ],
      }),
    });
  } catch (error) {
    console.error('Failed to send discord log:', error);
  }
}

export async function logToDiscord(
  level: string,
  message: string,
  color: number = DiscordColors.INFO
) {
  try {
    if (!process.env.DISCORD_WEBHOOK_URL) return;

    if (message.includes('Failed to send discord log')) return;

    await sendDiscordLog({
      title: `🖥️ Server [${level}]`,
      description: `\`\`\`json\n${message.substring(0, 3900)}\n\`\`\``,
      color: color,
    });
  } catch {
    // Ignore error
  }
}
