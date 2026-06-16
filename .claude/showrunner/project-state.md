# Project State - SmartScreen

> Authority: operational
> Status: current
> As of: 2026-06-15
> Superseded by: none
> Other authority sources: `docs/soul.md` (constitution, foundational)

## Current Phase

**Phase 1 - Core Billboard Loop**

Outcome:

A single residential lobby has a wall-mounted web display continuously
showing building messages, weather, and news - with pinned/priority messages
shown ahead of regular rotation - while building staff manage messages through
an admin web form, without ever requiring a passerby to interact.

Passing evidence:

- The display runs unattended through a full day/night cycle, rotating
  message board, weather, and news content.
- A staff member adds, edits, pins, and removes a message via the admin form,
  and the change appears on the display within an agreed refresh window.
- A message marked pinned/priority displays ahead of, or more prominently
  than, regular rotation content.
- All content is legible at a glance from typical lobby walking distance and
  speed - no interaction required.

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

## In Progress

- None - Arc Phase 1 is on `main`.

## Next

1. Plan Arc Phase 2 ("Admin Message Manager + Image Upload") via `/arc plan`.

## Deferred

- Automated emergency-alert override / full-screen takeover (D-002). Revisit
  before any real emergency-communication reliance, or at Phase 2 planning.
- Multi-building / multi-tenant configuration (D-003). Revisit when a second
  building is identified as a real target.
- Visitor management, wayfinding, and any resident-facing interactivity or
  touch UI - out of scope per constitution Truth #3 ("ambient signage, not a
  kiosk").
- Specific weather/news data providers - resolve during `/forge spec`.
- Admin-form authentication mechanism specifics - resolve during
  `/forge spec` (convention surface).

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
- Image storage for staff-uploaded message photos (D-011): `/arc plan`
  resolved the approach as a Convention Default (local filesystem under
  `data/uploads/`, gitignored, via the `ImageRef` shape defined in Arc
  Phase 1); the upload/serving implementation itself is Arc Phase 2.
- No git remote is configured (`git remote -v` empty), though
  `repository.remote: origin` and `require_remote_tip_match: true` are set.
  Flagged at `/arc init`, `/arc plan`, and `/arc run` - must be resolved
  before `/arc merge` checks remote tips; remote push was skipped this arc.
- Moderate Svelte SSR XSS advisories (`@sveltejs/kit`) exist in the
  dependency tree. Phase 1 has no user-generated content so impact is low now;
  Phase 2 admin form (message creation) must audit all user-input paths before
  shipping.
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
