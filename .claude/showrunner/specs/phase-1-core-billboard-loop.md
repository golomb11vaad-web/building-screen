# Feature Specification - SmartScreen Phase 1: Core Billboard Loop

> Status: arc-ready
> Owner: Emil
> Constitution: `docs/soul.md`, Core Belief; Truths #1-3; Voice; What This
> Product Will Never Be
> Decisions: D-001, D-002, D-003, D-004, D-005, D-006, D-007, D-008, D-009,
> D-010, D-011, D-012

## 1. Intent

Phase 1 gives a residential lobby a single wall-mounted display that residents
glance at on their way through - showing building messages (with
pinned/urgent ones most prominent, each shown as plain text, a photo slideshow
with text overlay, or text on a beautiful background, and some shown only on
scheduled days), Israeli local news (Ynet, Calcalist), and current weather,
all in Hebrew with an RTL layout. It serves the constitution's Core Belief: a
shared space everyone passes through can make residents' shared life visible,
turning proximity into community. Building staff keep it current through a
simple password-protected admin form, with no developer involvement after
Phase 1 ships.

## 2. Scope And Guardrails

### In Scope

- Message Board display: rotating building messages/notices, each shown as
  plain text, a photo slideshow with text overlay, or text on a decorative
  "beautiful" background (D-010); pinned messages shown more prominently than
  unpinned ones (D-002); messages may optionally be restricted to specific
  day(s) of the week and/or an active date range (D-012).
- Weather Widget: current conditions and a short forecast for the building's
  location, in Hebrew, in the sidebar.
- News Widget: Hebrew headlines from Ynet and Calcalist, in the sidebar
  (D-006).
- Admin: Message Manager: password-protected web form for staff to create,
  edit, pin/unpin, schedule, and remove messages, including choosing a
  message's display style and attaching images - either uploaded by staff or
  chosen from a curated default set (D-004, D-007, D-010, D-011).
- Display layout: Message Board dominant (majority of the screen), Weather +
  News sidebar on the left edge in RTL (D-005, D-008).
- Hebrew, RTL throughout (D-008).

### Explicitly Out Of Scope

- Automated emergency-alert override / full-screen takeover - deferred to
  Phase 2 (D-002). Constitution Truth #1 ("urgent info always comes first") is
  partially mitigated in Phase 1 via pinning; revisit before any real
  emergency-communication reliance.
- Multi-building / multi-tenant configuration - deferred (D-003); revisit if
  a second building becomes a real target.
- Any touch/interactive UI, visitor management, or wayfinding - excluded per
  constitution Truth #3 ("ambient signage, not a kiosk").
- Third-party paid advertising - excluded per constitution's "What This
  Product Will Never Be" (not a revenue channel).
- Surveillance or tracking of who is in the lobby - excluded per
  constitution's "What This Product Will Never Be".
- Bilingual (Hebrew+English) content and individual staff accounts - deferred
  per D-007 and D-008; revisit per their stated triggers.

## 3. Experience And Behavior

**Entry conditions:** the display boots and loads automatically (e.g., the
browser auto-launches full-screen on device startup); no login is required to
view the display.

**Primary path - Display:**

- The screen shows the Message Board occupying the majority of the screen
  (RTL), with a sidebar on the left edge containing Weather (top) and News
  (below it).
- The Message Board rotates through active, eligible messages - "eligible"
  means not expired and, if scheduled (D-012), matching today's day-of-week
  pattern and active date range; pinned messages are shown first and/or more
  often than unpinned ones, and remain visually distinct (D-005, section 6).
  Each message renders per its chosen display style: plain text, photo
  slideshow with text overlay, or text on a beautiful background (D-010).
- The Weather widget refreshes on the cadence defined in section 6.
- The News widget refreshes on its own cadence, showing the latest Ynet/
  Calcalist headlines in Hebrew.

**Primary path - Admin: Message Manager:**

