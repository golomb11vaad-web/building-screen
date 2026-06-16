# Decisions

## Decision D-001 - Platform: browser-based web app on a wall-mounted display

**Date:** 2026-06-15
**Status:** approved
**Decision:** SmartScreen Phase 1 runs as a browser-based web app, displayed
full-screen on a wall-mounted TV/monitor - not a native smart-TV app and not a
touch kiosk.
**Previous value or alternatives:** Smart TV native app; dedicated
tablet/kiosk device.

**Rationale:**

- Browser-based deployment is the most flexible to build and update remotely.
- A passive wall display matches constitution Truth #3 ("ambient signage, not
  a kiosk").

**Evidence or precedent:**

- Inventor selection during `/forge plan` GATE round 1.

**Consequences:**

- Enables standard web tooling, fast iteration, and remote updates without
  app-store or TV-platform constraints.
- Defers touch interaction and native TV-platform integration unless revisited.

**Affected artifacts:**

- `.claude/showrunner/project-state.md` (Current Phase, Surfaces)
- Phase 1 specification (technical direction)

**Revisit trigger:** the lobby's display hardware can't reliably run a browser
in kiosk/full-screen mode.

## Decision D-002 - Phase 1 surface scope and emergency-override deferral

**Date:** 2026-06-15
**Status:** approved
**Decision:** Phase 1 ships exactly three resident-facing surfaces (message
board, weather widget, news widget) plus one staff-facing surface (admin
message manager); an automated emergency-alert override is deferred to a
later phase. The message board must support a "pinned/priority" message
concept in Phase 1 as a partial mitigation for constitution Truth #1.
**Previous value or alternatives:** Including an automated full-screen
emergency-alert override in Phase 1.

**Rationale:**

- Keeps Phase 1 a focused, demoable loop.
- Truth #1 ("urgent info always comes first") is partially honored via
  pinning; full interrupt-whatever-is-showing behavior needs more design and
  is deferred rather than rushed.

**Evidence or precedent:**

- Inventor selection during `/forge plan` GATE round 1 (V1 Scope question -
  emergency override not selected).

**Consequences:**

- Enables a shippable, coherent Phase 1.
- Defers automated full-screen emergency takeover.
- Requires the message data model to carry a priority/pinned flag from
  Phase 1 onward.

**Affected artifacts:**

- `.claude/showrunner/project-state.md` (Surfaces, Deferred, Risks)
- Phase 1 specification

**Revisit trigger:** before any real emergency-communication reliance on
SmartScreen, or at Phase 2 planning.

## Decision D-003 - Rollout posture: single building, reuse-aware

**Date:** 2026-06-15
**Status:** approved
**Decision:** SmartScreen Phase 1 is built and configured for one specific
building, but avoids hardcoding choices (building identity, location, message
storage shape) that would block configuring a second building later.
**Previous value or alternatives:** Purely single-building hardcoded build;
or a full multi-tenant product from day one.

**Rationale:**

- Multi-tenant architecture upfront would slow Phase 1 without evidence it's
  needed yet.
- Avoiding hardcoded building-specific values keeps the door open without
  paying the cost of full multi-tenancy now.

**Evidence or precedent:**

- Inventor selection during `/forge plan` GATE round 1 (Rollout question).

**Consequences:**

- Enables faster Phase 1 delivery for the one real building.
- Defers multi-tenant admin, per-building theming/config UI, and
  account/org models until evidence of need.

**Affected artifacts:**

- Phase 1 specification (technical direction)
- `.claude/showrunner/project-state.md` (Deferred)

**Revisit trigger:** a second building is identified as a real target.

## Decision D-004 - Content management via admin web form

**Date:** 2026-06-15
**Status:** approved
**Decision:** Building staff create, edit, pin/unpin, and remove messages
through a lightweight authenticated admin web form, not a raw config file or
direct database edits.
**Previous value or alternatives:** Editing a shared JSON/YAML config file or
database row directly; deferring this choice to `/forge spec`.

**Rationale:**

