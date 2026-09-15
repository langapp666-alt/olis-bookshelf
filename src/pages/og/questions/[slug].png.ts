import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { ogPngResponse } from "../../../lib/og";
import { listedQuestions } from "../../../lib/questions";

export async function getStaticPaths() {
  const questions = listedQuestions(await getCollection("questions"));
  return questions.map((question) => ({
    params: { slug: question.data.slug },
    props: {
      title: question.data.title,
      subtitle: question.data.shortAnswerTitle,
    },
  }));
}

interface Props {
  title: string;
  subtitle: string;
}

export const GET: APIRoute = ({ props }) => {
  const { title, subtitle } = props as Props;
  return ogPngResponse({ kicker: "Common question", title, subtitle });
};
