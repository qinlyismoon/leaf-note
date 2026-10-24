# Leafnote — Design

*Exploratory UI/UX direction for a mobile-first web prototype.*
*Not validated product requirements. Research evidence remains in `docs/RESEARCH.md` and is not rewritten here.*

**Last updated:** 2026-10-21

---

## 1. Purpose and status

Leafnote explores how plant owners and temporary caregivers preserve and use
plant-specific care context when watering decisions change hands.

This document records:

- **Approved design direction** — interaction and visual decisions for the
  current concept expansion;
- **Working interaction hypotheses** — testable ideas that are not research
  findings;
- **Unresolved questions** — open product and usability issues;
- **Current iteration** — what to build next;
- **Later scope** — explicitly deferred.

It does **not** convert research observations into finalized requirements.

**Product-surface principle:** Use one clear page title and reveal context
through navigation and state. Do not expose research disclaimers,
implementation status, deferred-feature notes, or redundant explanatory copy
in the user-facing interface.

---

## 2. Approved design direction

### 2.1 Information architecture

Leafnote has four primary destinations in a bottom navigation:

| Tab | Role |
|---|---|
| **Care** | In-the-moment checking and judgment for the current user's own plants |
| **Shared** | Everything involving another person: incoming requests, plants the user cares for on someone's behalf, handoffs the user sent, Updates |
| **Plant Library** | Identity and organization of plant instances |
| **Profile** | Lightweight person / prototype meta (non-auth) |

Until 2026-10-21 Care held a Personal / Shared segmented control. Shared now
has its own tab so incoming requests are not hidden behind a segment
(see DECISIONS.md). Internally the two lists still use the `personal` and
`shared` care contexts.

**Canonical plant instances** are shared across Library, Care, and the Shared
tab. Care history belongs to the plant instance. Who may act and who
receives suggested-check badges is derived from ownership plus Handoff state
(§2.11), not from duplicated plant records.

### 2.2 Navigation and badges

- Compact **glass-like** bottom toolbar with **icon + short text label** for
  every tab.
- Inactive items remain identifiable (not color dots alone).
- Active state uses contrast / weight / label emphasis — **not** the badge.
- **Number badges** = things waiting on the current user (suggested checks,
  incoming requests), not plant totals, not selected-tab state.

**Badge rules (working hypothesis — see §3):**

| Location | Count |
|---|---|
| Bottom **Care** badge | Unresolved suggested checks on the user's own plants (exclude accepted handed-off plants for the owner) |
| Bottom **Shared** badge | Incoming pending requests + unresolved suggested checks on plants the user cares for |
| Bottom **Shared** dot | Shown only when the Shared count is 0 and there are unread relationship updates |
| Shared **Requests** heading | Terracotta count of incoming pending requests |
| Shared **Updates** row | `N new` text for unread relationship updates — never merged with suggested-check counts |

### 2.3 Device presentation

| Mode | Behavior |
|---|---|
| **Desktop presentation** | Fixed iPhone-proportion **application canvas** (no exterior phone frame). Simulated status area at the top of the canvas: time, Dynamic Island, signal, Wi‑Fi, battery. |
| **Real mobile** | Full-bleed app; **hide** simulated system status bar so it does not duplicate device chrome; respect `safe-area-inset-*`. |

### 2.4 Plant Library

Library shows only instances owned by the current prototype user. Accepted
Shared plants remain in Shared Care for the caregiver; handoff does not add
them to the caregiver's Library or grant identity editing/removal. Owners
retain their plants in Library during handoff. A user without owned plants
sees the empty shelf and can add their own plant.

- Visual metaphor: plants on **shelves** (inspired by references; original
  Leafnote illustration assets only). Library instances are grouped into
  repeatable **`ShelfRow`** components of at most **two** plants. Every row
  has its own full-width ledge — including a final row with a single plant.
  Pots in a row share a normalized bottom baseline and touch that row’s ledge.
- Distinguish **`PlantSpecies`** (preset name + image) from **`PlantInstance`**
  (individual plant: species reference, instance name, optional location,
  optional identification label, explicit `hasTray`, `careConfigured`).
- Shelf item order within each plant (top → bottom): compact caption group
  (**species name** English, then optional identification label), plant image,
  shelf contact on the row ledge. Every plant uses **`ShelfPlantItem`**: fixed
  image stage, shared bottom baseline, `object-fit: contain`. Touch feedback is
  image-only (`:active` scale ≈ 0.97); no hover-dependent feedback; no
  card/tint around the whole item or ledge. Name and label stay close; with no
  label, omit the label element entirely (no empty reserved row). Names reserve
  up to two lines for alignment. Instance names are not shown on the shelf;
  labels distinguish same-species instances.
