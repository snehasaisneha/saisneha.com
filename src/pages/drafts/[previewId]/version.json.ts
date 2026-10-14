import type { APIRoute } from "astro";
import { previewEntries, previewState } from "@/utils/drafts";
export async function getStaticPaths() {
  return (await previewEntries()).map(post => ({
    params: { previewId: post.data.previewId! },
    props: { state: previewState(post) },
  }));
}
export const GET: APIRoute = ({ props }) =>
  new Response(JSON.stringify(props.state), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
