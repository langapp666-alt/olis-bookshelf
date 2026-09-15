import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { listedGuides } from "../../../lib/guides-index";
import { ogPngResponse } from "../../../lib/og";
import { genres } from "../../../lib/site";

export async function getStaticPaths() {
  const guides = listedGuides(await getCollection("guides"));
  return guides.map((guide) => ({
    params: { slug: guide.data.slug },
    props: {
      kicker: genres[guide.data.genre].label,
      title: guide.data.series,
      subtitle: guide.data.author,
    },
  }));
}

interface Props {
  kicker: string;
  title: string;
  subtitle: string;
}

export const GET: APIRoute = ({ props }) => {
  const { kicker, title, subtitle } = props as Props;
  return ogPngResponse({ kicker, title, subtitle });
};
