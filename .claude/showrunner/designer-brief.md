# Designer Brief — SmartScreen

> Status: inventor-approved (updated with Stitch delivery)
> Approved by: Emil
> Approved on: 2026-06-18
> Updated: 2026-06-18 (Stitch "Ambient Hearth" design delivery incorporated)
> Source plan: `.claude/showrunner/project-state.md` (`## Surfaces`)
> Source specification: `.claude/showrunner/specs/phase-1-core-billboard-loop.md`
> Stitch delivery: `~/Downloads/stitch_smartscreen_lobby_ambient_signage/`
> Target engine: neutral (`forge.designer_helper.tool: disabled`)

---

## Brand And Constraints Header

> **Core belief:** People who live in the same building share more of each other's
> lives than they realize — and the lobby, the one space everyone passes through,
> can make that shared life visible instead of invisible.
>
> **The Job:** Make a resident feel briefly, pleasantly "in the loop" on their
> way out. Make a visitor sense within seconds that this is a building where
> people care about the shared space.
>
> **Truth #3:** Content is glanceable, never demanding. Everything shown must be
> understandable in the time it takes to walk past. SmartScreen is ambient
> signage — it never requires stopping, tapping, or reading for more than a few
> seconds.

### What This Product Will Never Be

- A surveillance tool — no cameras, tracking, or monitoring of who passes through.
- A third-party ad billboard — no paid advertising, no commercial visual patterns.
- A replacement for staff — never the sole channel for anything urgent or personal.

### Visual And Interaction Direction

