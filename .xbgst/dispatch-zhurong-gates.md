# Dispatch result — 3 file-level gates for zhurong/ (cloned from siduri)
**Protocol:** v0.2 · **Effort:** low · **Date:** 2026-08-22 · **Posture:** additive

## Gate 1 — blockquote present
`zhurong/index.html` carries ≥1 `<blockquote>` and the Shiji 40 naming line exactly once:
```
grep -q '<blockquote' zhurong/index.html && [ "$(grep -c '重黎為帝嚳高辛居火正' zhurong/index.html)" -eq 1 ]
```
**Claim:** the archive-note genre is one quoted primary line — siduri's genre center is a `<blockquote cite=…>` inside `article.tablet` (siduri/index.html L99–121), so the clone's gate must assert the Shiji-40 string, not just structure (obs, certain).
**Rejected alt:** gate on `<article class="tablet">` container alone — an empty or wrong-quote page passes; container ≠ counsel (inf, strong).

## Gate 2 — no Zhuangzi
Zero Zhuangzi traces in page + CSS:
```
! grep -qiE 'zhuangzi|zhuang|莊子|養生主' zhurong/index.html zhurong/zhurong.css
```
**Claim:** scout-10's 養生主 is a category error (wrong speaker, wrong book, not Zhurong) and the clone inherits siduri's full body, so a grep-0 negative gate is the only check that catches residual scout contamination (obs, certain).
**Rejected alt:** Zhuangzi 養生主 as the blockquote content — rejected in plan-zhurong.md Data Walk; lands a non-Zhurong voice in the tablet slot (obs, certain).

## Gate 3 — sitemap loc
Exactly one absolute `<loc>` for the new page in sitemap.xml:
```
[ "$(grep -c '<loc>https://veigapunk.github.io/plazir-15-site/zhurong/</loc>' sitemap.xml)" -eq 1 ]
```
**Claim:** sitemap.xml currently lists only `/`, `/snake/`, `/1337b/`, `/siduri/` (obs, certain); M04 requires the loc at 0.8 to match siblings — the discoverability axis is not complete until crawlers see it (obs, strong).
**Rejected alt:** homepage leisure-link only, skip sitemap — leaves the page off the crawl surface and fails plan M04's explicit gate `rg -n "zhurong" index.html sitemap.xml README.md` (obs, certain).

## State
zhurong/ absent from repo (obs). Gates are pre-execution; run post-clone. JSON-LD/skip-link polish gate = plan M05, not in this triple.
