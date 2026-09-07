# Leafnote — Design

*Exploratory UI/UX direction for a mobile-first web prototype.*  
*Not validated product requirements. Research evidence remains in `docs/RESEARCH.md` and is not rewritten here.*

**Last updated:** 2026-09-06

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

---

## 2. Approved design direction

### 2.1 Information architecture

Leafnote has three primary destinations in a bottom navigation:

| Tab | Role |
|---|---|
| **Care** | In-the-moment checking and judgment |
| **Plant Library** | Identity and organization of plant instances |
| **Profile** | Lightweight person / prototype meta (non-auth) |

**Care** contains two contexts:

| Segment | Role |
|---|---|
| **Personal care** | The user’s own plant instances and presentation states (shallow) |
| **Shared space** | Temporary caregiver flow and relationship-care context |

The existing temporary-caregiver list and care flow live initially in
**Shared space**.

**Canonical plant instances** are shared across Library, Personal Care, and
Shared Space. Care history belongs to the plant instance. Context-specific
presentation (e.g. suggested check in a care context) may be modeled
separately. Complete permissions and responsibility management are out of
scope.

### 2.2 Navigation and badges

- Compact **glass-like** bottom toolbar with **icon + short text label** for
  every tab.
- Inactive items remain identifiable (not color dots alone).
- Active state uses contrast / weight / label emphasis — **not** the badge.
- **Number badges** = unresolved **suggested checks**, not plant totals, not
  selected-tab state.

**Badge rules (working hypothesis — see §3):**

| Location | Count |
|---|---|
| Bottom **Care** badge | Total unresolved suggested checks across Personal + Shared |
| Care segment **Personal** | Unresolved suggested checks in Personal only |
| Care segment **Shared** | Unresolved suggested checks in Shared only |

### 2.3 Device presentation

| Mode | Behavior |
|---|---|
| **Desktop presentation** | Fixed iPhone-proportion **application canvas** (no exterior phone frame). Optional decorative status area: time, Dynamic Island, signal, Wi‑Fi, battery. |
| **Real mobile** | Full-bleed app; **hide** simulated system status bar; respect `safe-area-inset-*`. |

### 2.4 Plant Library

- Visual metaphor: plants on **shelves** (inspired by references; original
  assets only).
- Distinguish **species** (preset care-type templates) from **plant
  instances** (owned / cared-for individuals).
- Each instance may have a **short identification label** (bubble), max
  **5 visible characters**, with a **`0/5` counter** on entry.
- Label examples (illustrative): `蓝色小盆`, `书桌左边`, `妈妈送的`, `有托盘`.
- The label is **not** detailed care guidance and belongs to the **instance**,
  not the species.
- Label must not be the only identifier and must not obscure other plants.
- **Add Plant** FAB appears **only** on Plant Library, above the bottom nav
  and safe area.

### 2.5 Progressive care interaction (structure approved)

