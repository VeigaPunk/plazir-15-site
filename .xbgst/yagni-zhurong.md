# YAGNI verdict — Zhurong temptations
**Artifact:** yagni · **Session:** 0 · **Date:** 2026-08-22 · **Protocol:** v0.2 · **Effort:** low
**Axes:** minimality · non-duplication · groundedness · buildability

## Claim (one)
All three temptations delete; Zhurong ships as one in-repo page on existing plumbing. obs · confidence: certain
- Repo has **zero framework substrate**: no package.json, no build config, no CDN/@import anywhere; every page (siduri, 1337b, 512qa, snake, tetris) is hand-written sibling CSS against a local `@font-face` signature. obs · certain
- Plan already froze the clone path: "Page clones `siduri/` structure, CSS from siduri/1337b — no new framework." obs (plan-zhurong.md §3b)
- `sekhmet/index.html` is a meta-refresh stub to off-repo `sekhmet-site`; homepage links bypass it entirely (L295, L440 point at the off-repo URL). The stub solves a problem Zhurong does not have — Zhurong's content lives in-repo by spec. obs · certain
- Rover adds no axis: it is a 2021 coda on the Fire Star, already budgeted as one `textual-note` line inside `zhurong/` (plan §Coda). A rover microsite duplicates the coda and splits the tenure teaching across two URLs. obs · strong

## Deletions
| Temptation | Verdict | One-line reason |
|---|---|---|
| New CSS framework (Tailwind/etc.) | **DELETE** | Zero framework substrate in repo; siduri.css is the proven pattern, cloning it costs ~0 and keeps the site build-free. obs · certain |
| Sekhmet-style redirect stub | **DELETE** | Stub pattern exists only to park off-repo content; Zhurong is an in-repo archive note by freeze — a stub is a broken middleman. obs · certain |
| Rover microsite (scout-02) | **DELETE** | Rover = coda line in zhurong/'s textual-note, not a hero coordinate; standalone page is pure duplication of that line. obs · strong |

## Rejected alternative (kept for the record)
**Keep rover as a sibling page, Zhurong links to it.**
Rejected: the plan demoted rover-first to coda precisely because CNSA naming is a 2021 event, not the civilizational text; a sibling page re-promotes it by structure even if prose demotes it, and forces sitemap/README/homepage attach for zero new teaching. obs (plan §Data Walk, §Escalation 3) · strong

## Unknowns
- Judge M01 approval state still open; this verdict is advisory until freeze lands. asm

## Action
Read repo substrate + plan-zhurong.md + homepage/sekhmet refs in parallel → verdict shipped here. No production files touched.
