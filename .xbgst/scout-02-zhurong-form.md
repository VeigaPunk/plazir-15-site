# Scout 2 — Zhurong page FORM: sibling zhurong/ vs rover-first vs sekhmet redirect
**Protocol:** v0.2 · **Effort:** low · **Date:** 2026-08-22 · **Scope:** entire project · **Posture:** additive

## Verdict (one)
**Sibling directory `zhurong/` cloning the Siduri kit.** obs · certain
Form = `zhurong/index.html` + `zhurong/zhurong.css`, self-contained (own CSS, no `../styles.css`, no `main.js`), head kit: canonical `…/plazir-15-site/zhurong/`, `rel="up" href="../"`, og/twitter meta, Article JSON-LD, font preloads from `../assets/fonts/`, skip-link, back-link `../`. obs (siduri/index.html, 1337b/index.html) · certain
Attach = exactly two index touchpoints + three echoes: ghost button in `.leisure-links` (index.html ~L247), `<li><a class="glass" href="zhurong/">` in `<ul class="sources">` (~L496), sitemap `<url>` monthly 0.8, README line+paragraph, CHANGELOG dated entry. No header-nav item, no footer link, no shared-CSS/JS coupling. obs (index.html:244–251, 467–499; sitemap.xml; obsmap-zhurong-wiring.md) · certain
Ordering constraint: homepage gains no `zhurong/` link before `zhurong/index.html` exists (risk: broken leisure button). obs · certain

## Rejected alternatives
1. **Sekhmet-style redirect stub** — `sekhmet/index.html` is a meta-refresh to off-repo `veigapunk.github.io/sekhmet-site/`; it is in neither sitemap nor sources nor README (not a genre member). Zhurong's text is in-repo by spec, so a stub is a broken middleman with zero attach points. obs · certain
2. **Rover-first form** (CNSA rover 祝融 as page hero/coordinate) — the rover is a 2021 naming event that *borrows* the name, not the source text; form follows the frozen coordinate (Shiji 40 火正), so rover survives only as one coda line inside the office page. A rover-first page re-promotes the coda by structure and splits the tenure teaching across URLs. obs (zhurong-axis.md, dispatch-zhurong-title.md, yagni-zhurong.md) · strong

## State
- `zhurong/` absent; no zhurong string in `index.html`/`sitemap.xml`/`README.md`. obs · certain
- Genre members observed: `siduri/`, `1337b/` (both full kit). `512qa/` is leisure product, not archive note; `tetris/`, `snake/` not in sitemap. obs · certain
- Blocked on nothing for this verdict; upstream judge M01 coordinate freeze (Shiji 40 vs rover) does not change the FORM call — all three frozen-coordinate candidates still land in the Siduri-kit sibling dir. inf · strong

## Unknowns
- Judge M01 approval state open (content axis, not form axis). asm
