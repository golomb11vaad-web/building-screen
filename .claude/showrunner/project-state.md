# Project State - SmartScreen

> Authority: operational
> Status: current
> As of: 2026-06-18 (Ambient Hearth design merge + Phase 1 completion)
> Superseded by: none
> Other authority sources: `docs/soul.md` (constitution, foundational)

## Current Phase

**Phase 1 — Complete**

Phase 1 is demoable end-to-end: three message styles (plain, background,
slideshow), admin message manager with scheduling, weather and news sidebar,
Hebrew throughout, and the Ambient Hearth visual design system — all verified
by the inventor's informal resonance check (D-009).

Outcome:

The public display at `/` is a dark, warm, typographically considered lobby
screen using the Ambient Hearth design system (D-013–D-017): deep warm umber
base (`#19120d`), self-hosted Heebo Hebrew font, warm amber accent (`#ffb77e`),
400ms fade transitions between messages. A persistent left-edge sidebar (RTL)
shows weather (64px temperature, Hebrew condition label, high/low, timestamp)
and up to 5 Ynet news headlines. The message board occupies the dominant
right-side area with large 84px display-lg Hebrew text. Pinned messages show
a terracotta dot indicator.

The admin at `/admin` uses the same dark Ambient Hearth palette with
bottom-border-only inputs, accent submit buttons, and style badges.

Passing evidence:

- A resident glances at the lobby display and sees a dark, warm screen with
  large Hebrew text, weather hierarchy, and news headlines — legible at a
  glance, residential and intentional.
- If weather or news fetch fails, a warm Hebrew placeholder is shown rather
  than a blank panel or error message.
- Calcalist RSS URL is currently dead (404); widget shows Ynet-only until a
  valid Calcalist URL is configured (D-006 direction preserved; graceful
  degradation via `Promise.allSettled`).

## Completed

- Constitution approved (`docs/soul.md`, 2026-06-15).
- Phase 1 plan approved (`project-state.md`, decisions D-001-D-004),
  2026-06-15.
- Phase 1 spec approved and `arc-ready`
  (`.claude/showrunner/specs/phase-1-core-billboard-loop.md`, decisions
  D-005-D-012), 2026-06-15.
- Arc Phase 1 ("Foundation + Message Board") plan rendered and
  `prompt-ready`: `.claude/showrunner/plans/2026-06-15-core-billboard-loop/`
  (`overview.md`, `questions.md`, `task-1.md`..`task-13.md`, `prompt.md`),
  2026-06-15.
- Arc Phase 1 implemented and verified: `SHIP` on `6db0386`
  (`feat/core-billboard-loop`), 2026-06-16. 26/26 tests pass, build clean,
  audit gate passed, one Medium finding resolved (ARC-VERIFY-001:
  `svelte/internal` replaced with public `tick`).
- Arc Phase 1 merged to `main` (merge commit `79da136`), 2026-06-16.
- Arc Phase 2 ("Admin Message Manager + Image Upload") plan written and
  `prompt-ready` (`.claude/showrunner/plans/2026-06-16-admin-message-manager/`,
  16 files: `questions.md` RESOLVED, `overview.md`, `task-1.md`..`task-13.md`,
  `prompt.md`), 2026-06-16.
- Arc Phase 2 implemented and verified: `SHIP` on `227ca6e`
  (`feat/admin-message-manager`), 2026-06-16. 89/89 tests pass (16 test files),
  build clean, audit gate passed. Key process deviation: same `core.hooksPath`
  absolute-path fix required as Phase 1.
- Arc Phase 2 merged to `main` (merge commit `8ee49a7`), 2026-06-16.
- Arc Phase 3 ("Weather + News Widgets and Sidebar Integration") plan written
  and `prompt-ready` (`.claude/showrunner/plans/2026-06-16-weather-news-widgets/`,
  11 files: `questions.md` EMPTY, `overview.md`, `task-1.md`..`task-8.md`,
  `prompt.md`), 2026-06-16.
- Arc Phase 3 implemented and verified: `SHIP` on `493fba1`
  (`feat/weather-news-widgets`), 2026-06-16. 115/115 tests pass (21 test
  files), build clean, audit gate passed. Key process note: Calcalist RSS URL
  is dead (404); widget degrades gracefully to Ynet-only via `Promise.allSettled`.
- Arc Phase 3 merged to `main` (merge commit `99f9f7e`), 2026-06-16.
- Admin edit bug fixed: `afterNavigate` hook in `+page.svelte` repairs form
  pre-population on client-side navigation (`796352f`), 2026-06-18.
- `/forge design` completed: designer brief approved, Stitch "Ambient Hearth"
  delivery reviewed, decisions D-013–D-017 recorded, 2026-06-18.
- Arc "Ambient Hearth Design" implemented and verified: `SHIP` on `70e3a97`
  (`feat/ambient-hearth-design`), 2026-06-18. 115/115 tests pass, build clean.
  13 files restyled: Heebo font, dark token system, display surfaces, admin
  dark mode. New dependency: `@fontsource/heebo`.
- Arc "Ambient Hearth Design" merged to `main` (merge commit `1571190`),
  2026-06-18.
- Phase 4 gate resolved: resonance check findings (edit bug + visual design)
  addressed by separate arcs. No additional Phase 4 dispatch needed.

