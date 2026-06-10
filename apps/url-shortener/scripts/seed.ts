import { createClient } from "@supabase/supabase-js";
import { customAlphabet } from "nanoid";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const generateSlug = customAlphabet(
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  6
);

const SAMPLE_URLS = [
  "https://nextjs.org/docs",
  "https://supabase.com/docs",
  "https://tailwindcss.com",
  "https://github.com/vercel/next.js",
  "https://react.dev",
  "https://typescriptlang.org",
  "https://vercel.com",
  "https://developer.mozilla.org",
  "https://nodejs.org",
  "https://www.postgresql.org/docs",
];

const COUNTRIES = ["US", "BR", "DE", "GB", "FR", "JP", "IN", "CA", "AU", "NL"];
const DEVICES = ["desktop", "desktop", "desktop", "mobile", "mobile", "mobile", "tablet"];
const BROWSERS = ["Chrome", "Chrome", "Chrome", "Safari", "Safari", "Firefox", "Edge"];
const OS_LIST = ["Windows", "macOS", "Linux", "iOS", "Android"];
const REFERRERS = [
  "https://google.com",
  "https://twitter.com",
  "https://linkedin.com",
  "https://github.com",
  null,
  null,
];

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

function randomDate(daysBack: number): string {
  const now = Date.now();
  const past = now - daysBack * 24 * 60 * 60 * 1000;
  return new Date(past + Math.random() * (now - past)).toISOString();
}

async function seed() {
  console.log("Seeding URL shortener data...");

  const urlRecords = SAMPLE_URLS.map((url) => ({
    slug: generateSlug(),
    original_url: url,
    user_id: null,
    clicks_count: 0,
  }));

  const { data: insertedUrls, error: urlError } = await supabase
    .from("short_urls")
    .insert(urlRecords)
    .select("id, slug");

  if (urlError) {
    console.error("Failed to insert URLs:", urlError.message);
    return;
  }

  console.log(`Inserted ${insertedUrls.length} URLs`);

  const clicks: Array<{
    url_id: string;
    clicked_at: string;
    country: string;
    city: string | null;
    device: string;
    browser: string;
    os: string;
    referrer: string | null;
  }> = [];

  for (const url of insertedUrls) {
    const clickCount = Math.floor(Math.random() * 200) + 20;
    for (let i = 0; i < clickCount; i++) {
      clicks.push({
        url_id: url.id,
        clicked_at: randomDate(90),
        country: randomItem(COUNTRIES),
        city: null,
        device: randomItem(DEVICES),
        browser: randomItem(BROWSERS),
        os: randomItem(OS_LIST),
        referrer: randomItem(REFERRERS),
      });
    }
  }

  const BATCH = 500;
  for (let i = 0; i < clicks.length; i += BATCH) {
    const batch = clicks.slice(i, i + BATCH);
    const { error } = await supabase.from("short_clicks").insert(batch);
    if (error) {
      console.error(`Batch ${i / BATCH} failed:`, error.message);
    }
  }

  console.log(`Inserted ${clicks.length} clicks`);

  for (const url of insertedUrls) {
    const count = clicks.filter((c) => c.url_id === url.id).length;
    await supabase
      .from("short_urls")
      .update({ clicks_count: count })
      .eq("id", url.id);
  }

  console.log("Click counts updated. Seed complete!");
}

seed().catch(console.error);
