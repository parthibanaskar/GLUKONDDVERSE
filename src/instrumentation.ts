export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // used to have global console override here for discord but it was causing massive loops when the webhook failed
  }
}