- Matches how building staff would actually operate day to day.
- A raw config file would be a real barrier to use even in Phase 1.

**Evidence or precedent:**

- Inventor selection during `/forge plan` GATE round 1 (Content Mgmt
  question).

**Consequences:**

- Enables non-technical staff to manage content without developer
  involvement.
- The specific authentication mechanism for the admin form is left to
  `/forge spec` (convention surface).

**Affected artifacts:**

- `.claude/showrunner/project-state.md` (Surfaces - adds "Admin: Message
  Manager")
- Phase 1 specification

**Revisit trigger:** none.

## Decision D-005 - Display layout: message board dominant with ambient sidebar

**Date:** 2026-06-15
**Status:** approved
**Decision:** The Phase 1 display dedicates the majority of the screen to the
Message Board (large, glanceable from a distance), with Weather and News
widgets in a persistent sidebar. In the RTL layout (D-008), the sidebar sits
on the screen's left edge.
**Previous value or alternatives:** full-screen rotation between surfaces;
equal three-way split-screen.

**Rationale:**

- Keeps building-specific messages (Truths #1 and #2) the most prominent
  content at all times.
- Ambient info (weather/news) stays continuously visible rather than waiting
  for a rotation slot (Truth #3 - glanceable, nothing to wait for).

**Evidence or precedent:**

- Inventor selection during `/forge spec` GATE round 1 (Layout question).

**Consequences:**

- Enables building messages to always dominate the visual hierarchy, with
  ambient widgets always visible.
- Defers full-screen takeover for any single surface other than the deferred
  emergency override (D-002).

**Affected artifacts:**

- Phase 1 specification (sections 3, 8)

**Revisit trigger:** none.

## Decision D-006 - News source: Ynet + Calcalist (Hebrew, Israeli)

**Date:** 2026-06-15
**Status:** approved
**Decision:** The News Widget sources headlines from Ynet (general Israeli
news) and Calcalist (Israeli business/tech news) RSS feeds, displayed in
Hebrew.
**Previous value or alternatives:** general/international headline feed;
local-news-only feed from a different source.

**Rationale:**

- Directly satisfies Truth #2 ("hyper-local... not generic filler") using the
  inventor's own named sources.
- Confirms the building's resident base is Hebrew-speaking, informing D-008.

**Evidence or precedent:**

- Inventor's direct answer during `/forge spec` GATE round 1 (News Scope
  question).

**Consequences:**

- Enables news content residents recognize and care about.
- Defers any English-language news source for Phase 1.

**Affected artifacts:**

- Phase 1 specification (sections 2, 5, 6)

**Revisit trigger:** Ynet/Calcalist RSS feeds become unavailable or change
format/license terms.

## Decision D-007 - Admin authentication: single shared staff password

**Date:** 2026-06-15
**Status:** approved
**Decision:** The Admin Message Manager is protected by a single shared
password known to building staff/concierge; no individual accounts in
Phase 1.
**Previous value or alternatives:** individual staff accounts;
network-restriction-only (no login).

**Rationale:**

- Simplest workable protection for one building with a small staff group in
  Phase 1.

**Evidence or precedent:**

- Inventor selection during `/forge spec` GATE round 1 (Admin Auth question).

**Consequences:**

- Enables minimal setup with no user-management system in Phase 1.
- Defers a per-staff audit trail (who posted/edited/removed a message).

**Affected artifacts:**

- Phase 1 specification (sections 3, 5)

**Revisit trigger:** evidence of misuse, need for accountability, or a second
building (D-003) requiring per-building staff separation.

## Decision D-008 - UI language: Hebrew throughout, RTL layout

**Date:** 2026-06-15
**Status:** approved
**Decision:** All on-screen text across SmartScreen Phase 1 (message board
content, labels, weather widget, admin form) is in Hebrew, with a
right-to-left (RTL) layout. The sidebar from D-005 sits on the screen's left
edge.
**Previous value or alternatives:** English UI with Hebrew only in the news
feed (mixed-language); bilingual Hebrew+English content.

**Rationale:**

- Consistent with the Hebrew-language news sources (D-006) and the building's
  likely primary language.
- A single, consistent language avoids a visually inconsistent
  mixed-language screen and doubled content-authoring effort.

**Evidence or precedent:**

- Inventor selection during `/forge spec` GATE round 2 (UI Language question).

**Consequences:**

- Enables a coherent, single-language, RTL experience throughout.
- Non-Hebrew-speaking residents/visitors may not understand on-screen text;
  bilingual support is deferred.
- `locale_ceremony.enabled: false` remains correct - this is a single
  fixed-language choice for this build, not a multi-language i18n system.

**Affected artifacts:**

- Phase 1 specification (sections 3, 5, 7, 8)
- `.claude/showrunner/project-state.md` (Deferred - bilingual support)

**Revisit trigger:** evidence that non-Hebrew-speaking residents/guests are
meaningfully underserved.

## Decision D-009 - Creative gate substitution for Phase 1

**Date:** 2026-06-15
**Status:** approved
**Decision:** Phase 1 proceeds without running the formal `/wow-check`
creative gate, which is blocked by `quality_gates.wow_check.enabled: false`
(a decision deferred at cold init). The informal resonance checks performed
during `/forge discover`, `/forge plan`, and `/forge spec` - each finding no
issues against the constitution - substitute for a formal `SHIP` verdict for
Phase 1.
**Previous value or alternatives:** enable `quality_gates.wow_check` now
(requires configuring UX-law/design-token checks for a project with no design
system yet); leave the spec permanently below `arc-ready`.

**Rationale:**

- Enabling wow_check now would require resolving design-token/UX-law
  configuration that doesn't exist yet - a chicken-and-egg with Phase 1
  itself.
- Blocking indefinitely stalls Phase 1 on a Stage-0-deferred decision
  unrelated to its content.

**Evidence or precedent:**

- Cold init explicitly deferred `quality_gates.wow_check` "pending a
  creative-gate decision" (`.claude/showrunner/init-report.md`).
- Three informal resonance checks across this Forge arc found no blocking
  issues.

**Consequences:**

- Enables the Phase 1 spec to reach `arc-ready` without a formal gate run.
- Does not retroactively enable wow_check for future phases.

**Affected artifacts:**

- Phase 1 specification (section 11)

**Revisit trigger:** a design-token source is configured
(`design.token_sources` becomes non-`disabled`), or before `/forge design` is
used.

## Decision D-010 - Message display styles: per-message choice (plain text /
photo slideshow / beautiful background)

**Date:** 2026-06-15
**Status:** approved
**Decision:** Each message on the Message Board has a display style chosen by
staff when creating/editing it: (a) plain text - the original Phase 1 default
(text on the board's base background), (b) photo slideshow with text overlay -
one or more images that cycle, with the message's Hebrew text overlaid, or (c)
text on a decorative "beautiful" background - a styled background (photo or
graphic) with the message's text styled on top. All three styles share the
same rotation, pinning, expiry, and scheduling (D-012) mechanics - only the
visual presentation differs.
**Previous value or alternatives:** a single board-wide style applied to every
message (no per-message choice); plain text only (the original spec).

**Rationale:**

- Directly requested by the inventor: "the option to have photo slideshow with
  text on them or just text on a beautiful background... of looping messages."
- Per-message choice lets staff match presentation to content - e.g., a photo
  for a friendly seasonal greeting, a styled background for a recurring notice
  like a cleaning schedule, plain text for routine announcements.
- Keeps all three styles inside the existing single rotation/pin/expiry model
  (D-002, D-005) rather than creating separate surfaces.

**Evidence or precedent:**

- Inventor's `CORRECT AND RE-DESCRIBE` correction to the Phase 1 spec,
  2026-06-15.
- Inventor selection during the follow-up GATE round (Msg Styles question -
  "Per-message style choice").

**Consequences:**

- Enables richer, warmer message presentation (Voice: "warm and neighborly")
  without adding new surfaces.
- Expands the Message data model (style field plus style-specific image
  references) and the admin form (style picker, image selection per style).
- Requires the Message Board renderer to support three presentation modes
  within one rotation.

**Affected artifacts:**

- Phase 1 specification (sections 2, 3, 5, 6, 8)

**Revisit trigger:** none.

## Decision D-011 - Background/photo sourcing: staff upload plus curated
default set

**Date:** 2026-06-15
**Status:** approved
**Decision:** The Admin: Message Manager gains image-upload capability so
staff can attach their own photos (e.g., real photos of the building,
residents' events, common areas) to a message for the photo-slideshow or
beautiful-background styles (D-010). SmartScreen also ships with a small
curated set of default decorative background images, usable for the
beautiful-background style and as a fallback before staff upload anything.
**Previous value or alternatives:** a curated-only image library with no staff
upload capability; staff-upload-only with no bundled defaults.

**Rationale:**

- Staff-uploaded photos of the actual building/residents directly satisfy
  constitution Truth #2 ("every piece of content is about this building") far
  better than generic stock imagery.
- A small curated default set means the beautiful-background style and the
  board's visual variety work out of the box, before any staff upload happens.

**Evidence or precedent:**

- Inventor selection during the follow-up GATE round (Backgrounds question -
  "Staff upload + small curated default set").

**Consequences:**

- Enables hyper-local, building-specific photo content from day one of staff
  use.
- Requires the admin form to support image upload and the Message data
  model/storage to reference both uploaded and curated images.
- Adds an image-storage technical decision for Arc's Step 0 (D-003
  greenfield - no existing storage pattern).

**Affected artifacts:**

- Phase 1 specification (sections 2, 3, 5, 6, 7)
- D-004 (admin form scope - now includes image handling)

**Revisit trigger:** if image storage/hosting cost or complexity proves
disproportionate for a single-building Phase 1, revisit toward curated-only.

## Decision D-012 - Message scheduling: optional weekly day-of-week pattern
with optional active date range

**Date:** 2026-06-15
**Status:** approved
**Decision:** Beyond the existing pinned flag and expiresAt, a message may
optionally carry a weekly day-of-week pattern (the day(s) of the week on which
it is eligible to display, recurring every week) and an optional active date
range (start/end dates) during which that pattern applies. A message with no
schedule fields behaves exactly as before (eligible whenever not expired). A
message with only a day-of-week pattern recurs indefinitely on those days. A
message with both a pattern and a date range is eligible only on matching
weekdays within that range.
**Previous value or alternatives:** day-of-week pattern only, with no
date-range bounding (always-recurring); no scheduling at all (pin/expiry
only).

**Rationale:**

- Directly requested via the inventor's examples: a "have a nice weekend"
  message shown only on a specific weekday, and a recurring "cleaning
  schedule" message.
- Adding an optional date range on top of the weekly pattern supports seasonal
  recurring messages (e.g., "every Thursday, but only during summer") without
  forcing staff to manage that by hand every week.
- Both fields are optional and additive, so the existing pin/expiry-only model
  (D-002) remains valid for messages that don't need scheduling.

**Evidence or precedent:**

- Inventor selection during the follow-up GATE round (Scheduling question -
  "Broader: day-of-week AND date-range").

**Consequences:**

- Enables recurring, day-targeted messages (e.g., weekday-only greetings,
  recurring schedule notices) without staff manually adding/removing them each
  week.
- Expands the Message data model with optional activeDays/activeFrom/
  activeUntil fields.
- The Message Board's rotation-eligibility logic (sections 3, 6) must now
  filter on today's weekday and date range, in addition to pin/expiry.
- Expands the admin form with schedule fields, increasing its complexity
  beyond the original "lightweight" framing (D-004) - still a web form, not a
  config file.

**Affected artifacts:**

- Phase 1 specification (sections 3, 5, 6)

**Revisit trigger:** if the admin form's scheduling UI proves too complex for
staff to use correctly, revisit toward day-of-week only (drop date-range).