- Desk and Shelf seed instances share the **Echeveria** illustration as a
  **prototype mapping** (not a botanical claim). Desk `hasTray: false`; Shelf
  `hasTray: true`.
- Tapping a shelf item opens a **Library identity detail** (English-only):
  a top bar with icon-only **BackButton** (left) and **Edit** (right); a 4:5
  **hero** showing this instance's own photo, with its identification label as
  a small tag on the photo (no photo: the species illustration plus an **Add a
  photo** button that opens Edit plant); the species name in display serif with
  the species plant type below; two fact tiles, **Location** and **Pot** (On a
  tray / No tray); and a full-width **Care** row (care icon, latest recorded
  activity, a **Check due** tag when the plant is a Suggested check, chevron)
  that opens Care detail, or the honest unavailable-care state when care is not
  configured. Edit plant changes photo, Location, Tray and Label (species is
  read-only).
- **Instance photos** distinguish plants of the same species. Add / Edit plant
  start with an optional **Plant photo** field (take or choose; on phones the
  picker offers the camera). Photos are center-cropped to 4:5 and stored
  locally as 600×750 JPEG. They appear in the Library detail hero, Care plant
  cards and Handoff selection rows; the Library shelf keeps the species
  illustrations. Seed plants use Unsplash-licensed example photos
  (`src/assets/photos/CREDITS.md`).
- Care and Library detail pages share the same icon-only **IconButton**
  foundation for Back, Close, Edit, and View Care (circular white surface with a
  1px hairline, 44×44 tap target, `:active` press, `:focus-visible`; no
  hover-dependent styling). Close uses ×; Edit uses pencil; View Care uses
  `CareInfoIcon`: a single-stroke magnifying glass with a water droplet
  optically centered in the lens, with clear space between droplet and circle,
  at the same stroke weight as other icon glyphs — never outlined-circle
  button variants and never a back arrow for Close.
- **Add Plant** FAB appears only on the Library shelf (not detail), fixed above
  the bottom nav with a visible gap (anchored to nav height / safe area / home
  indicator reserve); opens a bottom sheet (English-only) to pick a preset
  species on fixed-height cards (shared selected-state surface, border, and
  check indicator; typography and card height stay unchanged), then
  enter optional Location, an explicit required Tray Yes/No, and an optional
  identification label with a unit counter, then save.
  No separate selected-species preview below the grid.
  Default instance name = English species name. Empty labels and locations are
  allowed. **Edit plant** reuses the same `PlantInstanceFields` controls and
  validation. Sheet scrollbars are visually hidden; scrolling remains
  available; background Library scroll is locked while the sheet is open.
- Newly added instances use the user-chosen `hasTray`, receive a clearly marked
  mock/prototype baseline Care payload, and enter Personal Suggested checks
  immediately. Library and Care reference the same PlantInstance id. Existing
  locally added instances from the earlier Library-only model migrate into this
  behavior when loaded. Baseline copy stays observational and must not be
  presented as validated species-specific or research-backed guidance.
- Labels belong to the instance, not the species. Max **five counting units**
  via `countLabelUnits`: each continuous Latin/number word counts as one unit;
  each CJK character counts as one unit; whitespace and standalone punctuation
  do not count. UI examples stay English (e.g. `Window`). Existing seed labels
  may remain user-created Chinese text.

### 2.5 Progressive care interaction (structure approved)

Care Detail is a guided checking flow, not a static article. Species is the
title; plant label/location is metadata. Long care instructions are presented
one step at a time with progress, ending in a three-option judgment.

Care Detail eyebrow uses the plant instance label only, with location as the
fallback when no label exists. Suggested Check explains the current reason or
context for checking, using the latest care time and relevant instance details
such as a tray; it does not repeat generic instruction copy. Guided steps use
action-oriented titles, `Step 1` through `Step 5` labels, small replaceable
botanical cue illustrations and a five-segment ink/neutral progress indicator.
Steps 1–4 use the approved illustration assets. The artwork is centered without
a visible placeholder frame and keeps its intrinsic aspect ratio with
`object-fit: contain` plus shared maximum dimensions and image-level rounded
corners for a consistent visual scale.
The final judgment step has no illustration. Step copy remains short, practical
and action-oriented.
Steps 2–5 include a narrower shared secondary Back action beside the primary
continuation area. Recent Activity opens with a month **activity calendar** (one dot per kind of
outcome on a day — grey Checked, blue Watered, amber Not sure; tap a day to
filter; previous / next month) so rhythm and gaps read at a glance, followed by
the text track: the 5 latest records by default, grouped by month, with
"Show all N". The text track is a compact vertical timeline with
semantic icons inside circular nodes: search for Checked, water drop for
Watered and question mark for Not sure. Neutral grey, muted powder blue and
warm amber distinguish these outcomes. Nodes use an inverse treatment: the status color
fills the circle and the semantic icon is knocked out in the page color. The
vertical rule connects each node center to the next node center. The timeline
shows the latest three items by default and expands via a quiet Show more control.

