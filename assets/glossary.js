// Inject right-rail glossary into each cheatsheet page.
// Detects tool id from URL path, fetches tool-specific intro from glossary-data.json,
// builds DOM safely (textContent only — no innerHTML).
(async function () {
  const layout = document.querySelector(".layout");
  if (!layout) return;
  // Skip if page already has its own glossary (index.html does)
  if (layout.querySelector("aside.glossary")) return;

  // Detect tool from path
  const segs = window.location.pathname.split("/").filter(Boolean);
  const last = segs[segs.length - 1] || "";
  const folder = segs[segs.length - 2] || "";
  let toolId = "";
  if (last === "index.html" && folder) toolId = folder;
  else if (last.endsWith(".html")) toolId = last.replace(/\.html$/, "");

  // Universal + tool-specific blocks
  const blocks = await (async () => {
    try {
      const res = await fetch("../assets/data/glossary-data.json", { cache: "no-cache" });
      if (res.ok) return await res.json();
    } catch (e) { /* fallback below */ }
    return null;
  })();

  if (!blocks) return;
  const toolBlocks = (blocks.tools && blocks.tools[toolId]) || [];
  const universal = blocks.universal || [];
  const all = [...toolBlocks, ...universal];
  if (!all.length) return;

  const aside = document.createElement("aside");
  aside.className = "glossary";

  const h3 = document.createElement("h3");
  const h3em = document.createElement("em");
  h3em.textContent = "Per chi non sa";
  h3.textContent = "";
  h3.appendChild(h3em);
  aside.appendChild(h3);

  for (const b of all) {
    const div = document.createElement("div");
    div.className = "gloss-item";
    const h4 = document.createElement("h4");
    h4.textContent = b.q;
    div.appendChild(h4);
    // Allow simple <code> formatting via splitting on backticks
    const parts = (b.a || "").split(/(`[^`]+`)/);
    const p = document.createElement("p");
    for (const part of parts) {
      if (part.startsWith("`") && part.endsWith("`")) {
        const c = document.createElement("code");
        c.textContent = part.slice(1, -1);
        p.appendChild(c);
      } else {
        p.appendChild(document.createTextNode(part));
      }
    }
    div.appendChild(p);
    aside.appendChild(div);
  }

  layout.appendChild(aside);
})();
