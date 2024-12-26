import type { LoaderFunction } from "@remix-run/node";
import { takeScreenshot } from "~/features/screenshot/takeScreenshot";

export const loader: LoaderFunction = async ({ request }) => {
  const port = process.env.SERVER_PORT || 3000;
  const url = `http://localhost:${port}/dashboard`;

  const ss = await takeScreenshot(url);

  return new Response(ss, {
    headers: {
      "Content-Type": "image/png",
    },
  });
};
