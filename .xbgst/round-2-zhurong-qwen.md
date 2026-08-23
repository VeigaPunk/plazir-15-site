# Round 2 — concurrent qwen38 Zhurong scouts
**Date:** 2026-08-22 · **Lane:** `TOKEN_PLAN_SLOT=gmail xask --gs -e low qwen38`  
**Fast servicing:** not sent (`SERVICE_TIER: default`; argv has no `-c service_tier=fast`)

## Preflight
```
LANE: token-plan-qwen38
ARGV: … -c approval_policy="never" -c model_reasoning_effort=low
SERVICE_TIER: default
```
Explicit `--service-tier fast` on this model fails closed in PATH xask. Wave did not pass that flag.

## Wave
13 concurrent PATH `xask` jobs under `/tmp/plazir-zhurong-scouts-r2/`. All 13 stdout files >1kB. Zero `does not advertise the fast service tier`. Zero `service_tier=fast` in stderr.

| Probe | stdout bytes | Notes |
|---|---:|---|
| 00-qwen-take | 2804 | Shiji 40 火正 office; rover not primary |
| scout-01 | 1956 | sources-card insertion |
| scout-02 | 1792 | sibling `zhurong/` vs redirect |
| scout-03 | 1224 | sitemap loc |
| scout-04 | 2452 | 1337b schole/paidia |
| scout-05 | 1843 | vs Sekhmet axis |
| scout-06 | 2250 | rover as tablet? |
| scout-07 | 1818 | uninhabitable shore |
| scout-08 | 1393 | eyebrow + lede |
| scout-09 | 2063 | kitsch reject |
| scout-10 | 2162 | 「重黎為帝嚳高辛居火正…帝嚳命曰祝融。」 Zhuangzi rejected |
| scout-11 | 2681 | leisure + sources hrefs |
| scout-12 | 2430 | title/subtitle/coordinate |

## Coordinate (still advisory until HTML land)
Primary *Shiji* 40 楚世家 naming sentence. Zhuangzi 養生主 remains a category error. Rover is coda, not hero.

Production `zhurong/` HTML still absent until a later APPROVE.
