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

## Favicons

`public/favicon.svg` is the source of the EB Garamond “sk” logo. `pnpm run icons` generates the 16/32/48px ICO, 32px PNG fallback, and opaque 180px Apple touch icon; this also runs automatically before every production build. The shared layout versions icon URLs using a hash of the SVG so logo changes refresh browser caches. Keep the SVG outlines and font license when updating the logo.

For a temporary public preview, build with `PUBLIC_PREVIEW_ORIGIN=https://your-tunnel.trycloudflare.com` so social-image metadata points to that preview's assets. Omit this variable in production; canonical URLs continue to point to `saisneha.com`. The default social image URL includes a version derived from the site title and description to refresh image caches after wording changes.

### Unlisted draft previews

Keep drafts in `src/data/writing/` as Markdown. `draft: true` excludes them from public post routes, lists, archive search, feeds, and social-image routes. To share a draft, enable its preview:

```yaml
draft: true
draftPreview: true
```

`pnpm dev`, `pnpm build`, and `pnpm drafts:sync` automatically add a random `previewId` UUID to the file if the switch is true and no ID exists. Dev mode also watches new and edited Markdown files. Only the new field is inserted; existing YAML formatting, comments, and prose are preserved. Commit that generated field alongside the post. CI/Netlify refuses to generate a missing ID, because an ID generated only in an ephemeral deployment would change on the next build.

The two fields have separate jobs:

```yaml
draft: true
draftPreview: false # true exposes the preview; false removes it next deployment
previewId: "1a573f30-8a9c-4ba4-a693-72e88158a306" # generated once; retain it
```

False (or an omitted switch) never deletes or rotates the saved UUID. Re-enabling the switch restores the same URL, even if you rename the source file. Share `/drafts/<previewId>/`; there is no public draft directory. Invalid or duplicate IDs fail the build. Drafts use the regular article typography, notes, and contents, with comments and adjacent-post navigation disabled. Their social cards use the title, optional subtitle, date, monogram, and a Draft label.

After each successful deployment, an open draft checks its own `version.json` every 60 seconds while visible, plus on tab focus. Content/front-matter changes show **New version available — Reload**; it never reloads automatically. Reload remembers the visible passage and viewport offset in session storage. It restores that passage after fonts/images settle, falling back to the preceding heading and then relative scroll position if content was removed. The position expires after two minutes. Offline checks fail quietly. Deleted drafts show a no-longer-available notice; published drafts offer a link to the finished post.

To publish, set `draft: false` (or remove `draft`), retain `previewId` and `draftPreview: true`, and set the publication date. Once publishable, the build generates a permanent Netlify 301 from the UUID URL to the post, plus an HTML redirect for static previews. Keep both fields on the published post to preserve this redirect. Setting `draftPreview: false` disables the UUID route, version endpoint, image, and any generated redirect on the next deployment while retaining the ID. Deleting the source also removes them. New requests then return 404; disabling cannot erase copies already downloaded by readers or cached by sharing apps. A future-dated non-draft does not publish in production until its date is eligible and a build runs.

Draft paths are excluded from the sitemap and have both a robots `noindex, nofollow` meta tag and Netlify `X-Robots-Tag` headers (including images/version files). They are deliberately not blocked in robots.txt, so crawlers can read those directives. HTML/version responses use `Cache-Control: no-store`. UUID links are **unlisted, not authenticated**: anyone with the URL can read/share them, and source remains visible if committed to a public repository. Social apps may cache older cards even when the versioned image URL changes. These previews are for shareable work, not confidential writing.

### Loading and caching

Post lists, main navigation, adjacent posts, pagination, and internal footer pages opt into Astro's hover/focus prefetch. Filtered archive results attach intent listeners to newly created links and use the same Astro prefetch API and URL deduplication. Hover waits 80 ms and cancels when the pointer leaves; Astro skips speculative requests on reported slow/data-saving connections. Archive touch interactions prefetch only on touch intent. No bulk viewport prefetch or third-party/social-image prefetch is enabled.

The regular Garamond font preloads on every page. Netlify serves fingerprinted `/_astro/` assets with a one-year immutable browser cache; their URL changes whenever their contents change. Stable `/fonts/eb-garamond/` URLs cache for one day, then revalidate. HTML, feeds, icons, and social cards retain Netlify's default revalidation policy, so they are not pinned in a long-lived browser cache. Draft paths remain `no-store`. FastComments loads only near the comments section. These Netlify header rules take effect on deployment; a basic local static server does not apply `_headers`.


### Film reviews

Reviews are ordinary Markdown posts using the shared article layout, with a dedicated `ReviewHeader.astro` for film metadata and the original source. Add `series: [film-reviews]` to collect them at `/series/film-reviews/`; their individual URLs remain `/blog/YYYY/MM/slug/`. They appear in the main archive and search, including searches for the film title, year, and source platform.

```yaml
series: [film-reviews]
film:
  title: Digger
  year: 2026
  rating: 5 # optional; half-star increments, out of five
  watchedOn: "2026-10-17" # optional calendar date
  spoilers: true
originalPublication:
  platform: Letterboxd
  url: https://letterboxd.com/kanmani_sneha/film/digger-2026/
  # date: 2026-10-17 # optional; only when the publication date is known
includeInFeed: false
```

Keep the review body verbatim when importing; source attribution is rendered separately. `pubDatetime` controls this site's listing date, while `watchedOn` records the viewing date. Ratings, viewing dates, and source publication dates are optional. Omit `film` for a regular blog post.

`includeInFeed` defaults to true. Set it to false for archive imports that should not enter RSS. Independently, `tags: [archive]` hides a post from the home page while keeping its URL, series entry, and archive search result. Neither field makes a post private. An import intended to appear as a new blog entry can retain normal home visibility and feed inclusion.
