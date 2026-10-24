# Leafnote

Leafnote is an exploratory, mobile-first web prototype for plant-watering care. It explores how plant owners and temporary caregivers can make watering decisions, retain plant-specific context, and communicate that context when care changes hands.

> Leafnote is an early-stage product and research prototype. Its current interactions are working hypotheses, not validated product requirements or botanical advice.

## What the prototype explores

- Seeing which plants may need attention
- Reviewing plant-specific observable cues and practical care instructions
- Recording a check when no water is needed
- Recording a completed watering
- Following a guided care check
- Reviewing a plant's recent care history
- Organizing owned plants in a visual library
- Handing off temporary care and following shared-care updates

The prototype uses realistic local sample data and stores changes in the browser. It does not include authentication, backend services, plant recognition, or AI diagnosis.

## Built with

- React 19
- TypeScript
- Vite
- Remix Icon
- Browser local storage for prototype state

## Getting started

```bash
npm install
npm run dev
```

Open the local URL shown by Vite. The interface is designed mobile-first and is presented in a phone-sized canvas on larger screens.

## Available commands

```bash
npm run dev      # Start the development server
npm run build    # Type-check and create a production build
npm run preview  # Preview the production build
npm test         # Run the prototype behavior checks
```

## Project documentation

- [`docs/DESIGN.md`](docs/DESIGN.md) records the current interaction and visual direction.
- [`docs/DECISIONS.md`](docs/DECISIONS.md) keeps a chronological log of product and design decisions.
- [`docs/RESEARCH.md`](docs/RESEARCH.md) preserves research evidence separately from product interpretation.

## Author

Designed and developed by **Qinly**.

[View Qinly's portfolio](https://qinlyismoon.github.io/)