- **Mood:** Dark / immersive (D-013). **Resolved by Stitch "Ambient Hearth":**
  base surface `#19120d` (deep warm umber), on-surface text `#eee0d7` (warm
  off-white with peach undertone). Applied to both display AND admin surfaces
  (D-017 reverses D-015's light-mode admin call). Full token set in Stitch
  `DESIGN.md`.
- **Typography:** **Resolved: Heebo** (D-014), self-hosted from `static/fonts/`.
  Weights: Light 300 (large displays), Regular 400 (body), Medium 500 (headlines),
  Bold 700 (labels). Fallback stack: `system-ui`, `Noto Sans Hebrew`. Type scale
  from Stitch DESIGN.md:
  - `display-lg`: 84px / 100px / 300 weight / -0.02em tracking (main messages)
  - `display-md`: 64px / 72px / 400 weight (temperature)
  - `headline-lg`: 48px / 56px / 500 weight (section titles)
  - `headline-md`: 32px / 40px / 500 weight (card headings)
  - `body-lg`: 24px / 36px / 400 weight (news headlines, content)
  - `body-md`: 20px / 30px / 400 weight (secondary text)
  - `label-caps`: 16px / 24px / 700 weight / 0.05em tracking (section labels)
- **Palette:** **Resolved by Stitch.** All values as CSS custom properties. Key
  tokens from the "Ambient Hearth" theme:
  - `surface`: `#19120d` — base background
  - `surface-container`: `#251e19` — sidebar and card backgrounds
  - `surface-container-low`: `#211a15` — recessed panels
  - `surface-container-high`: `#302823` — hover states
  - `on-surface`: `#eee0d7` — primary text
  - `on-surface-variant`: `#d8c2b4` — secondary text
  - `primary`: `#ffb77e` — warm amber accent
  - `primary-container`: `#ca7f3f` — terracotta (buttons, badges)
  - `on-primary`: `#4e2600` — text on accent buttons
  - `outline-variant`: `#534439` — borders and separators
  - `outline`: `#a08d80` — input borders
  - `error`: `#ffb4ab` — danger states
  - Full M3-style token set in Stitch DESIGN.md
- **Motion:** 400ms linear opacity cross-fade (D-016). No other motion.
- **Spacing:** `safe-margin: 80px`, `gutter: 40px`, `stack-sm/md/lg: 12/24/48px`,
  `section-gap: 120px` (from Stitch DESIGN.md).
- **Elevation:** No shadows, no glassmorphism. Tonal layering only — subtle
  surface-color shifts + 1px `outline-variant` borders for separation.
- **Asset reservations:** No icon libraries on display surfaces. Admin uses
  Material Symbols Outlined for navigation and actions (per Stitch delivery).

### Voice

- Short, plain Hebrew sentences — like a note pinned to a community board.
- Names things directly and warmly.
- **Prohibited:** ALL CAPS, "ALERT" for non-emergencies, corporate address
  ("Dear Residents"), marketing superlatives.
- All copy in Hebrew on display surfaces.
- Placeholder copy (empty/loading states) must be warm and complete-feeling.

Every surface below inherits this header. A surface prompt does not restate or
override it.

---

## Surface: Message Board (Display)

### Purpose

Show rotating building messages so a passing resident absorbs the current notice
or announcement in a single glance — no stopping, no re-reading.

### Audience And Context

- **People:** Residents walking through the lobby (seconds of attention); visitors
  and guests (first impression); building staff monitoring content.
- **Moment:** All hours. Primary use is the morning commute out and the evening
  return.
- **Surface:** Wall-mounted TV. Assume 55"–75" at 1080p or 4K. Viewing distance:
  2–10 meters. No touch. No interaction.

### Required Experience

**Three display styles — all must look designed, not default:**

1. **Plain text:** Dark background (base surface), single message in large centred
   Hebrew type. The text IS the visual. Use generous size (spec for legibility at
   5m), comfortable line height, white-space-heavy composition that breathes. A
   large, quiet notice board.

2. **Text on background:** A curated or uploaded image/gradient fills the message
   area. Message text overlaid with a contrast treatment the designer specifies
   (gradient scrim, solid overlay band, or frosted translucent layer). Curated
   backgrounds from the existing palette must look designed, not stock — rich
   colour, warm, residential. Staff-uploaded photos must remain legible with the
   overlay treatment even on complex images.

3. **Photo slideshow with text overlay:** Full-bleed building photos or staff
   uploads rotate behind the text. Same overlay treatment as style 2. Text
   anchored consistently (e.g., lower third or centred) so it never competes with
   the image subject.

**States:**

- **Active message:** Full-area display per the style above.
- **Pinned message:** Visually distinct from non-pinned. One subtle signal —
  a thin accent-colour `border-inline-end` (RTL: appears on right edge), or a
  small accent dot. Never aggressive: no badge, no flashing, no ALL CAPS.
- **Transition:** 300–500ms opacity cross-fade between messages. No slide, no
  scale. The outgoing message fades out; the incoming fades in.
- **Empty state:** "יום נעים מלא בחיוכים!" in the same large plain-text
  treatment. Warm and intentional — not a blank panel, not a broken state.

### Guardrails

- No commercial visual patterns: no ticker tape, no scrolling marquee, no
  lower-third broadcast chyrons.
- WCAG AA minimum contrast for all text on all backgrounds and overlay treatments.
- RTL: text right-aligned or centred; never left-aligned Hebrew copy on display.
- No motion except the cross-fade transition.

### Deliverables

- Visual spec for all three display styles including type sizing, spacing, and
  overlay treatment.
- Pinned-message visual treatment.
- Empty-state composition.
- Transition specification (timing function, duration).

---

## Surface: Weather Widget (Display)

### Purpose

Give a resident a sufficient weather read — current conditions and the day's
range — in the two seconds they spend near the sidebar as they pass.

### Audience And Context

- **People:** Residents heading out (morning commute is the peak moment).
- **Moment:** All hours; most valuable in the morning and before evening plans.
- **Surface:** Left sidebar, ~28rem wide (RTL — left edge of screen). Shares the
  sidebar with the News Widget below it. Viewed at 2–10m on a lobby TV.

### Required Experience

Clear typographic hierarchy, top to bottom:
1. Current temperature — **largest element** in the widget. Immediately readable
   at distance.
2. Hebrew condition label (e.g., "בעיקר שמש", "גשם קל") — medium size, one line.
3. High / low in smaller type ("גבוה 28° / נמוך 18°") — supporting, not focal.
4. "עודכן HH:MM" — smallest text, unobtrusive. Present but not competing.

Widget sits within the dark sidebar; background is the same base surface tone
(no separate card background required unless the designer adds a subtle lift).

Placeholder "מזג האוויר אינו זמין" — same text size as the condition label.
Warm and calm. Not a spinner, not an error icon.

### Guardrails

- No weather icons. The Hebrew label already communicates condition; icons add
  visual complexity without clarity benefit at this glance distance.
- Does not dominate the sidebar. Proportionate — leaves adequate space for the
  news widget below.
- Legible at sidebar scale from 5m. Designer to verify type sizes at the chosen
  font.

### Deliverables

- Weather widget visual spec: type scale, spacing, layout at 28rem width, all
  four states (sunny, rainy, unavailable, and a representative "full data" state).

---

## Surface: News Widget (Display)

### Purpose

Give residents a headline-level awareness of what's happening in the world today
— enough to feel informed, not enough to require stopping.

### Audience And Context

- **People:** Residents passing through; visitors.
- **Moment:** All hours; most valuable in the morning.
- **Surface:** Lower portion of the left sidebar (below Weather Widget), 28rem
  wide. Viewed at 2–10m.

### Required Experience

- Up to 5 Hebrew headlines in a vertical list. Each headline is one line —
  truncated with Hebrew-appropriate ellipsis if it overflows.
- Headlines are plain text. No images, no thumbnails, no cards.
- Source attribution "Ynet" — small, unobtrusive, either once as a section label
  above the list or as a small tag per item. Not a logo, not a linked URL.
- Placeholder "חדשות אינן זמינות" when no headlines load — one line, calm.

### Guardrails

- No link affordances. The display cannot be tapped — styling that implies
  clickability (underlined text, hover states) is prohibited on display surfaces.
- Headlines must never look like ads. No card-with-image pattern, no coloured
  source-brand padding, no "sponsored" styling.
- Subordinate to the weather widget. If the sidebar runs short, headlines
  gracefully truncate (show 3 instead of 5); they never push weather off screen.

### Deliverables

- News widget visual spec: type scale, line height, list spacing, source label
  treatment, placeholder state, at 28rem width.
- Behaviour spec for truncation when fewer than 5 headlines are available.

---

## Surface: Admin: Message Manager (Staff-facing)

### Purpose

Give building staff a confident, error-resistant interface for managing the lobby
display — without requiring training or documentation.

### Audience And Context

- **People:** Building staff (property manager, front desk, superintendent).
  Likely non-technical. Uses the admin occasionally, not daily.
- **Moment:** When posting a new notice, editing a scheduled message, or removing
  outdated content.
- **Surface:** Browser. Dark mode (D-017, matching display). Desktop or laptop.

### Required Experience

- **Full dark-mode parity with the display** (D-017): same Heebo typeface, same
  Ambient Hearth token set, same dark base surface (`#19120d`), same accent
  (`#ffb77e`). One unified visual system — no light/dark mode switch between
  display and admin.
- **Message list** (per Stitch delivery): each item shows its text, style badge
  ("טקסט על רקע", "מצגת תמונות", "טקסט נקי") in `primary` on
  `surface-container-highest`, pinned status (Material Symbols `push_pin`),
  and relative timestamp. Hover reveals edit/delete actions.
- **Form panel:** bottom-border-only inputs on dark background (per Stitch
  `form-input-bottom-border` pattern — 1px `outline` bottom border, transparent
  background, focus changes to `primary`). Positioned in a 2-column grid
  alongside the message list.
- **Editing vs. creating mode:** form heading changes ("ערוך הודעה" vs. "הוסף
  הודעה חדשה"). Form panel uses `surface-container-low` background to visually
  separate from the message list.
- **Style picker:** three-way radio with border-highlighted selection (per Stitch:
  selected option gets `border-primary` + `surface-container-highest` fill).
- **Action hierarchy:** "שמור" (save) in `primary` (`#ffb77e`) with
  `on-primary` text. "ביטול" (cancel) with `outline` border. Delete with
  `error` colour. Pin toggle uses `primary` when pinned, `on-surface-variant`
  when not.

### Guardrails

- Dark mode (unified with display).
- No decorative elements that obscure form labels or group boundaries.
- All form labels properly associated with their inputs.
- No motion.

### Deliverables

- Admin component styles using the unified Ambient Hearth dark token set.
- Message list item design — states: default, pinned, with schedule.
- Form panel with bottom-border inputs and style picker.
- Action button hierarchy (save / cancel / delete / pin).

---

## Derivation Trace

| Brief surface | Plan surface (`## Surfaces` in `project-state.md`) |
| --- | --- |
| Message Board (Display) | Message Board (Display) |
| Weather Widget (Display) | Weather Widget (Display) |
| News Widget (Display) | News Widget (Display) |
| Admin: Message Manager | Admin: Message Manager (Staff-facing) |

---

## Resolved Brand Calls (via Stitch Delivery)

The following were deferred to the designer in the original brief. Stitch
resolved them in the "Ambient Hearth" delivery; inventor approved 2026-06-18:

- **Accent colour:** `#ffb77e` (primary/warm amber), `#ca7f3f` (primary-container/
  terracotta). ~~Was: exploration range `#A05020`–`#C47A3A`.~~
- **Base surface tone:** `#19120d` (deep warm umber). ~~Was: range
  `#1A1612`–`#242018`.~~
- **Typography:** Heebo. ~~Was: Heebo vs. Rubik, designer chooses.~~
- **Type scale:** 84px display-lg to 16px label-caps (full scale in DESIGN.md).
  ~~Was: designer to spec.~~
- **Admin mode:** Dark (unified with display). ~~Was: light-mode parity (D-015,
  now superseded by D-017).~~

## Remaining Unresolved Calls

- **Photo overlay treatment** — for `background` and `photoSlideshow` styles:
  gradient scrim, solid band, or frosted translucent layer. Stitch's
  `smartscreen_message_board_background` screen was corrupted; treatment not yet
  visually confirmed. Implementer to use a semi-transparent dark gradient scrim
  as default (consistent with Stitch's tonal-layering principle); revisit with
  inventor on hardware.
- **Display hardware verification** — type scale is specced for 55"–75" at
  1080p/4K from 2–10m. Verification deferred until hardware is provisioned.

The implementer may proceed with the resolved tokens. Product, brand, scope,
and emotional-framing changes return to Emil.
