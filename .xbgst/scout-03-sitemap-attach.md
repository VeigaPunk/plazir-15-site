# Scout 3 — sitemap.xml attach for zhurong/
**Artifact:** scout-claim · **Date:** 2026-08-22 · **Effort:** low · **Status:** pre-execution (M04 attach block, no production file touched)

## Claim (one)
The zhurong/ sitemap entry must clone the siduri/ `<url>` block verbatim with only the path segment swapped — absolute loc `https://veigapunk.github.io/plazir-15-site/zhurong/`, `changefreq` monthly, `priority` 0.8 — appended after the siduri entry. obs · confidence: certain

Evidence (all obs, certain):
- siduri loc is absolute `https://veigapunk.github.io/plazir-15-site/siduri/` (sitemap.xml L19), monthly / 0.8; siblings `/snake/`, `/1337b/` identical shape.
- Site base confirmed by origin `git@github.com:VeigaPunk/plazir-15-site.git` → Pages host `veigapunk.github.io/plazir-15-site`.
- robots.txt already points crawlers at this sitemap (`Sitemap: https://veigapunk.github.io/plazir-15-site/sitemap.xml`), so the new loc inherits discovery with zero extra wiring.
- Matches dispatch-zhurong-gates.md Gate 3 exact string: `grep -c '<loc>https://veigapunk.github.io/plazir-15-site/zhurong/</loc>' sitemap.xml` == 1.

## Pre-state
`sitemap.xml` has 4 `<loc>` entries (`/`, `/snake/`, `/1337b/`, `/siduri/`); 0 zhurong matches. obs

## Attach block (executor pastes before `</urlset>`)
```xml
  <url>
    <loc>https://veigapunk.github.io/plazir-15-site/zhurong/</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
```

## Verify (post-attach)
```bash
[ "$(grep -c '<loc>https://veigapunk.github.io/plazir-15-site/zhurong/</loc>' sitemap.xml)" -eq 1 ]
[ "$(grep -c '<loc>' sitemap.xml)" -eq 5 ]
xmllint --noout sitemap.xml 2>/dev/null || python3 -c "import xml.dom.minidom;xml.dom.minidom.parse('sitemap.xml')"
```

## Rejected alternative
Relative loc (`/plazir-15-site/zhurong/` or `zhurong/`) — sitemaps.org schema requires absolute URLs and every existing entry is absolute; a relative loc is invalid and breaks the uniform pattern. obs · certain

## Risk
Attach before `zhurong/index.html` lands → loc 404s for crawlers. Sequence: M02/M03 page first, M04 attach second (per plan-zhurong.md). risk · moderate
