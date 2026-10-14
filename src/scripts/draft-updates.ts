const banner = document.querySelector<HTMLElement>("[data-draft-version]");
if (banner) {
  const button = banner.querySelector<HTMLButtonElement>("button")!;
  const status = banner.querySelector<HTMLElement>('[role="status"]')!;
  const base = location.pathname.replace(/\/?$/, "/");
  const key = `draft-position:${base}`;
  const blocks = () => [
    ...document.querySelectorAll<HTMLElement>(
      "article.prose h1, article.prose h2, article.prose h3, article.prose h4, article.prose p, article.prose li, article.prose pre"
    ),
  ];
  const text = (el: HTMLElement) =>
    (el.textContent ?? "").replace(/\s+/g, " ").trim();
  let destination = location.href;
  let checking = false;
  let unavailable = false;

  async function restore() {
    let saved;
    try {
      const raw = sessionStorage.getItem(key);
      sessionStorage.removeItem(key);
      saved = raw ? JSON.parse(raw) : null;
    } catch {
      return;
    }
    if (!saved || Date.now() - saved.at > 120000) return;
    await document.fonts.ready;
    await Promise.all(
      [...document.images].map(img =>
        img.complete
          ? Promise.resolve()
          : Promise.race([
              new Promise(resolve => {
                img.addEventListener("load", resolve, { once: true });
                img.addEventListener("error", resolve, { once: true });
              }),
              new Promise(resolve => setTimeout(resolve, 1500)),
            ])
      )
    );
    requestAnimationFrame(() => {
      const candidates = blocks().filter(el => text(el));
      const match = candidates.find(el => text(el) === saved.text);
      const heading = saved.heading
        ? document.getElementById(saved.heading)
        : null;
      const target = match ?? heading;
      const top = target
        ? scrollY +
          target.getBoundingClientRect().top -
          (match ? saved.offset : 24)
        : saved.ratio *
          Math.max(0, document.documentElement.scrollHeight - innerHeight);
      window.scrollTo({ top, behavior: "instant" });
    });
  }
  void restore();

  async function check() {
    if (document.hidden || checking || unavailable) return;
    checking = true;
    try {
      const response = await fetch(`${base}version.json`, {
        cache: "no-store",
        signal: AbortSignal.timeout(10000),
      });
      if (response.status === 404 || response.status === 410) {
        unavailable = true;
        status.textContent = "This draft is no longer available";
        button.hidden = true;
        banner!.hidden = false;
        return;
      }
      if (!response.ok) return;
      const state = await response.json();
      if (typeof state.version !== "string" || typeof state.url !== "string")
        return;
      const url = new URL(state.url, location.origin);
      if (url.origin !== location.origin) return;
      if (state.published) {
        destination = url.href;
        status.textContent = "This draft has been published";
        button.textContent = "Read post";
        banner!.hidden = false;
      } else if (state.version !== banner!.dataset.draftVersion) {
        destination = location.href;
        status.textContent = "New version available";
        button.textContent = "Reload";
        banner!.hidden = false;
      } else banner!.hidden = true;
    } catch {
      /* Offline or a failed check should never interrupt reading. */
    } finally {
      checking = false;
    }
  }
  button.addEventListener("click", () => {
    if (destination !== location.href) {
      location.assign(destination);
      return;
    }
    const candidates = blocks().filter(el => text(el));
    const anchor =
      candidates.find(el => el.getBoundingClientRect().bottom > 24) ??
      candidates.at(-1);
    const heading = candidates
      .filter(
        el =>
          /^H[1-4]$/.test(el.tagName) && el.getBoundingClientRect().top <= 48
      )
      .at(-1);
    try {
      sessionStorage.setItem(
        key,
        JSON.stringify({
          at: Date.now(),
          text: anchor ? text(anchor) : "",
          offset: anchor?.getBoundingClientRect().top ?? 0,
          heading: heading?.id,
          ratio:
            scrollY /
            Math.max(1, document.documentElement.scrollHeight - innerHeight),
        })
      );
    } catch {
      /* Reload still works when browser storage is disabled. */
    }
    location.reload();
  });
  setInterval(() => void check(), 60000);
  document.addEventListener("visibilitychange", () => void check());
  window.addEventListener("focus", () => void check());
  void check();
}
