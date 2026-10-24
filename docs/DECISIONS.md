# Leafnote — Decisions

## 2026-09-07 — Separate Care entrances from utility icon buttons

At the user's request, Back, Close, Edit and View Care use the previous
warm-white IconButton surface. Care toolbar Handoff and Updates retain warm
beige surfaces through a separate CarePageButton component and style rules.
This is a visual interaction decision, not a research finding. Form selection
states and full-width action variants are unchanged.

## 2026-09-07 — Separate Care portraits from shelf imagery

Care cards and Handoff selection use the centered `carePortrait` PlantImage
variant with a fixed circular frame and balanced padding. Library uses the
explicit `shelf` variant and retains its existing bottom baseline and scale.
Card text changes do not reposition the portrait. This is a visual design
decision, not a research finding.

## 2026-09-07 — Scope Library to the current owner

Fixed Library showing all locally stored instances across prototype users.
Library now filters by current owner, and edit/remove handlers enforce that
same scope. Shared Care continues to derive caregiver access from handoffs;
ownership is unchanged. Identity switching clears the previous Library detail.

## 2026-09-07 — Reuse Library identification labels across pages

At the user's request, plant labels in Care and Handoff use the Library shelf
chip treatment through a shared PlantLabel component, also used by Library
detail. Labels remain non-interactive identity metadata, distinct from selection
and care status. This is a design-system decision, not research evidence.

## 2026-09-07 — Handoff management and lifecycle

Approved Available Plants → Continue → Your Handoffs (Pending / In Care),
relationship-level cards, checkbox selection and shared removable plant tags.
Cancellation and ending require two-decision confirmations, preserve plants
and care history, and create relationship updates. Closed relationships stay
out of the overview. Existing local records remain compatible; acceptedAt is
optional with updatedAt as the legacy display fallback.

## 2026-09-07 — Editable recipient and independent care classification

Recipient selection supports adding/removing tags without losing email. A
centered Cancel/Confirm alert replaces the read-only review page. Handoff
sections use explicit parent/child hierarchy. Care classification is canonical
across roles; Handoff controls responsibility only, and relationship metadata
never replaces care outcomes. Existing illustrative baseline is retained;
no new automatic recheck interval is introduced.

## 2026-09-07 — Handoff card metadata and confirmation alerts

Accepted Handoff state is conveyed by the Care card container and access state,
without a separate status pill; guidance and latest care action remain intact.
Send, cancel, end and plant-removal confirmations share the same compact
centered two-action alert, with restrained terracotta reserved for destructive
confirmation actions.

## 2026-09-07 — Guided Care Detail

Care Detail now presents today’s check as five single-step cards instead of a
long instruction article. Species is the page title and instance label/location
is eyebrow metadata. The flow ends with three equally weighted judgments;
Shared caregiver completion may include an optional owner-visible photo, and
Care activity Updates expose a compact detail with lightweight response tools.

## 2026-09-07 — Quiet Profile identity switching

Profile centers the avatar and name as the visible identity. Prototype
perspective switching now cycles through seeded users by tapping that identity
block; the visible role subtitle, Prototype settings module and explanatory
device/email copy were removed. Email editing and the quiet Local data row remain.

## 2026-09-07 — Care check context and timeline hierarchy

Care Detail now prefers the instance label alone as eyebrow metadata, with
location only as fallback. Suggested Check states the time/context reason;
guided steps use action titles, replaceable cue illustrations, segmented
progress and in-flow Back navigation. Recent Activity uses a vertical timeline
showing the latest three events until expanded.

## 2026-09-07 — Fixed guided-check illustrations

Guided Care steps 1–4 use the four approved generated illustrations in a shared
fixed-size contained frame. Step 5 has no illustration. Copy is fixed to short,
practical Echeveria checking actions, and its three outcome actions always
remain visible, becoming disabled only when recording is unavailable or done.

## 2026-09-07 — Focused final judgment and completion

Step 5 removes instructional Back navigation and centers attention on the three
outcomes. Post-record completion omits the redundant activity-update sentence
and photo divider, retaining outcome, time, optional shared photo and Done.

## 2026-09-07 — Semantic Recent Activity nodes

Timeline nodes now use circular search, water-drop and question-mark icons for
Checked, Watered and Not sure. Outcome colors use sage, muted powder blue and
warm amber. Nodes use filled circles with page-colored knocked-out icons, and
connector rules align center-to-center.

## 2026-09-07 — New plants enter Personal Care

