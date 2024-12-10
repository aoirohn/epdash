import type { LoaderFunction } from "@remix-run/node";
import { chromium } from "playwright";

const CHROMIUM_FLAGS = [
  "--disable-gpu",
  "--disable-dev-shm-usage",
  "--disable-setuid-sandbox",
  "--no-first-run",
  "--no-sandbox",
  "--no-zygote",
  "--single-process",
  "--disable-audio-output",
  "--disable-background-timer-throttling",
  "--disable-backgrounding-occluded-windows",
  "--disable-breakpad",
  "--disable-extensions",
  "--disable-sync",
  "--disable-translate",
  // '--virtual-time-budget=10000'
];

export const loader: LoaderFunction = async ({ request }) => {
  const browser = await chromium.launch({ headless: true, args: CHROMIUM_FLAGS });

  const context = await browser.newContext({
    viewport: { width: 800, height: 480 },
    deviceScaleFactor: 2,
  });

  const page = await context.newPage();
  const port = process.env.SERVER_PORT || 3000;
  await page.goto(`http://localhost:${port}/dashboard`);

  const screenshot = await page.screenshot();
  await browser.close();

  return new Response(screenshot, {
    headers: {
      "Content-Type": "image/png",
    },
  });
};
