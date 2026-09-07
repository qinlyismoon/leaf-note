# Leafnote — Agent Instructions

Leafnote is an exploratory, mobile-first web prototype about plant-watering care.

The project investigates how plant owners and temporary caregivers make watering
decisions, retain plant-specific care context, and communicate that context when
care changes hands.

This project is in an early research and product-definition stage. Requirements
and interpretations are provisional and will change as research continues.

---

## Current working principles

- Treat research evidence, interpretation, product hypotheses, and design
  decisions as separate categories.
- Do not present preliminary observations as validated findings.
- Do not invent participant details, quotations, behaviors, or user needs.
- Do not convert research observations directly into product requirements.
- State important assumptions before implementing them.
- Prefer small, testable interaction changes over large feature additions.
- Build mobile-first responsive interfaces.
- Use realistic local sample data.
- Keep the code easy to revise as the research evolves.

---

## Research integrity

- Preserve raw interview evidence.
- Append new evidence rather than silently rewriting previous evidence.
- Clearly label synthesized observations as preliminary.
- Keep contradictions, differences, and unresolved questions visible.
- Do not modify raw research evidence to match the current product design.
- Do not update research documents unless explicitly requested.

---

## Current prototype boundaries

The initial prototype may explore:

- viewing plants that may need checking;
- viewing plant-specific observable cues;
- viewing practical watering instructions;
- recording “checked — no water needed”;
- recording “watered”;
- viewing a basic care history;
- eventually exploring temporary care handoff.

Do not add these unless explicitly requested:

- authentication;
- backend services;
- AI plant diagnosis;
- plant recognition;
- community or social features;
- subscriptions;
- gamification;
- complex permissions;
- a complete handoff system.

---

## Working process

Before a significant implementation:

1. Read the relevant project documentation.
2. State the assumptions being made.
3. Propose the smallest useful change.
4. Wait for approval when the change affects product direction.
5. Implement the agreed change.
6. Verify the main interaction.
7. Recommend documentation updates, but do not make research claims automatically.

---

## Documentation

When a product decision changes:

- update `docs/PRODUCT.md` if the product direction changes;
- update `docs/DESIGN.md` if an interaction principle changes;
- append a short entry to `docs/DECISIONS.md`;
- do not rewrite raw interview evidence in `docs/RESEARCH.md`.

Research documents should only be updated when explicitly requested.