Adding a preset plant creates one canonical PlantInstance shared by Library
and Personal Care, assigns a mock observational Care baseline, and initializes
it as a Suggested check. Existing locally added Library-only instances migrate
to the same behavior when loaded; the baseline is not a botanical or research
claim.

## 2026-09-07 — Shared lightweight update reactions

Expanded care updates omit action, caregiver and time fields already present
in the summary. The compact detail reveals only photos and response controls.
An icon-only reaction persists on the source update and becomes visible in
both the owner and caregiver Updates perspectives.

## 2026-09-07 — Active handoff Care Detail permissions

During an accepted handoff, owner detail replaces the guided check with a
delegated-state card and confirmed End handoff action while retaining Recent
Activity. Only the active caregiver can start and record the guided check;
care presentation classification never grants action permission by itself.

## 2026-09-07 — Unframed guided-check artwork

Guided Care illustrations render as centered artwork without a visible
placeholder surface. Each image keeps its intrinsic aspect ratio and uses
shared maximum dimensions so all four steps retain a consistent visual scale
and title spacing without cropping or stretching. A shared image-level corner
radius softens the artwork edges without recreating a placeholder frame.

## 2026-10-21 — Lighter, quieter visual system

At the user's request, after a critique that the warm-ivory, all-rounded,
soft-shadow styling read as a generic template. This is a visual design
decision, not a research finding; layout, copy and interaction are unchanged.

- Surfaces: page `#fbfaf7`, cards pure white; six beige tokens collapse to
  page, panel and pressed tints. Cards drop soft shadows and rely on 1px rules;
  icon buttons and the active Care segment use a 1px hairline instead.
