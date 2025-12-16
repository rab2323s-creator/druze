async function loadIndex() {
  const res = await fetch("assets/data/search-index.json", { cache: "no-store" });
  return await res.json();
}

function norm(s) {
  return (s || "").toString().toLowerCase().trim();
}

function score(item, q) {
  const hay =
    norm(item.title) +
    " " +
    norm(item.desc) +
    " " +
    (item.tags || []).map(norm).join(" ");
  if (!q) return 0;
  if (hay.includes(q)) return 10;
  const parts = q.split(/\s+/).filter(Boolean);
  let hits = 0;
  for (const p of parts) if (hay.includes(p)) hits++;
  return hits;
}

async function runSearch() {
  const lang = document.documentElement.lang || "ar";
  const input = document.querySelector("#q");
  const list = document.querySelector("#results");

  const idx = await loadIndex();

  function render() {
    const q = norm(input.value);
    const filtered = idx
      .filter((x) => x.lang === lang)
      .map((x) => ({ ...x, s: score(x, q) }))
      .filter((x) => (q.length ? x.s > 0 : true))
      .sort((a, b) => b.s - a.s)
      .slice(0, 30);

    list.innerHTML = "";

    if (q.length && filtered.length === 0) {
      list.innerHTML = `<div class="small">لا نتائج مطابقة.</div>`;
      return;
    }

    for (const it of filtered) {
      const el = document.createElement("a");
      el.href = it.url;
      el.className = "item";
      el.innerHTML = `
        <div class="meta">${(it.tags || []).slice(0, 2).join(" • ")}</div>
        <div>
          <h4>${it.title}</h4>
          <p>${it.desc}</p>
        </div>
      `;
      list.appendChild(el);
    }
  }

  input.addEventListener("input", render);
  render();
}

document.addEventListener("DOMContentLoaded", runSearch);
