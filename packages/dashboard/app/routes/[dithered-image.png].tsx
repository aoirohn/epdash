import type { LoaderFunction } from "@remix-run/node";
import { ditherImageBuffer } from "~/features/dithering/dithering";
import { takeScreenshot } from "~/features/screenshot/takeScreenshot";

export const loader: LoaderFunction = async ({ request }) => {
  const port = process.env.SERVER_PORT || 3000;
  const url = `http://localhost:${port}/dashboard`;

  const ss = await takeScreenshot(url);

  const palette = [
    "#FF0000", // Red
    "#00FF00", // Green
    "#0000FF", // Blue
    "#FFFF00", // Yellow
    "#FF8000", // Orange
    "#000000", // Black
    "#FFFFFF", // White
  ]; // カラーパレット
  const dithred = await ditherImageBuffer(ss, palette);

  return new Response(dithred, {
    headers: {
      "Content-Type": "image/png",
    },
  });
};
