# Scout 6 verdict — rover-as-tablet-coordinate: category error
**Protocol:** v0.2 · **Effort:** low · **Date:** 2026-08-22 · **Scope:** entire project · **Posture:** additive

## Goal
Is Zhurong/Tianwen-1 (CNSA rover, Utopia Planitia 2021-05-14/15) a valid tablet coordinate in the Siduri sense, or a category error? One verdict.

## Verdict (one)
**Category error — not a valid tablet coordinate.** The rover fails all three load-bearing properties of the Siduri coordinate slot; its only on-genre placement is coda / reading-trail link. Confidence: strong (inf on slot theory, obs on every page fact).

### The Siduri sense of "tablet coordinate" (obs, certain — siduri/index.html + 1337b/index.html)
Both archive notes run the same machinery: a coordinate card beside one quoted primary line, locating that line inside an older witness.
1. **Witness-ness:** the coordinate points at the physical/canonical witness holding the quoted speech itself — Siduri: "OB VA+BM · Sippar fragment · column III" (horizon-card, aria-label "Textual coordinate"); 1337b: Bekker 1337b (coordinate-card). Modern commentary (George, Voth, Jowett) is kept in explicitly secondary slots.
2. **Recension relation:** the coordinate exists to track transmission variants of one tradition — OB Sippar parallel *beside* Standard Babylonian Tablet X; the note is about the witness being older-and-different.
3. **Upstream direction:** sources is titled "Follow the tablet upstream" — the coordinate must be older than every interpretation layered on it.

### Why the rover fails the slot
- **No witness-ness:** the rover is the *named*, not a witness. It carries instrument data, no Zhurong line; there is nothing to put in the `article.tablet` blockquote with a cite attribute. obs · strong
- **No recension relation:** CNSA statements / mission papers are reports downstream of the event — data release → interpretation is citation, not witness-variant. In Siduri's own layout that is the Andrew George slot, never the horizon-card. obs · strong
- **Inverts the upstream arrow:** a 2021 naming act (寓意點燃我國星際探測的火種) is the *youngest* item in any Zhurong chain — it borrows the name from Shiji 40's tradition, so giving it coordinate weight cites the borrower as authority over the lender (adversarial-rover-mix.md: provenance inversion; on a fan codex it also crosses the real-state ↔ fan-canon line no other note crosses). obs · strong

### Distinction (two species of error in this repo)
- **Zhuangzi 養生主** = wrong-text category error: wrong speaker, wrong book, not Zhurong at all (plan-zhurong.md, dispatch-zhurong-gates.md Gate 2). obs · certain
- **CNSA rover** = right-name / wrong-slot error: genuinely Zhurong-named, but a naming *event* and modern object, not a source text. Invalid *as coordinate*; valid as coda. obs · strong

## Where the rover does sit (obs — project freeze)
- `textual-note` coda: "CNSA rover 祝融, Utopia Planitia 2021-05-14, 寓意點燃我國星際探測的火種 — field note, not hero" (plan-zhurong.md §Coda; zhurong-office-vs-rover.md "rover = coda"; yagni-zhurong.md: already budgeted as one line, microsite = duplication).
- Or a `#sources` reading-trail link, downstream, the way Penguin is cited. inf · strong
- The valid Zhurong tablet coordinate is **Shiji 40 楚世家** — the witness holding the naming line 「重黎為帝嚳高辛居火正，甚有功，能光融天下，帝嚳命曰祝融」 (plan-zhurong.md freeze; scout-00).

## Rejected alternative
*"The rover is a tablet because both are material records fixing data on a surface — a future tablet sitting on Mars."* Rejected (inf · strong): the analogy preserves only materiality and discards everything the coordinate does — witness-ness, recension relation, upstream temporal direction. With only "old object holding data" kept, *tablet* becomes decoration; and the rover is neither old relative to the tradition nor upstream of it.

## Unknowns
- Specific CNSA/Nature rover citations unverified (network restricted); the verdict is slot-structural and holds for any paper — any report is downstream. asm · low-risk
- Judge M01 freeze approval state upstream of this scout; verdict is consistent with the advisory freeze. asm

## Action
Read siduri/index.html + 1337b/index.html + all 13 .xbgst zhurong artifacts + /tmp scouts in parallel → verdict shipped here. No production HTML touched.