- Geometry: cards 10px, inputs and option cards 8px, tags 4px; pills remain
  only for real buttons, the FAB, icon buttons and count badges. Care portraits
  lose the circular grey frame (supersedes "Separate Care portraits from shelf
  imagery" for the frame only).
- Type: display serif is reserved for plant names (`.type-plant-name`). Page
  titles, section headings and step titles use UI sans; uppercase tracked
  eyebrows become sentence-case labels.
- Color: terracotta is the single accent and means "needs attention". Sage is
  replaced by neutral ink/rule tones on progress, bullets, handed-off and
  delegated surfaces, and the Checked timeline node (Watered keeps powder blue).
  Active bottom-nav uses ink, not terracotta. Selected-state styling is
  unchanged for now.
- Care list: Suggested checks show a terracotta left rule and emphasized last
  check time; Recently checked cards are transparent and muted.

## 2026-10-21 — Shared becomes its own tab; labeled Hand off entry

At the user's request, because incoming handoff requests were easy to miss
behind Care's Personal / Shared segment and the icon-only Hand off control
read as a generic share icon. This is an information-architecture and visual
decision, not a research finding; handoff permissions and data are unchanged.

- Bottom nav has four tabs: Care, Shared, Library, Profile. Care shows only
  the user's own plants; the Personal / Shared segmented control is removed.
- Shared tab order: Hand off plants (full-width labeled button) → Requests
  (only when present; terracotta rule and count) → Caring for others →
  Your handoffs (Waiting for reply / In care, with confirmed Cancel / End) →
  Updates row (`N new`).
- Caring for others excludes the owner's own handed-off plants; those appear
  under Your handoffs and as the muted card in Care.
- The Hand off flow now covers only plant selection and recipient; managing
  sent handoffs moved to the Shared tab.
- Care header uses a labeled Hand off button instead of the icon-only control.
- Badges: Care = own suggested checks; Shared = incoming requests + suggested
  checks on plants cared for; a dot appears on Shared for unread Updates when
  there is no count.

## 2026-10-23 — Five seed plants and species care copy

At the user's request. Mock prototype content, not research findings.

- The prototype starts with five plants owned by Maya: the two research-informed
  Echeverias (Desk, Tray) plus Pothos (Living room, tray), Monstera (Window,
  tray) and Golden snake plant (Hallway, no tray). Two start as Suggested checks.
  Browsers with saved data receive the new seed history once.
- Every preset species has cue-based baseline care in `src/data/speciesCare.ts`
  (general houseplant conventions, labeled mock). Watering and stop steps follow
  the instance's tray setup. Desk / Shelf Echeveria keep their interview-informed
  instance content.
- Guided check steps use the plant's own content for non-Echeveria species and
  omit the Echeveria illustrations; Echeveria keeps the illustrated steps.
- Demo data contains no Chinese text; seed labels are English.
- Plant illustrations had background-removal residue cleaned (canvas sizes kept).

## 2026-10-23 — One check card; dated activity track

At the user's request; visual / interaction decision.

- Care Detail merges "Suggested check" and "Today's check" into one card: status
  label (Suggested check, or Check anytime when recently checked), a concrete
  reason ("Last checked 6 days ago."), the pot context, then Start check.
- Recent activity uses a date column (day + month), a 2px track with outcome
  nodes, and a body with outcome, relative time and an avatar "by <name>" line,
  so when and who read separately.

## 2026-10-23 — Instance photos; Library detail redesign

At the user's request; product / visual decision, not a research finding.

- A plant instance can have its own photo, so two plants of the same species
  (e.g. Desk and Tray Echeveria) are easy to tell apart. Add / Edit plant gain an
  optional Plant photo field (camera or library), stored locally as a 600×750
  JPEG; a full local store shows a toast instead of failing silently.
- Photos show in the Library detail hero, Care cards and Handoff selection rows.
  The Library shelf keeps the species illustrations so the shelf stays coherent.
- Seed plants use five Unsplash-licensed stock photos (sources and authors in
  `src/assets/photos/CREDITS.md`). They are illustrative, not participants' plants.
- Library detail is rebuilt around the photo: top bar (Back / Edit), 4:5 hero
  with label tag, species name and type, Location and Pot tiles, and a full-width
  Care row with latest activity and a Check due tag, replacing the small
  "care info" icon.

## 2026-10-23 — Layered glass visual system and motion

At the user's request, with iOS-style references. Visual / interaction decision,
not a research finding. Partly reverses the 2026-10-21 flat near-white direction:
depth now comes from translucency, blur and light rather than borders.

- Three layers: tinted ambient background, translucent glass cards, floating
  chrome (nav with sliding highlight, sheets, toasts, FAB).
- Plant detail (Care and Library) is layered: full-bleed photo with a content
  sheet over it. Care detail keeps the flat layout when a plant has no photo.
- Suggested checks use a "Check due" chip instead of a left accent bar.
- Motion tokens and directional screen transitions (push / pop / tab), list
  stagger, step and sheet transitions, spring tab highlight and badge, press
  feedback; all disabled under prefers-reduced-motion.
- Fixed real-phone mode letting the whole page scroll (the frame is now locked
  to the viewport so the in-app scroller and floating nav behave).
- Saved browser data with legacy Chinese seed labels is migrated to English on
  read; the demo shows no Chinese.

## 2026-10-23 — Single-tone ambient; detail sheet and check card fixes

At the user's request.

- Ambient background is one hue (near-white with a soft top light); the
  multi-color washes read as cheap.
- Detail photo now extends under the floating status bar; Back / Edit are
  pinned below it. The photo stays fixed while the content sheet scrolls over
  it. The grabber was removed because the sheet is not draggable.
- The check card headline is the action for this check (the plant's cue);
  "Last checked …" and the tray note moved to the supporting line.

## 2026-10-23 — Activity calendar, profile grouping, status bar behavior

At the user's request.

- Care detail Recent activity adds a month calendar above the text track, so a
  long history stays scannable (rhythm, gaps) and a day can be filtered. The
  track previews 5 records grouped by month with "Show all N". Seed plants get
  about eight weeks of mock history at a rhythm matching their species; older
  stored seed events are moved to daytime.
- Profile uses an identity card ("Tap to switch profile") and one inset grouped
  Account list (Email ›, Local data).
- The status bar is clear over a detail photo and turns into a frosted nav strip
  once the photo scrolls away, with Back pinned above it. Driven by app state,
  not `:has()`, so it does not depend on browser support. New screens start
  scrolled to the top.

## 2026-10-23 — Unified tab icons; deeper single-tone palette

At the user's request.

- Tab icons are redrawn on one 24px grid (`NavIcon.tsx`) with one rule:
  inactive = 1.7px outline; active = every closed shape filled, inner details
  knocked out in the highlight color. Shared now shows two people (care with
  others) instead of a hand and heart. Replaces a mix of a PNG mask, icon-font
  line/fill pairs and a half-filled custom glyph.
- The ambient field stays one hue but deeper (warm stone), glass cards are more
  opaque, and text greys are darker: secondary ≈6:1, tertiary ≈4.2–4.7:1 on
  cards (the old tertiary grey was 2.4:1).

## 2026-10-23 — Fix: detail photo under the status bar; button position

Bug fix. Sticky offsets are measured from the scroller's content box, so the
scroller's top padding (status bar + spacing in presentation mode) pushed the
detail photo below the status bar and the Back / Edit buttons down by the same
amount. The hero's sticky `top` and the button row's `top` now cancel that
padding: the photo starts at the very top under a soft light scrim, and the
buttons sit just below the status bar without shifting when scrolling.

## 2026-10-23 — Fresh sage palette; fixed prototype account email

At the user's request.

- The single-tone field moves from warm grey stone to a fresh sage green, with
  leaf-dark text neutrals and a deep forest green for primary actions, for a
  natural, fresh, optimistic feel. Contrast: body ≈12–15:1, secondary ≈5.6–7:1,
  tertiary ≈4.35–5.5:1, white on forest 10.9:1.
- Profile no longer edits the email: prototype accounts are fixed, the email is
  shown for handoff matching, and tapping the identity card switches account.

## 2026-10-23 — Add / Edit plant sheet in the current visual system

At the user's request; the sheet still used the earlier flat visual.

- Sections with small titles (Species, Photo, Details) and inset grouped glass
  cards, matching Profile. Details rows are label-left / control-right; Edit
  shows Species as a read-only first row.
- Tray is an iOS-style segmented control (No | Yes); a missing choice outlines
  it in the attention color with a message below.
- Species tiles are white glass cards with a larger illustration on a soft
  green disc; the selected tile has a forest ring and a solid forest check
  badge that springs in.
- Selection color is forest green app-wide (species, tray, handoff selection,
  focus rings); terracotta is reserved for "needs attention".
- The primary action is pinned at the bottom of the sheet; Remove plant is a
  separate attention-colored text action; the non-draggable grabber is removed.

## Detail screens: frosted nav strip lives with the Back button
- Problem: after scrolling a photo detail, the status bar's frosted strip (z-index 3, outside the scroller) painted over the pinned Back / Edit buttons and faded out right where they sit, so the guided-check card appeared to slide over the button.
- Decision: on photo-top screens the status bar stays clear; the frosted strip is a `::before` of the sticky `.detail-bar`, covering status bar + button row, fading in once the sheet reaches that zone (scroll > 240px). The strip and buttons now share one layer, so buttons are always on top and content never shows behind them.

## Hand off: one button, same place on Care and Shared
- Problem: Care had a small outline "Hand off" pill beside the title; Shared had a full-width "Hand off plants" bar under the title. Two styles and two positions for the same action made it feel like two different features, and neither stood out.
- Decision: one `HandoffButton` inside the shared `CareHubHeader` (title left, button right), used by both pages, so it sits at exactly the same spot. It is a solid forest pill with a hand-heart icon — the only filled button in a page header — so it reads as the primary action. Label is "Hand off" on both.

## Hand off moves to a floating button; Updates takes the top-right
- Problem: Shared needs its Updates (notifications) entry in the top-right corner, the conventional spot for a page tool, which would collide with Hand off in the header.
- Decision: Hand off becomes a floating forest pill above the tab bar, bottom-right, rendered by both Care and Shared at the identical position (same anchor as Library's add button). The Shared header gets a bell icon button with an unread-count badge; the old Updates row at the bottom of Shared is removed. Care's header has no page tool but keeps the same height so titles line up across tabs.

## Library: photo grid, location tags, filter tabs
- Layout: two-column photo cards (odd last card spans full width with the name card floating over the photo). Each card shows the plant's own photo; with no photo it falls back to the species illustration on a quiet sage ground. Location tag (icon + name) top-left, common name + botanical name (italic) below, "…" menu for Edit plant / View care.
- Add moves from a floating button to the header's top-right (forest circle), matching Shared's top-right page tool; Hand off keeps the bottom-right float on Care/Shared.
- Location is chosen from 9 preset icon tags (Desk, Shelf, Living room, Window, Bedroom, Kitchen, Bathroom, Hallway, Balcony), optional, tap again to clear. Tray is a pot setup, not a location, so it stays a separate Yes/No row and never appears as a location tag. Older free-text locations are mapped to a preset where possible ("By the window" → Window); unmatched text is kept and shown with a generic pin.
- Filter tabs: All + every location that currently has a plant (presets first).
- Botanical names added to the species catalog (mock reference content).

## Ambient background: soft leaf shadow + paper grain (option 05)
- Chosen over 03 "Botanical Texture": drawn watercolour leaves are objects and would dilute the meaning of the species / cue illustrations (and Library's illustration fallback), and they'd sit behind the card list where glass blur turns them muddy.
- Leaf shadow reads as light, not content: one sage hue, ~12% opacity, falling from the top-right and fading out downward and to the left; original SVG (blurred branches), no photo asset.
- Paper grain is barely visible (tiled SVG noise). Both live on the canvas (L0), so they never scroll or animate; glass cards soften them; photo-top detail screens cover them. Stays within DESIGN.md's "one hue, morning leaf light" L0 rule.

## Library photo cards: no white glass edge
- The L1 glass edge (1px white border + top highlight) read as a white frame around full-bleed photos. Library cards drop it and use a faint dark hairline + soft shadow instead; photos now run to the card edge. Text-only glass cards (Care, Shared, forms) keep the white edge, where it reads as glass highlight.

## Library detail: a plant profile, not a stub
- Removed the label tag on the photo: it repeated the location ("Desk") shown below. The identification label now appears next to the name only when it says something the location doesn't.
- Order: identity (name, botanical name · type) → care status card (Check due / Up to date, last activity, the cue to act on, Start check / View care) → About this plant (Location, Pot, Check rhythm as one inset list with icons) → Reading this plant (what to look for, when it may need water, after-watering note from the species guide).
- Shorter hero (21.5rem) so status is visible without scrolling; the guide fills what used to be empty space with useful reference.
- The frosted top strip now turns on when the sheet actually reaches the Back row (measured), so it works for any hero height.

## Check status is date-based: Overdue / Check today / nothing
- Replaces the fixed demo states (suggested / recently checked) and the "Check due" + "Up to date" chips.
- Each species has a check interval (Echeveria 4 days; Pothos, Monstera, Spider plant, Parlor palm 7; Golden snake plant, ZZ, Jade 14 — mock content). Next check = day of the last Checked or Watered record + interval. Not sure does not reset it.
- Overdue (terracotta): the check day passed at least one day ago. Check today (leaf green): it falls on today, or the plant has never been checked. Otherwise no chip at all; Library detail shows a quiet "Next check in N days".
- Care groups follow the same rule: "Suggested checks" = Overdue + Check today; the second group is renamed "Not due yet" (was "Recently checked"). Badge counts the same set. Seed pothos last check moved to 9 days ago so a fresh demo shows one Overdue and one Check today.
- Library detail trimmed to what matters: no label tag beside the name (it repeated Pot / Location), no plant type, no "About this plant" list (check rhythm lives in the status card); location and pot are one quiet line under the botanical name.

## Library cards: no "…" menu
- The menu only duplicated Edit plant and View care, both one tap away on the detail page; it repeated on every card, competed with names and photos, sat next to the card's tap area (mis-taps), and Care cards have no such menu. Library cards now have one action: open the plant.

## Add / Edit photo: a photo stage with icon actions
- Replaced the thumbnail + "Optional" copy + "Retake photo" pill + underlined "Remove" link. Now one full-width 4:3 stage: with a photo, glass icon buttons float bottom-right (camera = retake, trash = remove, both with accessible labels); without one, the species illustration sits faded with a forest camera button and the whole stage opens the picker. "Optional" moves into the section title.

## Library card subtitle = the user's own label
- The botanical-name subtitle came from the species catalog, was never shown at Add, and didn't tell two plants of one species apart. Cards now show the identification label the user typed (none → no subtitle; card height stays the same). Botanical name remains on the detail page only.
- Seed labels changed from repeats of the location (Desk / Desk) to distinguishing nicknames: Blue rosette, Red tips, Marble leaves, Swiss cheese, Yellow edges (mock content). Label placeholder now "e.g. Red tips".

## Pot icon shows the tray state
- One generic pot glyph didn't say whether there's a tray. Now: On a tray = pot standing in a solid, lightly filled saucer; No tray = the same pot with only a faint dashed saucer line and a short slash through it. Setup-line icons are slightly larger (1.3rem).

## No botanical names anywhere
- Removed from the Library detail too (and from the species catalog). Under the plant name the detail page now shows the user's own label, matching the Library card subtitle; no label → nothing.

## One way to mark optional fields
- Rule: "Optional" appears only after the section title, in muted text (Photo · Where it lives · Label). Never in placeholders or helper lines. Required fields (Species, Tray) have no marker.
- Label moved out of the Details group into its own "Label Optional" section (single full-width field, placeholder "e.g. Red tips"); Details now holds only Species (Edit) and Tray. The "Optional. Tap again to clear." line under the location tags is gone.

## Add / Edit sheet layout + Remove
- Order follows how you think about a plant: (Add: Species) → Photo → Label → Where it lives → Pot (Tray Yes/No). Edit shows the species under the title instead of a read-only Species row, since it can't change.
- Remove plant is no longer bare text: it's its own inset card at the very end (trash icon + terracotta label, iOS destructive-row style), separated from Save; it still opens the confirmation.

## Library detail identity: easier to scan
- Label under the name is larger and darker (1.02rem, medium). Location and pot are two white pill chips (forest icon + dark semibold text) instead of a faint grey line.
- A label that only repeats the location (e.g. "desk" on a Desk plant) is hidden on both the card and the detail page.

## Care detail check card + activity calendar
- Status is a chip (Overdue terracotta / Check today leaf / Check anytime neutral), same tones as Library. Removed the pot note ("No tray — water at the sink…"; it's in the steps) and "5 short steps · record what you notice" from the card; it now reads chip → action → last checked → Start check.
- Calendar: today is a solid forest circle; each action is a small icon (drop / check / ?) instead of a dot; days a check was due but not done are tinted terracotta ("Check missed"), and the next check day has a dashed ring. Missed / next are computed from the species interval and Checked / Watered records (Not sure doesn't reset). Legend shows all five keys.
- Timeline: more space below the calendar; the day filter has a "× Clear" pill; "Show all N records" is a full-width pill button with a chevron (no bare text link). Timeline entries stay inline — every entry already shows type, time, who and photo, so there's no separate detail view.

## Hand off: no second plant editor; Select all
- Step 2 used to repeat the whole selection as removable tags + "Add plants" right after step 1. Now it shows one compact summary row (overlapping thumbnails, "5 plants", names) that goes back to step 1 to change; the email field gets focus.
- Step 1 has a "Select all" row at the top (with "n of N") and the button says "Continue with N plants".

## Hand off: Select all as a header control
- The "Select all · n of N" card looked like another plant row. It's now a small control on the right of the "Available plants" heading: a round checkbox (empty / dash when some are selected / check when all) + "Select all". The count lives in the button ("Continue with N plants").

## Care cards: action and record look different
- The cue ("Check for soft leaves") and the last record ("Checked · 7 days ago") had near-identical size and color. Now the action is dark ink, medium weight (0.9rem); the record is smaller and faint with a clock icon. The card shows only the action's first sentence (pot detail like "This pot has a tray." lives in the check).

## Timeline attribution: only when it's someone else
- "MA by Maya" repeated the avatar and the name, and "by" read oddly. Your own records now carry no name; records made by someone else (e.g. a caregiver during a handoff) show just their name under the action — no avatar, no "by".

## Activity calendar: one marking language + look ahead
- Replaced the mix of filled circles (missed) and icons under the number (care) with one rule: filled circle = care recorded (watered soft blue / checked soft green / not sure soft amber); outlined circle = a scheduled check (missed = thin terracotta ring, next = dashed forest ring); today = a short forest bar under the number, layered on any state. Legend uses the same swatches.
- The calendar now looks ahead: Next month is enabled up to one month past today, or further if the next check falls later. When a plant is due or overdue, its next check is today (dashed ring on today); missed days run up to yesterday.
- A day with any record shows only its fill — never also a missed ring (a Not sure day used to get both and read like a missed check).
- Previous month stops at the month of the plant's first record; there's nothing to show before it.

## Guided check becomes a short Q&A
- Replaced read-then-Continue steps with questions you answer by tapping (auto-advance): "How do the leaves feel?" (Soft, wrinkled or drooping / Firm and normal / Not sure) → "How does the soil feel?" (Dry / Still damp / Not sure). The card then gives a verdict: Time to water / No water needed (damp) / Not yet (leaves firm) / Hard to tell. Time to water opens a tappable watering checklist (tray steps hidden when the pot has no tray).
- Outcome buttons carry the care colors shared with the calendar: watered blue, checked green, not sure amber. The recommended outcome is the full-width solid button; the other two sit below as small tinted pills under "Something else happened?".
- Motion: the card never remounts or jumps; its height animates (380ms, ease-out) and each panel cross-fades with a short slide (back slides the other way). Scrolling only happens when the card's top would hide behind the pinned Back row or its buttons fall off-screen. A back chevron sits beside the progress bar.

## Library detail: Care basics instead of check guidance
- The plant profile now carries general care notes per species — Light, Water, Soil, Environment (°C / °F) and one "Good to know" tip (mock reference content in speciesCare.ts) — instead of "what to look for / when it may need water", which is the Care check's job.
- Fix (same day): the animated height was measured short (a child's top margin collapsed out of the measuring box) and clipped the last answer; the box is now `display: flow-root`. Height is re-measured right after every content change (plus image loads) instead of waiting for ResizeObserver, which could lag ~1s and leave the watering checklist clipped.

## Guided check: less text, softer motion
- Verdicts are a short title + one line (Time to water · Soft leaves, dry soil / No water needed · Soil is still damp / Not yet · Leaves are still firm / Hard to tell · Look again tomorrow), plus a small "Next check in N days" line for the wait verdicts. Primary button: Record check / Record watering / Record not sure; the other two outcomes are small pills without a prompt line.
- Motion: the outgoing panel fades out in place while the new one rises in 90ms later (slight overshoot); the card height glides on an iOS-like curve (560ms, cubic-bezier(0.32,0.72,0,1)). The page scrolls once, smoothly, when you tap Start check (so the questions sit below the Back row); later steps never move the page.
- Tap feedback: tapping an answer now confirms visibly before moving on — the option fills, its round mark turns into a forest check (spring pop), the row dips slightly, and the card advances after ~320ms (extra taps are ignored meanwhile). Every option shows an empty round mark so it reads as selectable.

## Incoming handoff request card
- Same glass card as everything else (no terracotta side bar). Layout: avatar · name · time; one headline ("Asks you to care for 5 plants"); the plants as the same overlapping photo stack used on Hand off (+N) with a one-line species summary; Decline / Accept. The sender's email and the full list of plant names are gone — the stack carries it. PlantStack is now a shared component.

## One HandoffCard for requests and your handoffs
- Incoming requests and your own handoffs now render through the same HandoffCard (who · when, one headline, plant photo stack + one-line species summary, actions), so both share one data shape (PlantInstance[]) and one style. Your handoffs read "Waiting for Jordan to accept" / "Caring for your N plants" with "Sent just now" / "Since Oct 23"; no email, no name tags.
- Cancel request / End handoff is a small pill at the bottom right instead of a full-width button (it's a rare, secondary action; it still asks for confirmation).

## Updates: plants as a photo stack
- Handoff notifications no longer list every plant name; they show the shared PlantStack (+N) next to the status/time ("Accepted · just now", capitalised). Care-activity notifications (one plant) show that plant's thumbnail with "Species · label · time".

## Shared: fixed structure; one heading + badge style across Care and Shared
- No "Requests" heading that appears and disappears: incoming request cards are the first items in "Caring for others"; once accepted, the same spot shows the plants. "Your handoffs" drops its "Waiting for reply / In care" sub-headings (the card headline carries the status; pending first).
- Both pages use one SectionTitle (Care's small muted heading). A count is shown only for things that need you (Care: Suggested checks; Shared: requests in Caring for others), using the same terracotta pill as the tab-bar and bell badges.

## Handoff on Care cards: avatar pair
- The "Pending handoff" text tag is replaced by two overlapping avatars at the card's bottom-right: your avatar in front with a dashed empty seat behind while the request is pending; your avatar and the caregiver's (dark) once accepted. Screen-reader text says "Handoff to Jordan pending" / "In Jordan's care".

## Guided check: plant + message layout
- Critique of v2 result: three stacked blocks (tinted message box, full-width colored button, a lone floating pill) doubled the emphasis, the secondary action floated unanchored, and the card had no sense of "this plant".
- Result step is now two columns: the species illustration on the left; on the right a round tone badge (top-right; blue / green / amber), title, one line (+ "Next check in N days"), the primary button, and the alternatives as one row of small pills spanning the same width. No tinted message box — colour lives only in the badge and buttons.
- Question steps use the same "plant + message" head: a small plant illustration beside the question and hint (for every species), replacing the large centred image that only Echeveria had.

## Check step art matches the question and the plant
- Leaves question shows a leaf close-up drawn per plant type (succulent: Echeveria, Jade · heart: Pothos · split: Monstera · sword: Golden snake plant, Spider plant · oval: ZZ · frond: Parlor palm). Soil question shows soil in a pot with a fingertip. Original SVGs (StepArt.tsx). The result step keeps the species illustration.
- "Not sure" result now reads just "Look again tomorrow"; the round tone badge is gone from all results. "Record not sure" is a tinted button (light amber fill + amber border), matching the other tinted outcomes rather than a solid dark amber.

## Drawn avatars for the demo people
- Maya and Jordan get illustrated avatars (original flat SVGs in AvatarArt.tsx) so they're told apart at a glance: Maya — warm peach ground, dark hair bun, forest top; Jordan — soft blue ground, short curly hair, mustard top. IdentityAvatar uses them everywhere (Care avatar pair, handoff cards, Updates, Profile); anyone else falls back to initials.
- Soil art (revised): no finger — a terracotta pot seen slightly from above with a crumbly soil surface filling the frame.

## One clock icon for time lines
- "Last checked …" on the check card, "Next check in N days" on the result, and "Checked · N days ago" on Care cards all use the same TimeIcon (outline clock), replacing the calendar icon on the result step.

## Watering steps: one action
- On "Water it like this" the person has already decided to water, so the Checked / Not sure alternatives were confusing there. The step now ends with a single "I watered it" button (records Watered); to change course, the back arrow returns to the result, which offers "Not today".

## Guided check: answers decide the outcome — one action per screen
- Problem: result screens offered a primary plus two alternative outcome buttons (and the water path had a separate "Show me how" step), asking people to decide twice.
- Rule: the two answers are the record. Every screen has exactly one action, and its label says what will be saved: No water needed / Not yet → "Save check" (Checked); Look again tomorrow → "Save as not sure" (Not sure); Time to water → the watering checklist is on the same screen → "I watered it" (Watered). Progress is always 3 steps.
- To change the outcome, go back and change an answer (back arrow). Not watering despite "Time to water" needs no button — leaving keeps the plant due.

## Guided check motion v3: unfold to start, slide between steps
- Start check: the questions unfold top-down (clip reveal + slight drop, 640ms on the iOS-like curve) while the card height eases open on the same curve; the progress bar drops in. Back to the start folds it up (settle from below).
- Between questions / to the result: horizontal slide (forward from the right, back from the left), unchanged.

## After saving: the check card becomes the done state
- Removed the separate "Recorded: …" card below the check and the "You can add a photo after." hint. On save, the same card turns into its done state: a coloured check mark (watered blue / checked green / not sure amber), the outcome, and the time with the clock icon, then Done.
- When caring for someone else's plant, a large dashed photo area sits between the result and Done — camera icon, "Add a photo for Maya", "So they can see how it looks today" (opens the camera on a phone). Once taken it shows the photo with a retake button. The owner's own checks show no photo prompt.

## Hierarchy via tabs; owner view of handoffs; Updates responses (Oct 23)
- Shared and Updates split into segment tabs (page title → tabs → section titles). Shared: "Caring for others" (badge = requests + suggested checks) | "Your handoffs". Updates: "Activity" | "Handoffs".
- Owner: plants in an accepted handoff leave the Care list; one row "N plants with Jordan" (stack + avatar) opens Shared → Your handoffs, where the handoff card is followed by those plants as Care cards (open, read-only). Pending handoffs stay in Care.
- Timeline: once a plant has been shared, every record shows a small avatar + name ("You" for yourself).
- Photo drop: one line, "Take a photo for Maya".
- Updates activity: no "View details" text toggle; photo inline; heart button with pop + burst; reply field with a send button, replies shown as bubbles (stored on the update; the caregiver sees them too).
- Your handoffs: the caregiver's plants are split like Care ("Suggested checks" / "Not due yet", no needs-you count badge since the checks are the caregiver's) and carry the same owner + caregiver avatar pair as on the caregiver's side, so a shared plant's card looks the same for both people.

## Owner can remind the caregiver (Oct 24)
- While a handoff is accepted, the owner's plant detail shows one card: the caregiver's avatar, "In Jordan's care", the status chip when due, and a single action "Remind Jordan" (primary when the plant is due). After sending, the button becomes "Reminder sent · just now" — no toast, the card is the confirmation. One reminder per plant per day.
- "End handoff" and the explanatory copy were removed from this card; ending lives with the handoff on Shared → Your handoffs.
- A reminder is a relationship update (`care_reminder`). The caregiver sees the newest unread one as a pop-up: who sent it, the plant (photo, label, cue), "Later" or "Check now" (opens that plant's detail). Either choice marks it read; it also appears in Updates → Activity.
