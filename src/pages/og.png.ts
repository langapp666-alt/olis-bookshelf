import type { APIRoute } from "astro";
import { defaultOgInput, ogPngResponse } from "../lib/og";

export const GET: APIRoute = () => ogPngResponse(defaultOgInput());
