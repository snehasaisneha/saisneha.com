# saisneha.com source code

[![Netlify Status](https://api.netlify.com/api/v1/badges/f44feea7-2639-4ca7-b451-3a25205fd834/deploy-status)](https://app.netlify.com/sites/saisneha/deploys)

This is a simple static website based on the [```Minos theme for Hugo by carsonjp```](https://github.com/carsonip/hugo-theme-minos), and deployed using Netlify.

It uses hugo version ```0.128.0```, which necessitated some changes to the base theme.

### Short links (redirects)

URLs like `saisneha.com/links/ttt-2026-03` redirect to external URLs. To add or change a link:

1. Edit `data/links.json` and add a slug and destination URL, e.g. `"my-slug": "https://github.com/..."`.
2. Run `node scripts/generate-redirects.js` (or rely on Netlify build, which runs it before Hugo).
3. Build/deploy. Visiting `/links/my-slug` will 302-redirect to the URL.




TODO:

1. Remove mentions of Google Analytics from theme.
2. Add About Page and Getting Started.
3. Add CV page.
4. Add comments section.

