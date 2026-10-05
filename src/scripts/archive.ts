import type { ArchiveWriting } from "@/utils/writing";
const root = document.querySelector<HTMLElement>("#archive");
if (root) {
  const posts: ArchiveWriting[] = JSON.parse(
    document.querySelector("#archive-data")!.textContent!
  );
  const form = document.querySelector<HTMLFormElement>("#archive-filters")!;
  const results = document.querySelector<HTMLUListElement>("#archive-results")!;
  const status = document.querySelector<HTMLElement>("#archive-status")!;
  const nav = document.querySelector<HTMLElement>("#archive-pagination")!;
  const pageLabel = document.querySelector<HTMLElement>("#archive-page")!;
  const size = Number(root.dataset.size);
  let page = Number(root.dataset.page);
  const field = (name: string) =>
    form.elements.namedItem(name) as HTMLInputElement | HTMLSelectElement;
  const names = ["q", "year", "series"];
  const tagInputs = [
    ...form.querySelectorAll<HTMLInputElement>('input[name="tag"]'),
  ];
  function restore() {
    const query = new URLSearchParams(location.search);
    for (const name of names) field(name).value = query.get(name) ?? "";
    for (const input of tagInputs)
      input.checked = query.getAll("tag").includes(input.value);
    const requested = Number(query.get("page"));
    page =
      Number.isInteger(requested) && requested > 0
        ? requested
        : Number(root!.dataset.page);
  }
  function render(updateURL = false) {
    const q = field("q").value.trim().replace(/\s+/gu, " ").toLowerCase();
    const year = field("year").value;
    const tags = tagInputs
      .filter(input => input.checked)
      .map(input => input.value);
    const series = field("series").value;
    const filtered = posts.filter(
      p =>
        (!q || p.searchText.includes(q)) &&
        (!year || p.year === year) &&
        (!tags.length || tags.some(tag => p.tags.includes(tag))) &&
        (!series || p.series.some(s => s.id === series))
    );
    const total = Math.max(1, Math.ceil(filtered.length / size));
    page = Math.min(Math.max(1, page), total);
    results.replaceChildren();
    for (const p of filtered.slice((page - 1) * size, page * size)) {
      const row = document.createElement("li");
      row.className = "archive-row";
      const date = document.createElement("time");
      date.className = "archive-date";
      date.dateTime = p.date;
      date.textContent = p.dateLabel;
      const details = document.createElement("div");
      const a = document.createElement("a");
      a.className = "archive-title";
      a.href = p.url;
      a.textContent = p.title;
      const meta = document.createElement("div");
      meta.className = "archive-meta";
      meta.textContent = [
        p.tags.length ? p.tags.map(tag => `#${tag}`).join(" ") : "",
        p.series.length
          ? `Series: ${p.series.map(s => s.title).join(", ")}`
          : "",
      ]
        .filter(Boolean)
        .join(" · ");
      details.append(a, meta);
      row.append(date, details);
      results.append(row);
    }
    status.textContent = filtered.length
      ? `${filtered.length} ${filtered.length === 1 ? "post" : "posts"} · Showing ${(page - 1) * size + 1}–${Math.min(page * size, filtered.length)}`
      : "No posts match these filters.";
    pageLabel.textContent = `Page ${page} of ${total}`;
    nav.hidden = total <= 1;
    nav
      .querySelectorAll<HTMLButtonElement>("button")
      .forEach(
        b =>
          (b.disabled =
            Number(b.dataset.direction) < 0 ? page === 1 : page === total)
      );
    if (updateURL) {
      const params = new URLSearchParams();
      for (const name of names) {
        if (field(name).value) params.set(name, field(name).value);
      }
      for (const tag of tags) params.append("tag", tag);
      if (page > 1) params.set("page", String(page));
      history.replaceState(
        null,
        "",
        `/archives/${params.size ? "?" + params : ""}`
      );
    }
  }
  form.hidden = false;
  document.querySelector<HTMLElement>("#archive-static-pagination")!.hidden =
    true;
  form.addEventListener("submit", e => {
    e.preventDefault();
    page = 1;
    render(true);
  });
  form.addEventListener("input", () => {
    page = 1;
    render(true);
  });
  form.addEventListener("reset", e => {
    e.preventDefault();
    for (const input of tagInputs) input.checked = false;
    for (const name of names) field(name).value = "";
    page = 1;
    render(true);
  });
  nav.querySelectorAll<HTMLButtonElement>("button").forEach(b =>
    b.addEventListener("click", () => {
      page += Number(b.dataset.direction);
      render(true);
      status.focus();
    })
  );
  window.addEventListener("popstate", () => {
    restore();
    render();
  });
  restore();
  render();
}