The Suggested Check card gives only immediate context: check the leaves and
soil before deciding, and remember that checking does not always mean
watering. A compact Start check card begins five steps: What to observe, When
it may need water, How to water (including relevant drainage/location
guidance), When to stop, and Record judgment. Each step retains the bordered
white card language and shows shared progress.

The final judgment gives Checked — no water needed, Watered and Not sure equal
secondary visual weight; Watered is not styled as a recommendation. Step 5 has
no Back action, so the three full-width outcomes remain its sole focus. Recording
creates the normal CareEvent and a Done action returns to the correctly
classified Care list. In Shared caregiver context, completion offers an
optional Add photo for owner action; Not sure gives that option more visual
prominence. The completion card contains only the recorded outcome, time,
optional owner photo action and Done; it has no redundant activity-update copy
or divider above the photo action. The owner can view the action, time, plant, caregiver and optional
photo in an expandable Updates detail, with lightweight React and Reply
controls rather than a chat thread.

Expanded update details only reveal extra content; they do not repeat summary
fields already visible in the activity row. Reactions are icon-only and persist
across shared perspectives. A reaction stays attached to the source care
activity so its caregiver can see the reacting owner in Updates.

Care content for a plant uses this progressive card flow (see §3 for the
decision tree as a working hypothesis):

1. Observe
2. Decide
3. Water — only when relevant
4. Record

Final outcomes preserved:

- Checked — no water needed
- Watered
- Not sure

Secondary path: **View all instructions** (full care guide on one surface).

Do not ask the user to make the same decision twice during Record.

### 2.6 Visual direction

A layered, iOS-style translucent system (revised 2026-10-23; supersedes the
flat near-white direction of 2026-10-21 — see DECISIONS.md):

