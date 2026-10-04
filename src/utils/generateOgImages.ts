import { Resvg } from "@resvg/resvg-js";
import type { CollectionEntry } from "astro:content";
import { resolve } from "node:path";
import { SITE } from "@/config";
const escape = (text: string) =>
  text.replace(
    /[&<>"']/g,
    c =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&apos;",
      })[c]!
  );
function card(title: string, subtitle: string) {
  const lines: string[] = [];
  let line = "";
  for (const word of title.split(/\s+/)) {
    if ((line + " " + word).length > 38 && line) {
      lines.push(line);
      line = word;
    } else line = line ? line + " " + word : word;
  }
  if (line) lines.push(line);
  const fontSize = lines.length > 4 ? 44 : 58;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="1200" height="630" fill="#faf9f6"/><path d="M72 120 H1128" stroke="#d8d4cc"/><text x="72" y="78" font-family="EB Garamond" font-size="32" fill="#555">${escape(SITE.title)}</text>${lines.map((s, i) => `<text x="72" y="${210 + i * (fontSize + 12)}" font-family="EB Garamond" font-size="${fontSize}" fill="#222">${escape(s)}</text>`).join("")}<text x="72" y="570" font-family="EB Garamond" font-size="26" fill="#666">${escape(subtitle)}</text></svg>`;
  return new Resvg(svg, {
    font: {
      fontFiles: [resolve("src/assets/fonts/EBGaramond-Regular.ttf")],
      loadSystemFonts: false,
    },
  })
    .render()
    .asPng();
}
export async function generateOgImageForPost(post: CollectionEntry<"blog">) {
  return card(
    post.data.title,
    post.data.pubDatetime.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: SITE.timezone,
    })
  );
}
export async function generateOgImageForSite() {
  return card("Essays, thoughts, and things along the way.", "saisneha.com");
}
