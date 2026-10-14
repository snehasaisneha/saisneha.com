import type { APIRoute } from "astro";
import { previewEntries } from "@/utils/drafts";
import { generateOgImageForPost } from "@/utils/generateOgImages";
export async function getStaticPaths() {
  return (await previewEntries())
    .filter(post => post.data.draft)
    .map(post => ({
      params: { previewId: post.data.previewId! },
      props: { post },
    }));
}
export const GET: APIRoute = async ({ props }) =>
  new Response(new Uint8Array(await generateOgImageForPost(props.post, true)), {
    headers: {
      "Content-Type": "image/png",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
