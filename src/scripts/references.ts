const triggers = Array.from(
  document.querySelectorAll<HTMLAnchorElement>(
    ".reference-marker a, a[data-footnote-ref]"
  )
);
if (triggers.length) {
  const card = document.createElement("aside");
  card.className = "reference-card";
  card.id = "reference-preview-card";
  card.hidden = true;
  card.setAttribute("role", "dialog");
  card.setAttribute("aria-modal", "false");
  card.setAttribute("aria-labelledby", "reference-preview-heading");
  const header = document.createElement("div");
  header.className = "reference-card-header";
  const heading = document.createElement("strong");
  heading.id = "reference-preview-heading";
  const close = document.createElement("button");
  close.type = "button";
  close.textContent = "×";
  close.setAttribute("aria-label", "Close reference preview");
  const body = document.createElement("div");
  body.className = "reference-card-body";
  const jump = document.createElement("a");
  jump.className = "reference-card-jump";
  jump.textContent = "View in article ↓";
  header.append(heading, close);
  card.append(header, body, jump);
  const backdrop = document.createElement("div");
  backdrop.className = "reference-backdrop";
  backdrop.hidden = true;
  backdrop.setAttribute("aria-hidden", "true");
  document.body.append(backdrop, card);
  let active: HTMLAnchorElement | null = null;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let restoringFocus = false;
  let pinned = false;
  const bottomSheet = window.matchMedia(
    "(max-width: 1024px), (pointer: coarse)"
  );
  const cancel = () => clearTimeout(timer);
  function hide(restore = false) {
    cancel();
    const previous = active;
    active?.setAttribute("aria-expanded", "false");
    active = null;
    pinned = false;
    card.hidden = true;
    backdrop.hidden = true;
    if (restore && previous) {
      restoringFocus = true;
      previous.focus({ preventScroll: true });
      restoringFocus = false;
    }
  }
  function position() {
    if (!active) return;
    card.classList.toggle("reference-card-sheet", bottomSheet.matches);
    backdrop.hidden = !bottomSheet.matches || card.hidden;
    if (bottomSheet.matches) {
      card.style.left = "";
      card.style.top = "";
      return;
    }
    const rect = active.getBoundingClientRect();
    const width = card.getBoundingClientRect().width;
    const height = card.getBoundingClientRect().height;
    const gap = 10;
    card.style.left = `${Math.max(12, Math.min(rect.left - 20, window.innerWidth - width - 12))}px`;
    const below = rect.bottom + gap;
    card.style.top = `${Math.max(12, Math.min(below + height <= window.innerHeight - 12 ? below : rect.top - height - gap, window.innerHeight - height - 12))}px`;
  }
  function show(trigger: HTMLAnchorElement) {
    if (restoringFocus) return;
    cancel();
    const target = document.getElementById(
      decodeURIComponent(trigger.hash.slice(1))
    );
    if (!target) return;
    if (active !== trigger) {
      active?.setAttribute("aria-expanded", "false");
      active = trigger;
      const label = target
        .querySelector(".reference-label")
        ?.textContent?.trim();
      heading.textContent = trigger.hasAttribute("data-footnote-ref")
        ? `Footnote ${trigger.textContent}`
        : `${trigger.hash.startsWith("#footnotes-") ? "Note" : "Citation"} ${
            label
              ?.replace(/[\[\]]/g, "")
              .replace(/^n\s*/, "")
              .trim() ?? ""
          }`;
      const copy = target.cloneNode(true) as HTMLElement;
      copy
        .querySelectorAll(
          ".reference-label, [data-footnote-backref], .note-backlinks"
        )
        .forEach(el => el.remove());
      copy.removeAttribute("id");
      copy.querySelectorAll("[id]").forEach(el => el.removeAttribute("id"));
      body.replaceChildren(...Array.from(copy.childNodes));
      jump.href = trigger.hash;
    }
    trigger.setAttribute("aria-expanded", "true");
    card.hidden = false;
    position();
  }
  const scheduleHide = () => {
    cancel();
    if (pinned) return;
    timer = setTimeout(() => {
      if (
        !card.contains(document.activeElement) &&
        document.activeElement !== active
      )
        hide();
    }, 180);
  };
  triggers.forEach(trigger => {
    trigger.removeAttribute("title");
    trigger.setAttribute("aria-haspopup", "dialog");
    trigger.setAttribute("aria-controls", card.id);
    trigger.setAttribute("aria-expanded", "false");
    trigger.addEventListener("pointerenter", event => {
      if (event.pointerType !== "touch" && !bottomSheet.matches) show(trigger);
    });
    trigger.addEventListener("pointerleave", scheduleHide);
    trigger.addEventListener("focus", () => {
      // Touch browsers focus the link before dispatching its click. Opening
      // the backdrop here can intercept that same tap and dismiss the card.
      // On phones/tablets, open only after click (including Enter activation).
      if (!bottomSheet.matches) show(trigger);
    });
    trigger.addEventListener("blur", scheduleHide);
    trigger.addEventListener("click", event => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
        return;
      event.preventDefault();
      pinned = true;
      show(trigger);
      close.focus({ preventScroll: true });
    });
  });
  document
    .querySelectorAll<HTMLAnchorElement>("[data-note-backref]")
    .forEach(link => {
      link.addEventListener("click", event => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
          return;
        const target = document.getElementById(link.hash.slice(1));
        if (!target) return;
        event.preventDefault();
        hide();
        history.pushState(null, "", link.hash);
        // Return to the sentence without reopening the card on desktop focus.
        restoringFocus = true;
        target.focus({ preventScroll: true });
        restoringFocus = false;
        target.scrollIntoView({ block: "center" });
        highlightReference(link.hash);
      });
    });
  card.addEventListener("pointerenter", cancel);
  card.addEventListener("pointerleave", scheduleHide);
  card.addEventListener("focusin", cancel);
  card.addEventListener("focusout", scheduleHide);
  close.addEventListener("click", () => hide(true));
  backdrop.addEventListener("pointerdown", event => {
    event.preventDefault();
    hide(true);
  });
  jump.addEventListener("click", () => {
    const targetHash = jump.hash;
    hide();
    // Replay the highlight even when the URL already points to this entry.
    requestAnimationFrame(() => highlightReference(targetHash));
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && active) {
      event.preventDefault();
      hide(true);
    }
  });
  document.addEventListener("pointerdown", event => {
    if (
      active &&
      event.target instanceof Node &&
      event.target !== backdrop &&
      !card.contains(event.target) &&
      !active.contains(event.target)
    )
      hide();
  });
  window.addEventListener("resize", position);
  bottomSheet.addEventListener("change", position);
  window.addEventListener(
    "scroll",
    () => {
      if (!active || bottomSheet.matches) return;
      const rect = active.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) hide();
      else position();
    },
    { passive: true }
  );
}

function highlightReference(hash = window.location.hash) {
  document
    .querySelectorAll(".reference-highlight")
    .forEach(el => el.classList.remove("reference-highlight"));
  if (!hash) return;
  const target = document.getElementById(decodeURIComponent(hash.slice(1)));
  if (
    !target?.matches(
      '.reference-list li, li[id^="user-content-fn-"], .reference-marker a'
    )
  )
    return;
  // Restart the animation for repeated jumps to the same reference.
  target.classList.remove("reference-highlight");
  void target.offsetWidth;
  target.classList.add("reference-highlight");
}
window.addEventListener("hashchange", () => highlightReference());
highlightReference();
