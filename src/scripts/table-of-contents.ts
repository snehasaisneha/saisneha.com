const toc = document.querySelector<HTMLElement>(".toc-desktop");
if (toc) {
  const entries = Array.from(
    toc.querySelectorAll<HTMLAnchorElement>("a[href^='#']")
  )
    .map(link => ({
      link,
      heading: document.getElementById(decodeURIComponent(link.hash.slice(1))),
    }))
    .filter(
      (entry): entry is { link: HTMLAnchorElement; heading: HTMLElement } =>
        entry.heading !== null
    );
  const desktop = window.matchMedia("(min-width: 1240px)");
  let active: HTMLAnchorElement | undefined;
  let scheduled = false;

  function update() {
    scheduled = false;
    if (!desktop.matches) return;
    const readingLine = Math.min(160, window.innerHeight * 0.25);
    let current: HTMLAnchorElement | undefined;
    for (const { link, heading } of entries) {
      if (heading.getBoundingClientRect().top <= readingLine) current = link;
      else break;
    }
    if (current === active) return;
    active?.removeAttribute("aria-current");
    current?.setAttribute("aria-current", "location");
    active = current;
  }
  function schedule() {
    if (!scheduled) {
      scheduled = true;
      requestAnimationFrame(update);
    }
  }
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule, { passive: true });
  window.addEventListener("hashchange", schedule);
  window.addEventListener("pageshow", schedule);
  window.addEventListener("load", schedule, { once: true });
  document.fonts.ready.then(schedule);
  desktop.addEventListener("change", schedule);
  schedule();
}
