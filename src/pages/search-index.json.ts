import type { APIRoute } from "astro";
import { publishedSearchIndex } from "../lib/guides-index";

export const GET: APIRoute = async () => {
  const index = await publishedSearchIndex();
  return new Response(JSON.stringify(index), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
