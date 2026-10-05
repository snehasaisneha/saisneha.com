# sneha kanmani

Source for [saisneha.com](https://saisneha.com): a static Astro website with Verdana headings and locally hosted EB Garamond body text. The spare design is inspired by Minos.

## Develop

Use Node 24 and pnpm 10.32.1 (pinned in `package.json`).

```sh
pnpm install --frozen-lockfile
pnpm dev
```

For a production preview:

```sh
pnpm build
pnpm preview --host 127.0.0.1 --port 4321
```

The preview serves the last build; rebuild after editing. `pnpm lint`, `pnpm format:check`, and `pnpm build` are the CI checks.

## Writing

Posts live in `src/data/writing/`; series metadata lives in `src/data/series/`. Content uses Markdown (MDX is not configured).

```yaml
---
title: "A new post"
pubDatetime: 2026-10-04T12:00:00+05:30
subtitle: "An optional subtitle"
draft: true
comments: true
tags: []
---
```

- Set `draft: false` or omit it to publish. Scheduled posts are filtered at build time, with the configured 15-minute margin; a new build is needed to publish later posts.
- Use `subtitle` for the short text below a title. There are no generated excerpts or post descriptions.
- Add `archive` to tags to hide a post from the homepage while retaining its article, archive, feeds, and taxonomy listings.
- Set `comments: false` to omit comments and their script for a post.
- Optional `series` values link posts to series. Citation and note metadata are supported by the post layout.
- Homepage pagination is 20 posts; archives show up to 100 per page with search, year, tag, and series filters. Limits live in `src/utils/writing.ts`. Archive search matches case-insensitive text in titles, subtitles, rendered post bodies, notes, and references. Its plain-text index is embedded only in archive pages and regenerated on every build/deploy, with the same draft/future-post filtering as the public archive. Archived posts remain searchable. There is no separate search cache to clear; rebuild and refresh after content changes.

Post permalinks include their date and filename. Preserve them when editing to avoid breaking links and comment threads. Legacy URL routes and `public/_redirects` retain earlier links.

## Integrations

The subscription form uses the site's own styling and posts to `/api/subscribe`, a Netlify Function in `netlify/functions/subscribe.mjs`. It calls Buttondown's subscriber API on the server with `type: unactivated`, preserving double opt-in. The browser shows “Check your inbox to confirm your subscription.” only after Buttondown accepts the request and returns that pending state. Errors, duplicates, and blocked subscribers are not treated as successful subscriptions; the form retains the email and offers a Buttondown link. Without JavaScript, the ordinary HTML form submits to Buttondown's hosted flow.

Before deploying this integration:

1. Get the API key for the `snehakanmani` newsletter from [Buttondown's API requests page](https://buttondown.com/requests).
2. In Netlify, add `BUTTONDOWN_API_KEY` under the project's environment variables, with **Functions** scope and the relevant deploy contexts (or all scopes if scoped variables are unavailable). Store it as a secret; never prefix it with `PUBLIC_`, put it in `netlify.toml`, or commit it.
3. Redeploy after setting the key. A missing key returns a service-unavailable response and does not show confirmation.
4. Test one signup with an address you control and check the confirmation email. Unit tests mock Buttondown and do not send email.
5. Set Buttondown’s post-confirmation redirect (`subscription_confirmation_redirect_url`) to `https://saisneha.com/thank-you/`. This is the destination after the reader clicks the double-opt-in email link, not the initial signup redirect. The page links to `/#about` and `/archives/`.

The function applies same-origin and input checks, a honeypot, and Netlify's code-based limit of five requests per minute per IP/domain. It passes Netlify's trusted client IP to Buttondown for its validation; it does not log emails or upstream response bodies. Rate-limit enforcement is managed by Netlify and must be checked on the deployed function. This is not a CAPTCHA integration.

`pnpm dev` and `pnpm preview` serve Astro only; use Netlify Dev with the server-only environment variable to test live inline submissions locally. Static previews still show the form but cannot run the function. The rest of the website remains static.

FastComments uses the public tenant ID in `src/config.ts`. `PUBLIC_FASTCOMMENTS_TENANT_ID` optionally overrides it; an explicitly empty value disables comments globally. Email is optional and username is required. The widget loads near the comment section and uses the production article URL as its thread ID, including on local previews. Changing the permalink requires migrating the thread separately.

Widget CSS uses Verdana controls and local EB Garamond comment text. `public/_headers` allows the FastComments iframe to load the fonts on Netlify. Other hosts need the equivalent font CORS header. The site's privacy notice links to FastComments' policy. Account moderation settings are managed in FastComments.

Social preview images are generated at build time with Resvg and the local EB Garamond TTF; these are separate from the browser WOFF2 fonts.

## Deployment

Netlify runs `pnpm run build` and publishes `dist` using Node 24 and the pinned pnpm version. Dependencies use the frozen lockfile. This is a static build with no server adapter.

Connect Netlify to this repository with the repository root as its base directory. With automatic builds enabled, pushing to its configured production branch triggers deployment. Branch builds and pull-request previews depend on Netlify's dashboard settings. `netlify.toml` does not change those settings.

The custom 404, redirect rules, and font headers are included in `dist`. Buttondown needs no environment variables; avoid an empty FastComments override unless intentionally disabling comments.

Local backup branch `v1.1` preserves the previous website at `1f49512`. It has not yet been pushed. The older preview worktrees are historical references; current work is in the `saisneha.com` checkout on `main`.

## Licensing

- **Code:** website source code, build configuration, and code examples are licensed under [MIT](LICENSE-MIT). Retained AstroPaper-derived code includes Sat Naing's original MIT attribution.
- **Text:** Sneha Kanmani's original prose, including posts, drafts, page copy, series descriptions, and documentation, is licensed under [Creative Commons Attribution-ShareAlike 4.0 International](LICENSE-CC-BY-SA-4.0). Credit Sneha Kanmani, link to the original when practicable, indicate changes, and share adaptations under the applicable ShareAlike terms. See the [license summary](https://creativecommons.org/licenses/by-sa/4.0/).
- **Fonts:** EB Garamond retains its SIL Open Font License in `public/fonts/eb-garamond/OFL.txt` and `src/assets/fonts/OFL.txt`.
- **Other material:** third-party photographs, quotations, dependencies, and other credited material retain their own terms. The text license does not grant rights over that material. Images are not automatically included in the text license.

Design inspiration: Minos. The retained code originated in part from AstroPaper; attribution is preserved in the code license.

## Citations and notes

Use frontmatter references for sources with structured metadata:

```yaml
citations:
  - id: 1
    text: "Author, Title, year."
    href: "https://example.com/source"
    linkText: "Read source"
    archiveHref: "https://web.archive.org/web/20260101000000/https://example.com/source"
    archiveLinkText: "Archived copy"
    doi: "10.1234/example"
    isbn: "978-0-000000-00-0"
    pp: "12–15"
notes:
  - id: 1
    text: "A side note explaining this point."
```

In the article, write `A sourced claim [1]. A side observation [n 1].`

Only `id` and `text` are required for each entry. The remaining fields are optional and supported for both citations and notes. IDs must be unique within each list; use numbers or simple identifiers containing letters, digits, underscores, and hyphens. A citation and a note may share an ID. For example, `id: background` is referenced with `[background]` or `[n background]`.

Markers become superscript links during the build. With JavaScript enabled, hovering or focusing a marker opens a reference card with its text, metadata, and source/archive links. Clicking or tapping opens the card and focuses its close button. Use “View in article” to jump to the full entry; Escape, the close button, or clicking outside dismisses the card. On phones/tablets (up to 1024px wide, or with a coarse pointer), tapped cards stay at the bottom of the screen over a translucent black backdrop that dims the page. Tap the backdrop to dismiss. Desktop cards sit beside their marker. Cards also support standard Markdown footnotes. Without JavaScript, markers remain normal anchor links with native browser tooltips. Repeated markers have unique HTML IDs, and target entries receive a high-contrast gold highlight, held for about two seconds before fading to a softer gold over the remainder of four seconds. Repeated jumps replay the highlight; reduced-motion preferences disable the animation. Unknown markers remain ordinary text; markers inside links or code are not transformed.

Card behavior lives in `src/scripts/references.ts`, with styling in `src/styles/minimal.css`.

Use `citations:` for sources and `notes:` for asides, with `[1]` and `[n 1]` markers respectively. The **References** and **Notes** headings are generated automatically when their lists contain entries; do not add these headings manually. IDs are author-assigned, not automatically renumbered. Each used note has a ↩ return link to its marker. Repeated notes have numbered return links (↩ 1, ↩ 2) for each occurrence. These links are generated at build time and work without JavaScript; with JavaScript they also restore focus and highlight the sentence marker without reopening its card. Unused notes have no return link.

Legacy `footnotes:` frontmatter is accepted as an alias for `notes:`. Do not supply both fields in one post: validation rejects this to avoid silently losing entries. Existing `#footnotes-ID` URL fragments are retained for compatibility. Native Markdown `[^id]` footnotes still render for older content, but use `notes:` for new posts to avoid a second, separate Footnotes section.

The build plugin is `src/plugins/rehype-references.js`, registered under `markdown.rehypePlugins` in `astro.config.ts`. Frontmatter validation lives in `src/content.config.ts`; the lists are rendered by `src/layouts/PostDetails.astro` and styled in `src/styles/minimal.css`. Run `node --test tests/references.test.mjs` to check marker conversion.
