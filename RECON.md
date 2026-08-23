# RECON — archive-note attach from homepage

Pin: `TOKEN_PLAN_SLOT=gmail xask --gs -e low qwen38` (not cdx). Artifact also at `.xbgst/obsmap-zhurong-wiring.md`.

## Axes

- **Discoverability:** homepage leisure + sources + sitemap
- **Isolation:** archive pages own CSS, no `main.js`
- **Minimality:** no primary-nav items for notes
- **Genre:** in-repo article vs sekhmet redirect stub

## Surface map

Homepage `index.html` does not list archive notes in `#` nav. Notes attach as **relative directory URLs**.

### Leisure (`#leisure` · `.leisure-links`)

```
snake/          primary CTA
1337b/          ghost — Explore Politics 1337b
siduri/         ghost — Read Siduri’s counsel
512qa/          ghost (leisure product, not archive-note)
external xbrd   highlights
```

### Sources (`#sources` · `.sources` glass cards)

Only two in-repo archive notes:

- `href="1337b/"` — Primary text · Aristotle Politics VIII.2–3
- `href="siduri/"` — Gilgamesh · Siduri’s counsel

Canon sources stay off-site (Wookieepedia, Grokipedia).

### sitemap.xml (4 URLs)

`/`, `/snake/`, `/1337b/`, `/siduri/` — monthly, 0.8 for notes.

**Not in sitemap:** `512qa/`, `tetris/`, `sekhmet/`.

### Page kit (observed)

| Path | CSS | Back link | JSON-LD |
|------|-----|-----------|---------|
| `siduri/` | `siduri.css` | `../` | Article |
| `1337b/` | `1337b.css` | `../#leisure` | Article |

Shared: canonical `…/plazir-15-site/<slug>/`, `rel="up"`, fonts under `../assets/`, skip-link.

### Echoes (not required for crawl, used on prior launches)

- `README.md` URL + paragraph
- `CHANGELOG.md` dated entry
- Pages workflow: whole-tree upload — no per-page list

## FINDINGS

FINDING: Archive notes attach at two index points plus sitemap.
SOURCE: index.html:244–251, 467–495; sitemap.xml
CONFIDENCE: high
IMPLICATION: `zhurong/` needs the same two `href`s plus one sitemap `<url>`.

FINDING: Nav never names Siduri or 1337b.
SOURCE: index.html:42–63
CONFIDENCE: high
IMPLICATION: Do not add a header item for Zhurong.

FINDING: sekhmet is a different genre (meta-refresh off-repo).
SOURCE: sekhmet/index.html
CONFIDENCE: high
IMPLICATION: Reject sekhmet stub as the Zhurong vehicle.

## Files for zhurong/

**New:** `zhurong/index.html`, `zhurong/zhurong.css` (Siduri kit).

**Touch:** `index.html` (leisure ghost + sources `<li>`), `sitemap.xml`, `README.md`, `CHANGELOG.md`.

**Leave:** `styles.css`, `main.js`, header/footer, `pages.yml`.

## Claim (qwen38 + recon)

Archive-note genre attaches through **two index touchpoints (leisure ghost + sources glass) plus sitemap/README/CHANGELOG** — no nav, footer, or shared CSS/JS. Homepage must not link `zhurong/` before the page exists.

## Rejected alt

Sekhmet-style redirect stub (not sitemap-listed, no sources card, wrong genre). Secondary reject: primary-nav item (nav is hash-only).