## In Progress

- None.

## Next

1. Resolve Calcalist RSS URL (D-006): find a working Calcalist RSS feed URL
   and update `CALCALIST_RSS` in `src/lib/server/news.ts` — no other code
   changes required.
2. Device smoke on wall-mounted display hardware once available
   (`smoke.required_for: [runtime_state, device, external_ops]`).
3. Display type scale verification at actual viewing distance (55"–75" screen,
   2–10m) — deferred until hardware provisioned.

## Deferred

- Automated emergency-alert override / full-screen takeover (D-002). Revisit
  before any real emergency-communication reliance, or at Phase 2 planning.
- Multi-building / multi-tenant configuration (D-003). Revisit when a second
  building is identified as a real target.
- Visitor management, wayfinding, and any resident-facing interactivity or
  touch UI - out of scope per constitution Truth #3 ("ambient signage, not a
  kiosk").
- Specific weather/news data providers - resolve during `/forge spec`.
- Admin-form authentication mechanism specifics — resolved in Phase 2
  (HMAC-SHA256 session token, HttpOnly cookie, SameSite=Strict, 8h).

## Locked Decisions

- D-001: platform is a browser-based web app on a wall-mounted display.
- D-002: Phase 1 surfaces = message board + admin message manager + weather +
  news; emergency override deferred; message board carries a
  pinned/priority flag.
- D-003: single building now; avoid hardcoding that would block future reuse.
- D-004: content management via a lightweight admin web form.
- D-005: display layout is message-board-dominant with a weather/news sidebar
  on the left edge (RTL).
- D-006: news source is Ynet + Calcalist (Hebrew, Israeli).
- D-007: admin authentication is a single shared staff password.
- D-008: UI language is Hebrew throughout, RTL layout.
- D-009: informal resonance checks substitute for a formal `/wow-check` SHIP
  verdict in Phase 1.
- D-010: each message has a display style - plain text, photo slideshow with
  text overlay, or text on a beautiful background.
- D-011: background/slideshow images come from staff uploads plus a small
  curated default set.
- D-012: messages may carry an optional weekly day-of-week schedule, optionally
  bounded by an active date range.

## Risks And Dependencies

- Truth #1 ("urgent info always comes first") is only partially addressed in
  Phase 1 via pinning - a real emergency before Phase 2's override exists may
  not be adequately surfaced. Mitigation: the constitution already states
  SmartScreen is never a replacement for staff/emergency channels (PA, fire
  alarm, etc.); prioritize the override in Phase 2.
- Weather and news widgets depend on third-party data APIs (provider choice
  deferred to `/forge spec`) - availability, rate limits, and cost are
  dependencies to resolve there.
- Physical display hardware (wall-mounted screen + device running the
  browser) is not yet specified, and is required before Arc can run the
  configured device/runtime smoke checks.
- Image storage for staff-uploaded message photos (D-011): resolved in Phase 2
  — `data/uploads/<uuid>.<ext>` (gitignored), served at `/uploads/[filename]`
  with path traversal guard and immutable cache headers.
- No git remote is configured (`git remote -v` empty), though
  `repository.remote: origin` and `require_remote_tip_match: true` are set.
  Flagged at `/arc init`, `/arc plan`, and each `/arc run` - must be resolved
  before `/arc merge` checks remote tips; remote push was skipped in Phase 1
  and Phase 2.
- Moderate Svelte SSR XSS advisories (`@sveltejs/kit`) exist in the
  dependency tree. Phase 2 admin form and Phase 3 news widget both audited:
  all text rendered via `{text}` / `{item.title}` bindings (never `{@html}`);
  risk remains low for current scope.
- **Calcalist RSS URL dead**: `https://www.calcalist.co.il/Rss/0,7340,L-8,00.xml`
  returns HTTP 404 (confirmed during Phase 3 Step 0). D-006 is preserved as
  direction; `getNews()` degrades gracefully to Ynet-only via
  `Promise.allSettled`. Update `CALCALIST_RSS` in `src/lib/server/news.ts`
  when a valid URL is found — no other code changes required.
- RSS feed format drift: Ynet/Calcalist item field names or structure may
  change. The `parseRssItems` try/catch returns empty arrays on parse error;
  last-known-good cache mitigates short outages but not permanent changes.
- `esbuild` high advisory (dev server path only) — do not expose the Vite
  dev server on untrusted networks.

## Open Questions

- None at this time.

## Surfaces

- Message Board (Display): primary resident-facing surface showing rotating
  building messages and notices - each as plain text, a photo slideshow with
  text overlay, or text on a beautiful background (D-010) - with
  pinned/priority messages shown ahead of or more prominently than regular
  ones, and some messages shown only on scheduled day(s)/date ranges (D-012).
- Weather Widget (Display): current conditions and a short forecast for the
  building's location, shown as part of the display rotation/layout.
- News Widget (Display): headline feed (local and/or general), shown as part
  of the display rotation/layout.
- Admin: Message Manager (Staff-facing): authenticated web form for building
  staff to create, edit, pin/unpin, schedule, and remove messages, including
  choosing a message's display style and attaching images - staff-uploaded or
  curated defaults (D-011).