- **L0 ambient**: one hue only — a fresh sage field (morning leaf light) with a
  soft lift of light at the top; no multi-color washes, no grey stone. Neutrals
  are leaf-dark (ink #1d2a21, secondary #4e5d52, tertiary #5f6d62); primary
  actions are deep forest green (#25432f); warm terracotta stays the
  "needs attention" accent;
- **L1 surfaces**: translucent glass cards (white ~66%, background blur, a
  bright top edge, soft diffuse shadow); quieter states use lighter glass;
- **L2 floating chrome**: bottom nav, sheets, toasts and the FAB sit highest,
  with stronger blur and shadow; the active tab has a sliding glass highlight;
- **layered detail pages**: the plant's photo runs full-bleed to the top edge
  (under the status bar) and stays put while the content sheet (large top
  radius, no grabber — it is not draggable) scrolls up over it; Back / Edit
  float as glass buttons below the status bar and stay pinned;
- **check card**: the headline is the action to take now (the plant's cue,
  e.g. "Check for drooping leaves"); last check and pot setup are supporting
  text, never the headline;
- geometry: cards 20px, inputs 14px, tags 6px, pills only for real buttons and
  status chips; large titles are bold UI sans; serif only for plant names;
- one accent: terracotta means "needs attention" (Check due chip, badges,
  unread dots, destructive confirmation); powder blue is the Watered data color.

**Care list emphasis:** Suggested checks carry a "Check due" status chip on a
full-strength glass card; Recently checked cards use lighter glass with muted
names and imagery.

**Motion:** Motion explains navigation and state, never decorates.
Going deeper slides the new screen in from the right; going back slides the
list in from the left; switching tabs cross-fades upward; list items rise in
with a short stagger; guided-check steps slide in; sheets rise with an ease-out;
the tab highlight and badges use a gentle spring; touch press scales surfaces to
~98.5% and controls to ~96%. Curves and durations are tokens in global.css
(`--ease-out`, `--ease-spring`, `--dur-*`). Everything respects
`prefers-reduced-motion`.

**Pointer feedback:** Touch-first. Controls use `:active` press feedback and
`:focus-visible` for keyboard. Do not use hover-dependent appearance — phones
have no hover.

**Single-choice selection:** Single-choice controls retain their
component-specific geometry but share one selected-state language: warm
tinted surface, restrained terracotta border, stable typography and a
non-color indicator. Selected, pressed, focus and disabled states remain
distinct.

Species cards and Tray Yes/No share `--selection-*` tokens and the
`.selectable` state layer. Selection is not
communicated by font-family, font-size, weight, or height changes. The shared
`Selectable` component owns the native radio input and non-color check; styles
derive selection from its checked state. Add/Edit Tray, species cards and
Prototype viewing-as reuse it, including keyboard focus and disabled behavior.
System high-contrast colors preserve the check and focus ring. Bottom
navigation keeps its own
active language and must not inherit these form-selection styles.

**Typography:** Leafnote uses a semantic dual-typeface system across both
browsing and task surfaces. Display serif is reserved for plant identity
(species and plant names, via `.type-plant-name` where a role class is shared).
UI sans-serif communicates page titles, section headings, field labels, body
text, controls, metadata and actions. Add Plant and Edit Plant reuse the same
type roles as Care Detail rather than defining separate form typography.

Semantic roles (product-wide):

- **Display title** — sheet and page identity headings (`Add plant`, `Edit
  plant`, Care plant name). UI sans, semibold; plant-name titles add
  `.type-plant-name` to use the display serif.
- **Eyebrow** — quiet category labels (`Species`, `Location`, `Has a tray?`,
  `Identification label`, `Suggested check`, care section titles). UI sans;
  sentence case; semibold; muted. Not uppercase or tracked. Add Plant and Edit Plant section headings share
  this role so they match Species rather than using a separate form-label style.
- **Content identity** — short content headings (step titles, handoff
  messages) and identity lines. UI sans, semibold. Plant/species names in this
  role add `.type-plant-name` (display serif, not artificially bold).
- **Field label** — remaining sentence-case UI labels outside form section
  headings. UI sans; medium weight; muted charcoal.
- **Control** — inputs, placeholders, Yes/No values. UI sans.
- **Meta** — optional tags, counters, helpers, validation. UI sans; muted.
- **Button** — all action labels. UI sans only; never display serif.

**Full-width actions:** Use one shared `Button` system with three variants —
primary (dark filled), secondary (quiet white/outlined for low-emphasis
actions), and destructive (restrained terracotta, reserved for irreversible
confirmation). Low-emphasis full-width actions use the secondary style.
Destructive flows begin with a quiet secondary trigger; irreversible removal
requires a second confirmation with only Cancel (secondary) and the destructive
action. Deleting a `PlantInstance` also removes its Care references and
activity, but never deletes the `PlantSpecies` preset.

Do **not** copy proprietary text, branding, illustrations, icons, or assets
from visual references.

**Icon button roles:** General Back, Close, Edit and View Care controls use
`IconButton` with the white `--bg-surface` resting surface and 1px hairline. The labeled
Hand off entries (Care header and Shared tab) are real buttons with visible
text and a handoff icon; they are not icon-only. `CarePageButton` (neutral
`--bg-panel` surface) remains available for icon-only page entrances. Keep their
style rules independent so changes to one role do not recolor the other.
Both retain 44×44 targets, touch press feedback and visible keyboard focus.
Form selection states and full-width action variants retain their own systems.

### 2.7 Accessibility constraints for glass navigation

- Readable contrast; solid-color fallback if blur is unsupported or weak;
- Active state not conveyed by color alone;
- Nav must not cover final page content;
- Touch targets remain accessible;
- FAB clears nav and safe area.

### 2.8 Care and the Shared tab

**Care** lists plants the current prototype user **owns**. It shows
owner-facing presentation state (suggested check / recently checked). Its
header pairs the `Care` title with a labeled **Hand off** button
(handoff icon + visible text, pill, 44px min height, `:active` press).
Owned plants that are handed off stay in Care as the muted dashed
`handed_off_owner` card.

**Shared** is the space for everything that involves another person. Order
follows urgency:

1. Page title `Shared` and a full-width labeled **Hand off plants** button.
2. **Requests** (only when present): incoming pending requests render inline,
   with a terracotta left rule and count, Decline / Accept on the card.
3. **Caring for others**: accepted plants owned by someone else, using the
   standard Care list (Suggested checks / Recently checked). The owner's own
   handed-off plants are **not** listed here.
4. **Your handoffs**: handoffs the user sent, grouped `Waiting for reply` /
   `In care`, with Cancel request / End handoff (confirmed).
5. **Updates** row with `N new` when unread; opens the Updates subpage.

Ownership does not move on handoff. Do not duplicate plants into separate
object graphs. Plant detail opened from Shared returns to Shared.

Library shelf imagery uses a bottom baseline so pots rest on the ledge. Care
cards use a centered, unframed portrait treatment with balanced internal space.
These are separate PlantImage presentation variants: `shelf` and `carePortrait`.
The Care portrait has a fixed 3.35rem square stage with no background or
circular frame and a contained image, with no shelf offsets. All Care states and Handoff selection rows use
this same variant. Portraits keep a fixed top inset within cards so wrapping
text or missing labels do not move the artwork vertically.

**Care plant cards** are one shared image-led component. Information order:
species image (existing Library asset, unframed), species
name (not instance names such as `Desk succulent`), optional identification
label, concise cue/action, latest outcome and relative time. Variants:

- **actionable** — white card; opens Care detail; owner or caregiver may
  record when permitted
- **handed_off_owner** (Personal) — neutral panel surface, dashed
  outline and lower contrast; no chevron or separate Handoff status pill;
  cannot open Care detail; excluded from the owner’s numeric badge
- **shared_owner** — standard image-led card in Shared; relationship +
  latest caregiver activity; owner may inspect Care detail but cannot record
- **shared_caregiver** — standard image-led card; opens Care detail and
  permits outcomes

Numeric badges count plants that currently need an action. The Updates red
dot means unread relationship information. Never combine the two.

### 2.9 Profile (identity for Handoff)

Profile is the identity surface required for Handoff:

- Centered avatar with the display name directly below it
- **Email** — display, edit, save; basic validation; normalized for matching
  seeded prototype users
- Quiet Local data row when needed by the settings structure

Prototype identity switching should not appear as a prominent settings module.
In Profile, identity is shown as a centered avatar/name block; tapping the
identity block may switch prototype perspective during testing. Do not show a
role subtitle, prototype section, switching controls or explanatory copy in
the normal Profile hierarchy.

If the current user has no valid email when starting Handoff, guide them to add
email in Profile before sending a request.

### 2.10 Add Plant / Edit Plant (minimally functional, local only)

**Add**

1. Tap FAB
2. Select from **preset** species (fixed-height English cards; shared
   selected-state language, not a typography change)
3. Optional Location (`e.g. Desk`)
4. Explicit Tray: required Yes or No on the instance (not inferred from species)
5. Optional identification label (max 5 counting units, `0/5`)
6. Save
7. New instance appears on the Library shelf

**Edit**

1. Tap Edit on the identity card
2. Species shown read-only (not editable)
3. Same Location / Tray / Label fields as Add (`PlantInstanceFields`)
4. Save updates the same `PlantInstance`; Close discards unsaved changes
5. Remove plant uses a quiet secondary button above Save; confirmation asks
   Cancel or Remove plant (destructive). Confirmed removal deletes the
   instance and its Care activity, returns to Library, and shows a brief
   “Plant removed” toast. Species presets remain available in Add Plant.

English-only product UI. Local state / `localStorage` only. No custom species
creation, image recognition, photo upload, backend, or botanical search.
Detail metadata must correspond to values entered here (or seed data /
approved species template fields).

### 2.11 Care Handoff (local interactive prototype)

A plant owner may invite another Leafnote prototype user (by email) to care for
one or more **owned, care-configured** Personal plants. Ownership of the
`PlantInstance` does not change. The recipient accepts or declines the **whole
request** (no partial plant acceptance).

**Approved defaults (2026-09-07, revised Shared as bilateral):**

- Personal owns seed Care plants; handoff never transfers ownership.
- Shared is empty only when the current user has neither incoming pending
  requests nor accepted Shared plants.
- After accept, the plant appears in Shared for **both** owner and caregiver.
- Incoming requests render as inline request cards in Shared (avatar, sender,
  plants, time, Decline / Accept). Not a bottom sheet.
- Only plants without a usable Care payload are ineligible for Handoff; newly
  added preset plants receive the prototype baseline payload on creation.
- Ending an accepted handoff uses one owner action: **End handoff**
  (destructive confirmation) → status `ended`.
- Care activity Updates for `checked` use one line:
  `[Caregiver] checked [Plant] — no water needed`.
- Care history is one timeline per plant with actor labels (owner vs
  caregiver), not separate filtered timelines in this iteration.
- Prototype identity switching is hidden behind the centered Profile identity block.
- Handoff create and Updates are **full-screen subpages** (Back, title,
  scrolling content, Home Indicator; no drag handle; no Close/X; hide tab bar).

#### Entry, selection and management

The full-screen Hand off flow contains only **Available Plants** and the
recipient step; it is opened from the labeled Hand off button in Care or the
Shared tab and returns to the tab it came from. **Your Handoffs** lives on the
Shared tab, where **Waiting for reply** and **In care** are quieter Level 2
subsections, with a smaller parent-to-child gap. Omit empty subsections. End handoff is an action,
not a status. Do not use Active as a visible heading.

Available Plants includes only existing, owned, care-configured plants without
a pending or accepted handoff. Pending and In Care plants are excluded rather
than shown disabled. No eligible plants shows a concise empty state and hides
Continue; existing relationships remain visible. Otherwise Continue follows
the plant list and is disabled until a selection exists.

Image-led cards use centered Care portraits, species names and optional
PlantLabel tags. Native checkboxes support multiple selection and share
selection tokens, the check indicator, stable typography, touch feedback,
keyboard focus and disabled states. Do not display “Tap to select”.

The recipient step keeps selected plants editable using removable
PlantSelectionTags plus an **Add plants** tag action (plus icon, visible text,
44px touch target, accessible name “Add plants to handoff”). Tags use 4px
neutral tag tokens, UI sans and restrained borders. Species-first names
include labels when duplicate species need distinction. Add plants returns to
Available Plants with selection and email preserved; cards, tags and final
plantIds share one selection state. Removing all tags disables Send request
and prompts the user to add plants. Tags wrap without overflowing.

The caregiver email remains editable on the recipient step until confirmation.
There is no separate read-only recipient review page. Send request validates
input and opens a compact centered iOS-style **Send handoff request?** alert,
showing the exact trimmed email and plant count. Its warm-white surface has
only **Cancel | Confirm**, with neutral and non-destructive primary actions,
no X, drag handle or bottom-sheet treatment. All consequential two-choice
confirmations—including cancelling a request, ending a handoff and removing a
plant—reuse this centered alert structure with horizontal actions; destructive
confirmation text uses restrained terracotta. Focus stays within the alert;
Escape cancels and returns focus to Send request. Cancel preserves email and
plants. Outside taps never confirm. Confirm submits exactly once, then exits
to the originating tab with a quiet request-sent confirmation.

Your Handoffs groups each request as one relationship card: one recipient,
one status, multiple plant tags and one action. Pending cards show recipient
avatar/name/email, tags, Sent relative time and secondary Cancel request.
In Care cards use the neutral panel surface, caregiver identity, tags, Since date and
secondary End handoff. Closed relationships (ended, declined, cancelled or
revoked) belong in Updates history, not this overview.

Cancel request opens a compact confirmation titled “Cancel this request?”
with only Keep request and Cancel request. Ending has only Keep handoff and
End handoff. Confirmations have no X or drag handle; initial focus is on the
keep action, keyboard focus stays within the dialog and Escape keeps the
relationship. Only final confirmation performs the change, with a restrained
destructive action. Cancellation returns plants to Available Plants, removes
the incoming request, resolves stale unread invitation state and adds a
relationship update. Ending restores owner Personal Care access, removes both
sides' accepted Shared relationship, and returns eligible plants to Available
Plants. Both preserve PlantInstance and CareEvent history and create Updates.

Leaving the selection overview returns to Care. The page retains status/safe areas, Back, sans page title, full-height
scrolling and Home Indicator without bottom tabs, Close or drag handle.

#### Independent Care and Handoff state

Care status and Handoff status are orthogonal. Both Personal and Shared use
one canonical care classification. Outcome, timestamp and relative time come
from the plant's CareEvents. Handoff state is visual/container metadata; it
must not replace care guidance or latest care action text. Accepted Handoff
state does not add a separate status pill to Care plant cards. Pending may
appear as additive request metadata while the owner still holds responsibility.
Sending, accepting, cancelling and ending neither create nor replace a
CareEvent, reset its timestamp, nor move a plant between care sections.

Pending leaves owner responsibility, access and badge eligibility unchanged.
Acceptance transfers actionable access and badges, but the caregiver initially
sees the same Suggested/Recently checked classification and preserved history.
Owner Personal becomes muted/dashed and cannot open detail; owner Shared can
inspect but cannot record. Caregiver outcomes append events normally and their
care-state effects are shared across roles, including after a later handoff.

When a plant is actively handed off, the owner can view updates and end the
handoff but cannot record care actions. Only the active caregiver can use the
guided care check flow during the handoff. The owner detail replaces Today’s
check / Start check with a quiet delegated-state card naming the caregiver;
Recent Activity remains visible. Permission derives from handoffState plus
viewerRole, independently of carePresentationState.

The current prototype has no automatic time threshold for rechecking. Its
existing illustrative baseline is preserved until real Checked/Watered events
resolve a suggested check. Not sure alone does not clear it. Elapsed-time
metadata still uses the actual event timestamp; handoff timestamps never enter
care-state derivation. Legacy context buckets remain readable without
rewriting plants, handoffs or care events.

#### Pending vs accepted

| | Pending | Accepted |
|---|---|---|
| Owner opens Care detail | Yes | No |
| Owner can record care | Yes | No |
| Owner suggested-check badge | Yes (unchanged) | Excluded |
| Owner list presentation | Subtle `Pending handoff` | Muted dashed Personal card; no Handoff pill or chevron |
| Owner Shared | Not yet | Same instance; inspect activity; cannot record |
| Caregiver Shared list | Incoming request card in Shared | Same instance id + owner’s care guidance; can record |
| Caregiver suggested-check / Shared badge | No | Yes, when presentation is suggested |
| Duplicate invite for same plant | Blocked | Blocked while accepted |

Disabled Personal cards communicate accepted Handoff through the muted dashed
container and reduced interaction affordances. Do not add redundant status
copy such as “Handed off,” “With [caregiver],” or “Care actions are disabled.”

#### Caregiver Shared behavior

Accepted plants in Shared Care:

- use the same canonical plant id and care-configured guidance for that
  instance (never invent unrelated species care);
- support existing judgment meanings: checked / no water needed, watered, not
  sure, plus viewing existing care history on one timeline with actor labels;
- append CareEvents and update the canonical care classification used by both
  Personal and Shared; badges count only plants the current role may act on.

#### Updates inbox (relationship events)

Updates is an **event inbox**, not chat. Opened from the Shared tab's Updates
row as a **full-screen subpage**. Accept / Decline for incoming requests
lives on Shared request cards, not in Updates.

Two groups:

1. **Handoff lifecycle** — invitations, accept/decline, cancellation and ending notices.
2. **Care activity** — caregiver outcomes create owner-facing updates derived
   from the recorded `CareEvent` (do not store a second contradictory outcome).
   Checked copy: `[Caregiver] checked [Plant] — no water needed`.

Unread relationship items use a **terracotta/red dot with no number** on the
Updates control. This is distinct from **numeric suggested-check badges**
(plants needing attention). Never combine the two counts.

Marking read: when the Updates inbox opens, mark currently listed items as
read (items that become visible in that open session). Do not require a
separate per-row read control in this iteration.

#### State model (durable)

```text
Owner selects plants → sends request → pending
Recipient reviews
  ├─ owner cancels → cancelled
  ├─ declines → declined
  └─ accepts → accepted
                 └─ owner Ends handoff → ended
```

Handoff and RelationshipUpdate records persist in localStorage. Plant
ownership remains on the instance (or equivalent owner id). Temporary care
access is derived from accepted handoffs — do not duplicate plants into
separate Personal/Shared object graphs.

#### Prototype simulation boundary

Implemented locally now:

- seeded prototype users with emails;
- local match of entered email to those users;
- avatar/name prototype identity switching for dual-role testing;
- Handoff + Updates + Profile email in localStorage;
- realistic product UI without implying real delivery.

Deferred / requires backend later:

- real accounts, auth, outbound email, push, multi-device sync, true privacy
  of whether an email has an account.

---

## 3. Working interaction hypotheses

*Testable product ideas. Not research findings. Not proven.*

### 3.1 Progressive care decision tree

```text
Observe
  → Decide
       → No water needed     → record Checked — no water needed
       → Not sure            → record Not sure
       → May need water      → Water (instructions)
                                → record Watered
```

Record confirms the outcome already chosen; it does not re-ask the decision.

**Why this hypothesis:** Long single-page instructions may overwhelm in-the-moment
care. Progressive disclosure may support judgment without removing access to
full context (`View all instructions`).

### 3.2 Badge and presentation-state resolution

| Outcome | Suggested-check resolution |
|---|---|
| Checked — no water needed | Resolve current suggested check |
| Watered | Resolve current suggested check |
| Not sure | **Keep unresolved** for now |

On record: update immediately —

- plant presentation state;
- list grouping;
- bottom Care / Shared badges;
- recent activity.

**Why this hypothesis:** Suggested checks should feel actionable; “Not sure”
may still need attention. This is a product hypothesis, not a validated need.

### 3.3 Checking ≠ watering

List language and care copy continue to separate **checking** from
**watering**. Suggested checks invite observation, not mandatory watering.

### 3.4 Shared vs Personal contexts on one instance

The same plant instance may appear in Library (identity), Personal Care
(owner context), and Shared Care (accepted caregiver context). Care classification is **per canonical plant**, shared by Personal and Shared.
Access and badge eligibility follow Handoff state (§2.11), independently of
care classification.

### 3.5 Identification labels

**Shared presentation rule:** Plant identification labels (such as `desk` or
`tray`) use the same non-interactive `PlantLabel` chip in Library shelves and
identity detail, all Care card states, and Handoff plant selection.
Reuse the Library shelf's white 4px tag, subtle neutral border, compact UI
sans typography and muted text. Empty labels render nothing. Labels identify
plant instances; they are not selectable controls, status badges or tray fields.


A 5-character bubble is enough for at-a-glance distinction on a shelf; detailed
care stays in Care flows.

---

## 4. Unresolved questions

1. After “Not sure,” what later action should clear the suggested check if the
   user never records Checked/Watered?
2. Does progressive care outperform “View all” for first-time caregivers in
   session tests?
3. Does the desktop decorative status bar help or confuse “this is a web
   prototype”?
4. How many shelf rows / density before the Library metaphor breaks on small
   phones?

---

## 5. Current iteration

Approved build scope (includes Library/Care shell and **Care Handoff** §2.11):

| Area | Include |
|---|---|
| App shell | Four tabs: Care, Shared, Plant Library, Profile; icon + text; restrained glass nav; active tab uses ink, not terracotta |
| Care | Own plants only; `Care` title + labeled Hand off button |
| Personal | Owned plants; pending/accepted presentation |
| Shared | Own tab: Hand off plants; Requests; Caring for others; Your handoffs; Updates row |
| Handoff | Full-screen create flow (select plants → email → send); Accept/Decline and Your handoffs live on the Shared tab |
| Updates | Full-screen relationship inbox; red-dot unread ≠ numeric suggested-check badges |
| Care interaction | Existing progressive cards + outcomes; caregiver activity → owner updates |
| Badges | Care = own suggested checks; Shared = requests + shared suggested checks; unread Updates = dot |
| Data | Canonical instances; Handoff; RelationshipUpdate; Profile email; local only |
| Plant Library | Functional shelf; identity detail; Edit / Remove plant |
| Profile | Centered avatar/name identity; email for Handoff matching; subtle identity tap switch |
| Presentation | Desktop iPhone-proportion canvas; real-mobile safe areas |
| Visual | Editorial botanical direction; shared Button + IconButton systems |
| Docs | This file; do not rewrite `docs/RESEARCH.md` as part of UI work |

**Composite sample note (developer-facing):** Desk and Shelf remain composite
prototype scenarios informed by separate exploratory sources. They do not
represent one participant, one handoff event, or complete botanical guidance.
Shelf tray setup remains mock prototype content.

---

## 6. Later scope

Explicitly deferred:

- Real email delivery, accounts, authentication, and push notifications
- Backend synchronization and multi-device truth
- Partial acceptance of multi-plant requests
- Full responsibility-state management beyond revoke/end
- Owner reply and exception-photo workflow
- AI or image recognition
- Full botanical encyclopedia
- Advanced multi-shelf organization
- Deep Personal Care scheduling and reminders
- Multi-role URL routing unless a concrete need emerges
- Custom species creation beyond presets

---

## 7. Relationship to research

| Design element | Relationship to research |
|---|---|
| Observable cues + practical watering context in Shared care | Informed by exploratory interviews / self-analysis (cue-based care; pot/setup context for caregivers) |
| Checking distinct from watering; three judgment outcomes | Continues approved prototype hypotheses |
| Progressive cards, badges, Library shelves, Profile email, Care/Shared tab IA, Handoff | Design / product exploration — **not** research findings |
| Detailed long-term history as a primary need | Previously **narrowed** in research synthesis; history remains lightweight |

Do not cite this document as evidence that users “need” badges, shelves, or
a separate Shared tab.

---

## 8. Documentation maintenance

When interaction principles change, update this file and append
`docs/DECISIONS.md` if that log exists and is requested.

Do not modify raw interview evidence in `docs/RESEARCH.md` to match the UI.
