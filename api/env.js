export default async function handler(req, res) {
  // Vercel serverless endpoint
  // Cél: a frontend (static HTML) biztonságosan tudja olvasni a Vercel env változókat.
  // Ne feledd: a Vercel dashboardon add meg:
  //   SUPABASE_URL
  //   SUPABASE_ANON_KEY

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return res.status(500).json({
      error: "Missing env vars: SUPABASE_URL and/or SUPABASE_ANON_KEY",
    });
  }

  res.status(200).json({
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
  });
}

