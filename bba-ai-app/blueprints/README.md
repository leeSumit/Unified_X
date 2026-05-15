# BBA AI App — Design Lab v3 Blueprints

## Purpose

This folder contains implementation blueprints for the **Design Lab image-driven architecture upgrade**. These documents are intended to be consumed by autonomous Claws workers. Each blueprint is **self-contained** and actionable with zero hand-holding.

---

## Reading Order

| File | Phase | Responsible For | Dependencies |
|------|-------|-----------------|--------------|
| `00-architecture-overview.md` | N/A | Context & understanding | None — read first |
| `01-phase1-types-and-schema.md` | 1 | `lib/types.ts`, slide interfaces in `lib/design-lab.server.ts` | None |
| `02-phase2-server-engine.md` | 2 | All of `lib/design-lab.server.ts` | Phase 1 must be done |
| `03-phase3-api-routes.md` | 3 | `app/api/design-lab/route.ts`, `app/api/design-lab/regenerate/route.ts` | Phase 2 must be done |
| `04-phase4-ui.md` | 4 | `components/DesignLab.tsx` | Phase 2 must be done |
| `05-wave-execution-plan.md` | Wave | Claws LEAD orchestration blueprint | Read all others first |
| `06-verification-checklist.md` | Final | End-to-end QA checklist | All phases done |

---

## The Upgrade in One Sentence

Replace the HTML-rendering pipeline (iframe, CSS, mermaid, renderSlide) with a fully image-driven pipeline where **nano-banana-pro** generates every slide as a complete 16:9 PNG using prompts composed by **Claude Sonnet** following the **Refer.pdf pedagogy** framework.

---

## Key Constraints

- **Slide count: 10 or 20 ONLY.** No other values.
- **All slide image API calls fire in parallel** (Promise.all) after outline is complete.
- **NO iframes anywhere** in the new UI.
- **NO HTML rendering functions** in the new server.
- **visualPrompt must contain actual slide text**, not abstract descriptions.
- `npx tsc --noEmit` must pass at 0 errors after every phase.

---

## Environment Variables

| Variable | Purpose |
|----------|---------|
| `FAL_KEY` | fal.ai API key for nano-banana-pro image generation |
| `OPENROUTER_API_KEY` | Claude Sonnet via OpenRouter (primary) |
| `ANTHROPIC_API_KEY` | Claude Sonnet direct (fallback) |

---

## Project Root

```
/Users/sumitsatapathy/Unified_X/bba-ai-app/
```

All file paths in blueprints are relative to this root unless stated otherwise.
