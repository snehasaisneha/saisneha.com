import { Resvg } from "@resvg/resvg-js";
import type { CollectionEntry } from "astro:content";
import { resolve } from "node:path";
import { SITE } from "@/config";
import monogram from "../../public/favicon.svg?raw";
const cardMonogram = monogram.replace(
  "<svg ",
  '<svg x="60" y="20" width="88" height="88" '
);
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
function wrap(text: string, limit: number) {
  const lines: string[] = [];
  let line = "";
  for (const word of text.split(/\s+/)) {
    if ((line + " " + word).length > limit && line) {
      lines.push(line);
      line = word;
    } else line = line ? line + " " + word : word;
  }
  if (line) lines.push(line);
  return lines;
}
function card(title: string, footer: string, subtitle = "", draft = false) {
  let fontSize = 58;
  let subtitleSize = 38;
  let lines = wrap(title, 38);
  let subtitleLines = wrap(subtitle, 58);
  // Keep the title and subtitle above the fixed date/footer area.
  while (
    lines.length * (fontSize + 12) +
      (subtitleLines.length
        ? 20 + subtitleLines.length * (subtitleSize + 8)
        : 0) >
      350 &&
    fontSize > 24
  ) {
    fontSize -= 2;
    subtitleSize = Math.max(22, Math.round((fontSize * 38) / 58));
    lines = wrap(title, Math.floor((38 * 58) / fontSize));
    subtitleLines = wrap(subtitle, Math.floor((58 * 38) / subtitleSize));
  }
  const subtitleY =
    210 + (lines.length - 1) * (fontSize + 12) + 20 + subtitleSize;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="1200" height="630" fill="#faf9f6"/>${draft ? '<text x="170" y="78" font-family="EB Garamond" font-size="30" fill="#666">Draft</text>' : ""}<path d="M72 120 H1128" stroke="#d8d4cc"/>${cardMonogram}<text x="1128" y="78" text-anchor="end" font-family="EB Garamond" font-size="32" fill="#555">${escape(SITE.title)}</text>${lines.map((s, i) => `<text x="72" y="${210 + i * (fontSize + 12)}" font-family="EB Garamond" font-size="${fontSize}" fill="#222">${escape(s)}</text>`).join("")}${subtitleLines.map((s, i) => `<text x="72" y="${subtitleY + i * (subtitleSize + 8)}" font-family="EB Garamond" font-size="${subtitleSize}" fill="#555">${escape(s)}</text>`).join("")}<text x="72" y="570" font-family="EB Garamond" font-size="32" fill="#666">${escape(footer)}</text></svg>`;
  return new Resvg(svg, {
    font: {
      fontFiles: [resolve("src/assets/fonts/EBGaramond-Regular.ttf")],
      loadSystemFonts: false,
    },
  })
    .render()
    .asPng();
}
export async function generateOgImageForPost(
  post: CollectionEntry<"blog">,
  draft = false
) {
  return card(
    post.data.title,
    post.data.pubDatetime.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: SITE.timezone,
    }),
    post.data.subtitle,
    draft
  );
}
export async function generateOgImageForSite() {
  return card(SITE.desc, "saisneha.com");
}
