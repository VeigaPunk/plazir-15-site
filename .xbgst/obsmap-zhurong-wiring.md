# Observe-map — archive-note wiring (Siduri / 1337b) and zhurong/ attach surface
**Protocol:** v0.2 · **Effort:** low · **Date:** 2026-08-22 · **Posture:** additive

## Wiring map — how Siduri/1337b are wired from index leisure+sources+sitemap
1. **Self-contained page dir** (obs, certain): `siduri/index.html`+`siduri.css` (233+812 ln), `1337b/index.html`+`1337b.css` (255+863 ln). Own CSS only — no `../styles.css`, no `main.js`. Head kit: canonical `https://veigapunk.github.io/plazir-15-site/<slug>/`, `rel="up" href="../"`, og/twitter meta, Article JSON-LD, font preloads from `../assets/fonts/`, favicon `../assets/favicon.svg`, skip-link, back-link to `../` or `../#leisure`.
2. **index.html `#leisure`** (obs, certain): `.leisure-links` at index.html:244–251 — one ghost button each: `<a class="btn btn-ghost" href="1337b/">Explore Politics 1337b</a>` (L246), `<a class="btn btn-ghost" href="siduri/">Read Siduri’s counsel</a>` (L247).
3. **index.html `#sources`** (obs, certain): `<ul class="sources">` at index.html:467–499 — one `<li><a class="glass" href="<slug>/">` per page carrying `.src-label`/`.src-title`/`.src-desc` spans (1337b L483–488, siduri L490–495).
4. **sitemap.xml** (obs, certain): one `<url>` block each (`/1337b/`, `/siduri/`), `changefreq=monthly`, `priority=0.8`. Only 4 URLs total (/, /snake/, /1337b/, /siduri/).
5. **README.md** (obs, certain): bold URL line + one description paragraph per page (L11–13, L25–27).
6. **CHANGELOG.md** (obs, certain): dated entry per page launch (2026-08-18 1337b, 2026-08-19 Siduri).

**Non-touchpoints** (obs, certain): header nav is anchor-only (`#leisure`, `#sources` — index.html:46–62); footer has no page links; `.github/workflows/pages.yml` uploads `path: .` whole-repo (no per-page registration); `404.html` lists nothing; `sekhmet/` is a meta-refresh stub to an off-repo site and is in **neither** sitemap nor sources (not a genre member).

## Files to change for zhurong/
| # | File | Change | Status |
|---|------|--------|--------|
| 1 | `zhurong/index.html` | NEW — clone siduri head kit + structure; swap title/canonical/JSON-LD/quote | obs pattern |
| 2 | `zhurong/zhurong.css` | NEW — clone siduri.css | obs pattern |
| 3 | `index.html` | 2 edits: ghost button in `.leisure-links` (~L247); `<li><a class="glass" href="zhurong/">` card in `<ul class="sources">` (~L496) | obs |
| 4 | `sitemap.xml` | +1 `<url>` block `…/zhurong/` monthly 0.8 | obs |
| 5 | `README.md` | +URL line + one paragraph | obs |
| 6 | `CHANGELOG.md` | +dated entry (convention) | obs |

## Claim (one)
The archive-note genre attaches through exactly **two index touchpoints (leisure ghost button + sources glass card) plus sitemap/README/CHANGELOG echoes** — no nav, footer, shared CSS, or JS coupling (obs, certain). Therefore zhurong/ lands as 2 new files + 4 touched files with zero blast radius on existing pages, and the homepage must gain no zhurong link before `zhurong/index.html` exists (risk: broken leisure button; plan-zhurong.md dependency confirms). Confidence: certain.

## Rejected alternative
**Sekhmet-style redirect stub** (`sekhmet/index.html` = meta-refresh to `veigapunk.github.io/sekhmet-site/`) as the zhurong/ vehicle — rejected: not sitemap-listed, no sources card, no in-repo text, wrong genre (obs, certain; plan-zhurong.md already flags "off-repo Sekhmet pattern must not be copied"). Subsidiary reject: adding a header-nav item — nav is anchor-only for every existing page; a zhurong nav entry would break established minimality (obs, strong).

## Unknowns
- Judge M01 coordinate approval state (Shiji 40 vs rover) lives upstream; this map is content-agnostic (asm).
- Optional Paths-section echo for Zhurong (Sekhmet gets one in index prose) is a judge call, not in the minimal attach set (asm).
