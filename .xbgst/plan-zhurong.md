# Plan — Zhurong archive-note insertion
**Session:** 0 | **Dispatched by:** the-judge | **Date:** 2026-08-22
**Spec:** WWKD Phase 0 · plazir-15-site · **Author:** the-planner (wwkd)

## Phase 0 — State map
- Exists: Archive-note genre on-repo twice: `siduri/` (full HTML+CSS: eyebrow, hero lede, coordinate card OB VA+BM, quoted George lines, sources) and `1337b/` (Bekker coordinate, Jowett line, Perseus URN). Homepage leisure deck links 1337b + siduri; `#sources` glass cards for both. Sekhmet is **not** an in-repo archive page: `sekhmet/index.html` is a meta-refresh to `https://veigapunk.github.io/sekhmet-site/`; Paths + glossary echo “do not smash — aim it.” Sitemap lists `/`, `/snake/`, `/1337b/`, `/siduri/` only. README documents 1337b + Siduri. Scouts in `/tmp/plazir-zhurong-scouts`: `00-qwen-take` (Shiji 40 火正 office), scout-02 (rover sibling page), scout-10 (Zhuangzi 養生主 — **category error**).
- Missing: `zhurong/` page + CSS; homepage leisure ghost button; `#sources` glass card; sitemap URL; README line; optional Paths echo parallel to Sekhmet. **No production HTML until the-judge APPROVES.**
- Risk: Primary coordinate unresolved (deity/office vs rover). Zhuangzi is the wrong tradition. Prometheus / Shanhaijing-as-executioner collapse Zhurong into Sekhmet’s smash slot. Off-repo Sekhmet pattern must not be copied as a redirect stub.

## WWKD
1. **What:** A fourth foundational archive note at `zhurong/` matching Siduri / 1337b plumbing, teaching fire as **magistracy (火正), not property** — success = one quoted primary line + coordinate card + sources, linked from leisure + sources, no fork, no rover-as-primary.
2. **Why:** Existing teachings: Siduri = joy within finitude; 1337b = leisure vs amusement as telos; Sekhmet = dual force, aim it. Missing axis is **stewardship of held power**. Evidence: Shiji 40 楚世家 naming Chongli 火正; rover is a 2021 coda on the Fire Star, not the civilizational text.
3. **Assumptions/Risks:** (a) Primary = *Shiji* 40, not CNSA naming, not Zhuangzi. (b) Page clones `siduri/` structure, CSS from siduri/1337b — no new framework. (c) Judge must pick coordinate if this recommendation is rejected. (d) Translation of 能光融天下 must be cited (ctext / Burton Watson is **not** the right book).
4. **How:** Freeze coordinate (M01) → skeleton HTML/CSS copy of siduri with placeholders verified structurally (M02, post-approval) → overfit one quote + sources (M03) → homepage/sitemap/README attach (M04) → polish (M05).
5. **Escalation points:** Deity vs rover as hero coordinate; whether Paths gets a Zhurong echo; whether rover appears only in textual-note coda; **no HTML land before judge APPROVES.**

## Data Walk
- `siduri/index.html`: Article JSON-LD, horizon-card, tablet blockquote, message, textual-note dl, numbered sources. CSS sibling `siduri.css`.
- `1337b/index.html`: coordinate-card `1337b`, passage + Greek, plazir interpretive note, Perseus outbound.
- `index.html` leisure links (L245–247): snake, 1337b, siduri. Sources (L467–495): Wookieepedia, Grokipedia, 1337b, siduri. No Zhurong.
- `sekhmet/index.html`: redirect only.
- Scout-10 Zhuangzi: rejected — wrong speaker, wrong book, not Zhurong.
- Scout-02 rover-first: rejected as **primary** — rover may be coda like “Sippar vs Tablet X.”
- Scout-00: keep — 重黎為帝嚳高辛居火正…帝嚳命曰祝融.

## Recommended freeze (advisory until judge)
| Slot | Value |
|---|---|
| Path | `zhurong/` sibling (not homepage-only) |
| Eyebrow | *Shiji* · Chu hereditary house · 火正 |
| Coordinate card | **Shiji 40** · 楚世家 · 祝融 |
| Blockquote | 「重黎為帝嚳高辛居火正，甚有功，能光融天下，帝嚳命曰祝融。」 + English from a named public edition (ctext / Nienhauser / Burton Watson *Records* if used — **not** Zhuangzi Watson) |
| Teaching | Fire is office; the office survives the officer; charter not yoke |
| Coda | CNSA rover 祝融, Utopia Planitia 2021-05-14, 「寓意點燃我國星際探測的火種」 — field note, not hero |
| Attach | leisure ghost button + sources glass card + sitemap 0.8 + README |
| Out of scope | Forks; Prometheus; Zhuangzi 養生主; production HTML pre-approval |

## Milestones
| # | Title | Gate command | Expected output | Executor |
|---|---|---|---|---|
| M01 | Freeze primary coordinate + reject list | `test -f .xbgst/plan-zhurong.md && rg -n "Shiji 40|Zhuangzi|rover" .xbgst/plan-zhurong.md` | Plan names Shiji 40 as primary; Zhuangzi rejected; rover = coda | the-judge (approve) then executor |
| M02 | Skeleton `zhurong/` cloned from siduri (post-APPROVE only) | `test -f zhurong/index.html && test -f zhurong/zhurong.css && rg -n "eyebrow|hero-lede|horizon-card\\|coordinate-card|blockquote|#sources" zhurong/index.html` | Same section set as siduri; canonical `…/zhurong/`; no live deploy required | executor |
| M03 | Overfit one quote: Shiji 40 line + 3–5 sources | `rg -n "重黎|祝融|史記|ctext" zhurong/index.html` | Chinese line + attribution + ctext/Wikisource/Shiji edition URLs; no Zhuangzi | executor |
| M04 | Homepage + sitemap + README attach | `rg -n "zhurong" index.html sitemap.xml README.md` | Leisure ghost button; sources glass card; sitemap loc; README one paragraph | executor |
| M05 | Polish: JSON-LD, a11y skip-link, Paths optional echo | `python3 -c "from pathlib import Path; t=Path('zhurong/index.html').read_text(); assert 'application/ld+json' in t; assert 'skip-link' in t"` | Article JSON-LD + skip-link present; Paths echo only if judge yes | executor |

## Milestone notes
### M1 — Skeleton (after approve)
**Does:** Copy siduri HTML/CSS into `zhurong/`, swap titles/canonical, leave quote as the Shiji line already frozen.
**Touches:** `zhurong/index.html`, `zhurong/zhurong.css` only.
**Out-of-scope:** index.html, sitemap, README.

### M2 — Overfit one real instance
**Does:** One tablet blockquote = Shiji 40 naming sentence, bit-for-bit against ctext.
**Gate:** that string present once in blockquote.

### M3 — Generalize attach points
**Does:** One leisure button, one sources card, one sitemap url — one axis (discoverability).

### M_final — Polish
JSON-LD, theme color, rover coda in textual-note, optional Paths one-liner.

## Dependencies
M01 (judge APPROVE) → M02 → M03 → M04 → M05.
Homepage must not mention Zhurong before `zhurong/index.html` exists (broken leisure link).

## Escalation to the-judge
1. Approve **Shiji 40 火正** as primary (planner recommendation) vs rover-first vs mixed hero.
2. Approve sibling page `zhurong/` vs homepage card only.
3. Approve rover as textual-note coda.
4. Reject Zhuangzi 養生主.
5. Production HTML blocked until APPROVE.

**[planner-gate: advisory, risks-open]** Coordinate freeze is the only blocker. Executors idle until judge mark.
