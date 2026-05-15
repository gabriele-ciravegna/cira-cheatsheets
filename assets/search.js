// Client-side fuzzy search across all-commands.json.
// Build result list with safe DOM APIs (textContent), never innerHTML on untrusted data.
(async function () {
  const input = document.getElementById("global-search");
  if (!input) return;
  const resultsEl = document.getElementById("search-results");

  const root = input.getAttribute("data-root") || ".";
  let index = [];
  try {
    const res = await fetch(`${root}/assets/data/all-commands.json`, {
      cache: "no-cache",
    });
    if (res.ok) index = await res.json();
  } catch (e) {
    console.warn("Search index not loaded:", e);
  }

  function score(item, q) {
    const hay = (
      (item.tool || "") +
      " " +
      (item.name || "") +
      " " +
      (item.what || "") +
      " " +
      (item.when || "")
    ).toLowerCase();
    const tokens = q.toLowerCase().split(/\s+/).filter(Boolean);
    let s = 0;
    for (const t of tokens) {
      if ((item.name || "").toLowerCase().includes(t)) s += 10;
      if (hay.includes(t)) s += 1;
    }
    return s;
  }

  function clear(el) {
    while (el.firstChild) el.removeChild(el.firstChild);
  }

  function makeNoMatch() {
    const a = document.createElement("a");
    a.style.color = "var(--text-dim)";
    a.textContent = "No match";
    return a;
  }

  function makeResultLink(item) {
    const a = document.createElement("a");
    a.href = `${root}/${item.href}`;
    const strong = document.createElement("strong");
    strong.style.color = "var(--accent)";
    strong.textContent = item.name || "";
    a.appendChild(strong);
    const tag = document.createElement("span");
    tag.style.cssText = "color:var(--text-dim);font-size:11px;margin-left:8px";
    tag.textContent = `[${item.tool || ""}]`;
    a.appendChild(tag);
    const desc = document.createElement("div");
    desc.style.cssText = "color:var(--text-muted);font-size:12px;margin-top:2px";
    desc.textContent = (item.what || "").slice(0, 80);
    a.appendChild(desc);
    return a;
  }

  function render(q) {
    if (!q || q.length < 2) {
      clear(resultsEl);
      resultsEl.style.display = "none";
      return;
    }
    const ranked = index
      .map((i) => ({ i, s: score(i, q) }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 12);
    clear(resultsEl);
    if (!ranked.length) {
      resultsEl.appendChild(makeNoMatch());
    } else {
      for (const { i } of ranked) resultsEl.appendChild(makeResultLink(i));
    }
    resultsEl.style.display = "block";
  }

  let debounce;
  input.addEventListener("input", (e) => {
    clearTimeout(debounce);
    debounce = setTimeout(() => render(e.target.value), 120);
  });

  input.addEventListener("blur", () => {
    setTimeout(() => (resultsEl.style.display = "none"), 200);
  });

  input.addEventListener("focus", (e) => {
    if (e.target.value) render(e.target.value);
  });
})();