- Staff navigates to the admin URL and enters the shared password (D-007).
- Staff sees the current message list (active, pinned, expired/archived).
- Staff can create a message (Hebrew text; display style - plain text, photo
  slideshow, or beautiful background; for photo slideshow or beautiful
  background, one or more images, either uploaded or chosen from the curated
  default set; optional pin flag; optional expiry date; optional weekly
  day-of-week schedule and active date range), edit it, pin/unpin it, or
  remove it.
- Changes appear on the display within the refresh window defined in
  section 6.

**Empty states:**

- No active messages: the Message Board area shows the approved Hebrew
  empty-state text (e.g., a building welcome message) - never blank.
- Weather/news fetch failure: the widget shows the last successfully fetched
  data with a subtle "updated at" indicator, or a neutral placeholder if
  nothing has ever loaded - never a visible error or broken layout.

**Loading/error states:**

- Initial load: a neutral placeholder, not a spinner implying "wait for me"
  (Truth #3 - never demanding).
- Admin form: an incorrect password shows a plain Hebrew error message; no
  lockout mechanism in Phase 1 (single shared password, low stakes).

**Permissions and inclusion:**

- Display: public - visible to anyone in the lobby, no personal data shown
  (consistent with "never a surveillance tool").
- Admin: staff only, gated by the shared password (D-007).

**Important transitions:**

- A newly pinned message is promoted to the prominent position without an
  abrupt layout shift that would interrupt someone mid-read (Truth #3).
- A message with an expiry date automatically drops out of rotation without
  staff action.
- A scheduled message (D-012) becomes eligible or ineligible for rotation as
  today's date and day-of-week change, without staff action - the same
  "no staff action required" behavior as expiry.

**What persists vs. ephemeral:**

- Persists: messages (text, display style, image references, pinned flag,
  optional expiry, optional schedule, created/updated timestamps), uploaded
  and curated images, the admin shared password (config/secret).
- Ephemeral: fetched weather/news data (cached and refreshed, not
  historically retained).

## 4. Resolved Inventor Decisions

| Decision | Approved choice | Rationale | Decision entry |
| --- | --- | --- | --- |
| Platform | Browser-based web app, wall-mounted display | Flexible, passive, matches Truth #3 | D-001 |
| Phase 1 surface scope | Message board + admin manager + weather + news; emergency override deferred; pinning required | Focused, demoable; partial Truth #1 mitigation | D-002 |
| Rollout posture | Single building now, reuse-aware | Avoids premature multi-tenancy cost | D-003 |
| Content management | Lightweight admin web form | Matches real staff workflow | D-004 |
| Display layout | Message board dominant, weather/news sidebar | Truths #1/#2 prominence, Truth #3 always-visible ambient info | D-005 |
| News source | Ynet + Calcalist (Hebrew, Israeli) | Hyper-local per Truth #2; inventor's own choice | D-006 |
| Admin authentication | Single shared staff password | Simplest viable for one building, Phase 1 | D-007 |
| UI language/direction | Hebrew throughout, RTL layout | Consistent with news sources and resident base | D-008 |
| Creative gate | Informal resonance check substitutes for `/wow-check` | `quality_gates.wow_check` deferred at cold init | D-009 |
| Message display styles | Per-message choice: plain text, photo slideshow with text, or text on a beautiful background | Matches inventor's explicit request; keeps richness inside the existing rotation | D-010 |
| Background/photo sourcing | Staff upload plus a small curated default set | Hyper-local per Truth #2, with a usable out-of-box default | D-011 |
| Message scheduling | Optional weekly day-of-week pattern, optionally bounded by an active date range | Matches "have a nice weekend"/"cleaning schedule" examples; additive to pin/expiry | D-012 |

No hidden product decisions remain in later sections.

## 5. Technical Direction

- Greenfield repository - no existing systems or patterns to reuse yet.
- Required data shapes:
  - **Message:** `{ id, text (Hebrew), style: "plain" | "photoSlideshow" |
    "background", images?: [{ id, source: "upload" | "curated", ref }],
    pinned: bool, createdAt, updatedAt, expiresAt?: datetime, activeDays?:
    weekday[], activeFrom?: date, activeUntil?: date }` (D-010, D-011, D-012).
    `images` holds one or more entries for `photoSlideshow` and the single
    background image for `background`; absent/empty for `plain`. `activeDays`,
    `activeFrom`, and `activeUntil` are each independently optional; a message
    is eligible for rotation when not expired AND (no `activeDays` set OR
    today's weekday is in `activeDays`) AND (no `activeFrom`/`activeUntil` set
    OR today falls within that range).
  - **Image asset:** `{ id, source: "upload" | "curated", filename/path,
    uploadedAt? }` (D-011). Curated assets ship with the application;
    uploaded assets are added by staff via the admin form. The storage
    approach for uploaded images (filesystem, embedded store, etc.) is a
    technical fact left to Arc's Step 0, consistent with D-003's
    greenfield/reuse-aware posture.
  - **Weather:** a deployment-time location config (lat/long or city name) plus fetched current conditions and forecast.
  - **News:** a list of `{ title, source: "Ynet" | "Calcalist", link, publishedAt }`, fetched from each source's RSS feed.
- Privacy/security: the admin route is protected by a single shared secret
  (D-007); no personal or resident data is collected, stored, or displayed
  (consistent with "never a surveillance tool").
- Accessibility: RTL layout throughout; text sized for "glanceable from
  typical lobby walking distance" (Truth #3) - exact sizing must be verified
  against the real display hardware, which is a technical fact Arc must
  verify rather than assume (display size/resolution/viewing distance are not
  yet specified - see project-state.md Risks).
- Operational constraints: weather and news are fetched on a refresh timer
  (section 6); the exact Ynet/Calcalist RSS feed URLs and response formats are
  technical facts Arc must verify before relying on them.
- No flags, migrations, or compatibility expectations - this is the first
  build.

## 6. Recorded Implementation Defaults

- **Weather provider:** Open-Meteo (free, no API key required, supports
  arbitrary lat/long) - default per the inventor's "recommend free-tier
  providers" choice. Arc may substitute an equivalent free provider if
  Open-Meteo proves unsuitable, without changing behavior or scope.
- **Refresh cadence:** messages poll every few minutes (e.g., 2-5 min);
  weather every 30-60 min; news every 15-30 min. Exact values are an
  implementation default Arc may tune, provided content never feels stale to
  a daily passerby and nothing refreshes often enough to cause visible
  flicker (Truth #3).
- **Pinned-message mechanic:** pinned messages are shown first in the rotation
  and/or persist longer than unpinned ones, and remain visually distinct from
  unpinned messages. The exact mechanic (e.g., "always slot 1" vs. "shown 2x
  as often") is an implementation default.
- **Framework and file placement:** not yet fixed - left to Arc's Step 0,
  which proposes a stack within section 5's constraints and follows that
  stack's standard conventions for naming, placement, and test organization.
- **Design tokens:** `design.token_sources: disabled` - no token system exists
  yet. Arc should establish minimal, centralized values for color, spacing,
  typography, and motion (even a single CSS variables file) rather than
  hardcoding throughout, in the spirit of `design.no_hardcode`, without
  building a full token pipeline.
- **Slideshow timing:** for `photoSlideshow` messages (D-010), the displayed
  image changes on a slow, calm cadence (e.g., every 10-20 seconds) - never
  fast enough to read as an attention-grabbing carousel (Truth #3). Exact
  timing is an implementation default Arc may tune.
- **Curated default background set:** Arc includes a small initial set
  (roughly 5-10) of neutral, warm, non-branded decorative background images
  as the curated set for the `background` style (D-011), following the
  "plain and calm" visual guidance in section 8. Exact images and count are an
  implementation default; a quick inventor sanity-check on the initial set is
  noted in section 7.
- **Image storage:** not yet fixed - left to Arc's Step 0 (D-011), which
  proposes a storage approach appropriate to the chosen framework/stack.
- **Schedule evaluation:** "today" and "this weekday" for `activeDays`/
  `activeFrom`/`activeUntil` (D-012) evaluation use the display's local date
  in the Israel time zone, consistent with the Hebrew/RTL locale (D-008).

Defaults are not product decisions. Arc may refine them when current
repository evidence requires it, provided behavior and scope remain
unchanged.

## 7. Voice, Content, Accessibility, And Locale

- **Voice:** per `docs/soul.md` - short, plain, warm Hebrew sentences; avoid
  corporate/legal phrasing and false urgency (no ALL-CAPS "ALERT" styling for
  routine messages).
- **Content requiring inventor approval:** the empty-state Hebrew text shown
  when no messages are active (e.g., a building welcome message). Arc drafts
  this during Step 0 describe-back for inventor sign-off.
- **Content requiring inventor approval (additional):** the initial curated
  background-image set (D-011, section 6) gets a quick inventor sanity-check
  before/at build time - confirming the images feel "warm and neighborly" and
  not generic/corporate (Voice), alongside the empty-state text above.
- **Accessibility states/labels:** all UI labels (weather, news section
  headers, admin form fields and buttons, error messages) are in Hebrew, with
  an RTL-aware layout (text alignment, sidebar position, icon mirroring where
  relevant).
- **Locale ceremony:** `locale_ceremony.enabled: false` remains correct - this
  is a single fixed-language (Hebrew/RTL) build, not a multi-language i18n
  system (D-008).
- **Prohibited language:** per `docs/soul.md` - no advertising/marketing
  language, no surveillance-implying copy, and no language suggesting the
  screen replaces staff for urgent matters.

## 8. Visual And Interaction Direction

- **Design principle:** `forge.design_principle: disabled` - no formal design
  principle recorded yet. Arc should keep visuals plain and calm, consistent
  with the "warm and neighborly" voice, rather than inventing a distinct
  visual brand.
- **Token sources:** disabled (see section 6) - use centralized, non-hardcoded
  values where practical.
- **Hierarchy:** the Message Board occupies the dominant area (majority of
  screen width); Weather and News sit in a sidebar on the screen's left edge
  in RTL (D-005, D-008).
- **Typography:** sized for glanceability from typical lobby walking distance
  (Truth #3) - exact sizes verified against real display hardware (technical
  fact Arc must verify).
- **Motion:** minimal - content changes (rotation, refresh, and
  photo-slideshow transitions within a message, D-010) are smooth and
  non-jarring, never flashing or attention-grabbing in a way that mimics
  advertising ("What This Product Will Never Be").
- **Style consistency across message types:** the photo-slideshow and
  beautiful-background styles (D-010) follow the same "plain and calm" visual
  ethos as the design principle above - tasteful and warm, not flashy,
  branded, or advertising-like. Text overlaid on photos/backgrounds must
  remain legible at a glance (Truth #3) regardless of the underlying image.
- **Protected zones:** the Message Board's dominance (D-005) must not be
  reduced by weather/news content encroaching on its space.
- **Designer brief:** `forge.outputs.designer_briefs_directory: disabled` and
  `forge.designer_helper.tool: disabled` - no designer brief for Phase 1; Arc
  implements directly from this section.

---

## 9. Arc Step 0 Contract

Before implementation, Arc must read:

- this specification
  (`.claude/showrunner/specs/phase-1-core-billboard-loop.md`);
- `.claude/showrunner/config.md`, `docs/soul.md`,
  `.claude/showrunner/decisions.md` (D-001-D-012), and
  `.claude/showrunner/project-state.md`;
- the repository itself - Step 0 confirms the actual starting state (expected:
  empty except `.claude/`, `.githooks/`, and `docs/soul.md`).

Arc's implementer describes back:

1. Outcome and non-goals - Phase 1 scope per section 2, explicitly excluding
   the "Out of Scope" list.
2. Verified paths, symbols, and current behavior - for this greenfield repo,
   confirmation of the actual starting state.
3. Implementation and ownership plan, including the proposed web framework and
   stack (a choice within section 5's constraints, surfaced here for
   confirmation).
4. Data shapes (section 5), refresh-cadence values chosen within section 6's
   defaults, locale (Hebrew/RTL, D-008), the chosen image-storage approach for
   staff-uploaded images and the initial curated background set (D-011,
   section 6), tests (note: `tests.commands` are currently `disabled` in
   config - Arc proposes a minimal test setup as part of describe-back), and
   smoke (note: `smoke.definition` is `disabled` and display hardware is not
   yet available per project-state.md Risks - Arc flags this rather than
   skipping it silently).
5. Ambiguities or deviations - particularly the pinned-message mechanic, exact
   refresh cadences, and the slideshow-timing and curated-background-set
   defaults chosen within section 6.

Then stop for approval.

## 10. Build And Verification Phasing

1. **Foundation + Message Board** - set up the chosen framework, the
   Hebrew/RTL base layout, the Message data model (including display style,
   image references, and schedule fields per D-010/D-011/D-012), and a working
   Message Board display reading from seed/test data (including
   pinned-message prominence and all three display styles - plain text, photo
   slideshow, and beautiful background).
   Commit boundary: a working display with seeded messages in all three
   styles. Automated tests: data model and rendering logic for pinned vs.
   unpinned, each display style, schedule-eligibility filtering (today's
   weekday/date-range matching), and empty states. Gate: audit
   (`quality_gates.audit`, severity_block: critical).
2. **Admin: Message Manager** - password-protected admin form (create, edit,
   pin/unpin, remove, expiry) wired to the same data store, including the
   display-style picker, image upload and curated-image selection (D-011),
   and the weekly day-of-week/date-range schedule fields (D-012); the Message
   Board reflects admin changes. Commit boundary: the end-to-end message
   lifecycle works locally, including styled and scheduled messages.
   Automated tests: CRUD operations, password gate, expiry behavior, image
   upload handling, and schedule-field validation/eligibility edge cases. Gate:
   audit.
3. **Weather + News widgets and sidebar integration** - Open-Meteo weather
   fetch, Ynet/Calcalist RSS fetch and parsing (Hebrew), sidebar layout
   alongside the Message Board, full RTL pass. Commit boundary: the full
   Phase 1 layout with live or recorded-fixture weather/news data. Automated
   tests: feed-parsing logic against fixture RSS/weather responses;
   error/fallback states (last-known-good data, neutral placeholder). Gate:
   audit.
4. **Integration, content polish, and human smoke** - final empty/error-state
   copy (Hebrew, inventor-approved per section 7), refresh-cadence tuning, and
   a human smoke check on the actual wall-mounted display hardware once
   available (`smoke.required_for: [runtime_state, device, external_ops]`).
   Commit boundary: Phase 1 is demoable end-to-end. Gates: audit; informal
   resonance check per D-009.

## 11. Passing Condition

A resident walks past the lobby display and, within a glance, sees the
building's most important current message (pinned, if any) prominently in
Hebrew, alongside today's weather and the latest Ynet/Calcalist headlines in
the sidebar - all without anything moving fast enough or requiring interaction
that they'd need to stop. Separately, a staff member logs into the admin form
with the shared password, adds a new message and pins it, and within the
refresh window sees it appear most prominently on the display, while weather
and news continue updating independently; a temporary feed outage shows
last-known-good data rather than an error.

A staff member also creates a "have a nice weekend" message using the photo
slideshow style, uploading one or more photos and setting its weekly schedule
to a single chosen weekday; the message appears in rotation - cycling through
its photos at a calm pace with the Hebrew text overlaid - only on that
weekday, and is absent from rotation on other days without any staff action.
A separate recurring message (e.g., a cleaning schedule) uses the
beautiful-background style with a curated default background and displays
correctly alongside plain-text messages in the same rotation.

Inert/non-leakage checks: with zero active messages, the display shows the
approved Hebrew empty-state text, never a blank or broken screen; the admin
form rejects an incorrect password without revealing whether it was "close."

Creative gate: `SHIP` (informal resonance check, per D-009)
Inventor redline: approved (2026-06-15)