Care content for a plant uses a progressive card flow (see §3 for the
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

Continue the quiet botanical editorial system:

- cream and pale blue-grey surfaces;
- serif display + clean sans UI hierarchy;
- generous spacing;
- soft depth and restrained glass;
- shelf composition in Library;
- muted accents (sage, powder blue, terracotta, soft yellow — restrained);
- tactile, paper-like quality.

Do **not** copy proprietary text, branding, illustrations, icons, or assets
from visual references.

### 2.7 Accessibility constraints for glass navigation

- Readable contrast; solid-color fallback if blur is unsupported or weak;
- Active state not conveyed by color alone;
- Nav must not cover final page content;
- Touch targets remain accessible;
- FAB clears nav and safe area.

### 2.8 Personal Care (shallow but functional)

Personal Care shows the user’s plant instances and current presentation
states. It does **not** add schedules, notifications, advanced care
management, or backend behavior.

Shared Space remains the home of the temporary-caregiver flow and
relationship-specific context.

### 2.9 Profile (minimal but intentional)

- Avatar placeholder  
- Display name  
- Brief care-role or relationship-space summary  
- Optional clearly non-functional settings rows for visual completeness  

No authentication, account editing, security settings, real notifications, or
profile persistence.

### 2.10 Add Plant (minimally functional, local only)

1. Tap FAB  
2. Select from **preset** species  
3. Optional identification label (max 5 visible characters, `0/5`)  
4. Save  
5. New instance appears on the Library shelf  

Local state / `localStorage` only. No custom species creation, image
recognition, photo upload, backend, or botanical search.

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
- segment badge;
- bottom Care badge;
- recent activity.

**Why this hypothesis:** Suggested checks should feel actionable; “Not sure”
may still need attention. This is a product hypothesis, not a validated need.

### 3.3 Checking ≠ watering

List language and care copy continue to separate **checking** from
**watering**. Suggested checks invite observation, not mandatory watering.

### 3.4 Shared vs Personal contexts on one instance

The same plant instance may appear in Library (identity), Personal Care
(owner context), and Shared Space (relationship-care context), with
context-specific presentation state where needed.

### 3.5 Identification labels

A 5-character bubble is enough for at-a-glance distinction on a shelf; detailed
care stays in Care flows.

---

## 4. Unresolved questions

1. How should Personal vs Shared **presentation state** be stored when both
   reference the same instance — one shared flag, or per-context flags?
2. When a plant is only in Personal Care (not shared), should Shared stay empty
   or show an intentional empty state?
3. After “Not sure,” what later action should clear the suggested check if the
   user never records Checked/Watered?
4. Is 5 visible characters workable for mixed CJK/Latin scripts and emoji?
5. Should newly added Library plants automatically appear in Personal Care,
   Shared Space, both, or neither until assigned?
6. Does progressive care outperform “View all” for first-time caregivers in
   session tests?
7. Does the desktop decorative status bar help or confuse “this is a web
   prototype”?
8. What minimum content makes Profile feel intentional without implying a real
   account?
9. How many shelf rows / density before the Library metaphor breaks on small
   phones?
10. Should Care history show a single timeline per instance across contexts, or
    filter by Personal vs Shared?

---

## 5. Current iteration

Approved build scope for the next implementation sequence:

| Area | Include |
|---|---|
| App shell | Three tabs: Care, Plant Library, Profile; icon + text; restrained glass nav |
| Care | Personal / Shared segmented control |
| Shared | Existing Desk/Shelf caregiver flow connected here |
| Personal | Shallow functional list of instances + presentation states |
| Care interaction | Progressive cards + View all; three outcomes; same-page confirmation; history |
| Badges | Care total + per-segment counts; resolution rules in §3.2 |
| Data | Canonical plant instances; local persistence |
| Plant Library | Shelf with existing two instances; 5-char label bubbles; `0/5` counter |
| Add Plant | Minimally functional local flow from presets |
| Profile | Minimal intentional view (§2.9) |
| Presentation | Desktop iPhone-proportion canvas + decorative status; real-mobile safe areas; no exterior frame |
| Visual | Continued high-fidelity editorial botanical direction |
| Docs | This file; do not rewrite `docs/RESEARCH.md` as part of UI work |

**Composite sample note (developer-facing):** Desk and Shelf remain composite
prototype scenarios informed by separate exploratory sources. They do not
represent one participant, one handoff event, or complete botanical guidance.
Shelf tray setup remains mock prototype content.

---

## 6. Later scope

Explicitly deferred:

- Complete handoff creation  
- Full responsibility-state management  
- Owner reply and exception-photo workflow  
- Authentication, backend, synchronization, sharing links  
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
| Progressive cards, badges, Library shelves, Profile, Personal/Shared IA | Design / product exploration — **not** research findings |
| Detailed long-term history as a primary need | Previously **narrowed** in research synthesis; history remains lightweight |

Do not cite this document as evidence that users “need” badges, shelves, or
Personal/Shared segmentation.

---

## 8. Documentation maintenance

When interaction principles change, update this file and append
`docs/DECISIONS.md` if that log exists and is requested.

Do not modify raw interview evidence in `docs/RESEARCH.md` to match the UI.
