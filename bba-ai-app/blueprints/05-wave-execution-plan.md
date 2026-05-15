# Blueprint 05 — Wave Execution Plan

This is the Claws Wave orchestration blueprint. A LEAD worker reads this file and orchestrates 4 sub-workers that implement the 4 phases in dependency order.

---

## Wave Architecture

```
┌─────────────────────────────────────────────────────┐
│                    LEAD Worker                       │
│   Orchestrates wave, runs final typecheck            │
└──────────────────────┬──────────────────────────────┘
                       │
           ┌───────────▼──────────┐
           │     PHASE 1 worker   │
           │  lib/types.ts +      │
           │  slide interfaces    │
           └───────────┬──────────┘
                       │ (must complete first)
           ┌───────────▼──────────┐
           │     PHASE 2 worker   │
           │  lib/design-lab.     │
           │  server.ts           │
           └───────────┬──────────┘
                       │ (must complete first)
           ┌───────────┴──────────┐
           │                      │
 ┌─────────▼──────┐   ┌──────────▼──────┐
 │  PHASE 3 worker │   │  PHASE 4 worker  │
 │  API routes     │   │  DesignLab.tsx   │
 └─────────┬──────┘   └──────────┬──────┘
           │                      │
           └──────────┬───────────┘
                      │ (both must complete)
           ┌──────────▼──────────┐
           │  LEAD: final check  │
           │  npx tsc --noEmit   │
           └─────────────────────┘
```

**Dependency order**:
- Phase 1 runs alone first (no deps)
- Phase 2 runs after Phase 1 completes
- Phase 3 and Phase 4 run in **parallel** after Phase 2 completes
- LEAD runs final typecheck after Phase 3 and Phase 4 both complete

---

## LEAD Worker Mission

Copy this text verbatim as the mission for `claws_worker`:

```
You are the LEAD orchestrator for the Design Lab v3 upgrade wave.
Project root: /Users/sumitsatapathy/Unified_X/bba-ai-app/

Your job: dispatch 4 phase sub-workers in dependency order, wait for each phase, then run a final typecheck. Do NOT implement any code yourself. You only orchestrate.

DEPENDENCY ORDER:
- Phase 1 first (alone)
- Phase 2 after Phase 1 completes
- Phase 3 + Phase 4 in parallel after Phase 2 completes
- Final typecheck after Phase 3 and Phase 4 both complete

STEP 1: Create the wave.
Call claws_wave_create with:
  name: "design-lab-v3"
  description: "Design Lab HTML→Image pipeline upgrade"

Save the waveId returned.

STEP 2: Register yourself.
Call claws_hello with:
  waveId: <waveId from step 1>
  subWorkerRole: "LEAD"

Save the peerId returned. Start heartbeat loop (every 20s):
  claws_publish("worker.<peerId>.heartbeat", {})

STEP 3: Dispatch Phase 1.
Call claws_dispatch_subworker with:
  waveId: <waveId>
  role: "phase1-types"
  mission: <copy the Phase 1 Sub-Worker Mission from this blueprint>
  detach: true

Save terminal_id and correlation_id. Monitor using monitor_arm_command from the response.
Call claws_workers_wait([terminal_id]) and wait until it reports completion.

Verify Phase 1 success:
  claws_exec("cd /Users/sumitsatapathy/Unified_X/bba-ai-app && npx tsc --noEmit 2>&1 | head -30")
If errors exist that are NOT in app/api or components (only type errors in server engine from old imports), that is a failure — stop and report.

STEP 4: Dispatch Phase 2.
Call claws_dispatch_subworker with:
  waveId: <waveId>
  role: "phase2-server"
  mission: <copy the Phase 2 Sub-Worker Mission from this blueprint>
  detach: true

Save terminal_id and correlation_id. Monitor. Wait for completion.

Verify Phase 2 success:
  claws_exec("cd /Users/sumitsatapathy/Unified_X/bba-ai-app && npx tsc --noEmit 2>&1 | head -30")
Acceptable errors after Phase 2: errors in app/api/design-lab/route.ts and components/DesignLab.tsx about missing imports. NOT acceptable: errors in lib/design-lab.server.ts itself.

STEP 5: Dispatch Phase 3 and Phase 4 IN PARALLEL.
Call claws_dispatch_subworker twice (separate calls):
  First call: role "phase3-routes", mission = Phase 3 mission text
  Second call: role "phase4-ui", mission = Phase 4 mission text
Both with detach: true.

Save BOTH terminal_ids. Monitor both.
Call claws_workers_wait([phase3_terminal_id, phase4_terminal_id]) to wait for both.

STEP 6: Final verification.
Run:
  claws_exec("cd /Users/sumitsatapathy/Unified_X/bba-ai-app && npx tsc --noEmit 2>&1")

Expected output: empty (0 errors).

If errors exist: investigate, report to user, do NOT attempt to fix (that is not your role).

If clean: report success.

STEP 7: Complete the wave.
Call claws_wave_complete(waveId)
Then call claws_done()
Print: __CLAWS_DONE__
```

---

## Phase 1 Sub-Worker Mission

Copy this text verbatim as the mission for Phase 1 dispatch:

```
You are Phase 1 worker in the Design Lab v3 upgrade wave.
Project root: /Users/sumitsatapathy/Unified_X/bba-ai-app/

Your mission: Update lib/types.ts and the slide type interfaces in lib/design-lab.server.ts.
Read the blueprint at /Users/sumitsatapathy/Unified_X/bba-ai-app/blueprints/01-phase1-types-and-schema.md for exact instructions.

TASK SUMMARY:

FILE 1: lib/types.ts
- Change `SlideCount` from `6 | 10 | 15 | 20 | 30` to `10 | 20`
- Remove `html: string` from SlideState interface

FILE 2: lib/design-lab.server.ts
- Find the block of 9 old slide type interfaces (TitleSlide, AgendaSlide, ContentSlide, StatsSlide, CaseStudy, QuoteSlide, Takeaways, EndSlide, DiagramSlide) and the old AnySlide union
- Replace them with the 16 new interfaces (TitleSlide, OverviewSlide, ExperienceTriggerSlide, ReflectionSlide, ConceptSlide, ProcessFlowSlide, ComparisonSlide, FrameworkSlide, WorkedExampleSlide, ExampleCaseSlide, ExerciseSlide, PrototypeStudioSlide, TestFeedbackSlide, SummarySlide, ChecklistSlide, TransitionRecapSlide) and new AnySlide union
- The exact TypeScript code for all 16 interfaces is in the blueprint file

DO NOT change anything else in these files.
DO NOT touch render functions, build functions, genImage, genDiagram, etc.

AFTER CHANGES:
1. Run: cd /Users/sumitsatapathy/Unified_X/bba-ai-app && npx tsc --noEmit
2. Acceptable: errors in app/api files and components about old imports
3. NOT acceptable: errors in lib/types.ts or the interface section of lib/design-lab.server.ts

Wave protocol:
- Call claws_hello(waveId=<WAVE_ID>, subWorkerRole="phase1-types") immediately
- Publish wave.<WAVE_ID>.phase1-types.boot
- Heartbeat every 20s: worker.<peerId>.heartbeat
- Publish wave.<WAVE_ID>.phase1-types.complete when done
- Call claws_done()
- Print __CLAWS_DONE__
```

**Note**: The LEAD must replace `<WAVE_ID>` with the actual wave ID before dispatching.

---

## Phase 2 Sub-Worker Mission

Copy this text verbatim as the mission for Phase 2 dispatch:

```
You are Phase 2 worker in the Design Lab v3 upgrade wave.
Project root: /Users/sumitsatapathy/Unified_X/bba-ai-app/

Your mission: Completely rewrite lib/design-lab.server.ts to replace the HTML-rendering pipeline with the image-generation pipeline.
Read the blueprint at /Users/sumitsatapathy/Unified_X/bba-ai-app/blueprints/02-phase2-server-engine.md for exact instructions and complete code.

TASK SUMMARY (all details including full code are in the blueprint):

STEP 1 — DELETE these from lib/design-lab.server.ts:
- Remove the top-level `import Anthropic` and `const anthropic = new Anthropic(...)` lines
- Remove ALL render* functions: renderTitle, renderAgenda, renderContent, renderStats, renderCaseStudy, renderQuote, renderTakeaways, renderEnd, renderDiagram
- Remove renderSlide() dispatcher
- Remove buildHtml()
- Remove buildHtmlWrapper()
- Remove logo(), chrome(), nav() internal helpers
- Remove genImage()
- Remove genDiagram()
- Remove old SLIDE_DISTRIBUTIONS (with keys 6, 10, 15, 20, 30)

STEP 2 — ADD new content (full code in blueprint):
- New SLIDE_DISTRIBUTIONS with ONLY keys 10 and 20 (Refer.pdf sequence)
- THEME_STYLE_DESCRIPTORS (6 theme entries, exported)
- SLIDE_LAYOUT_DESCRIPTORS (16 layout entries, NOT exported — internal const)
- buildSlideImagePrompt(slide, themeKey, moduleTitle): string (exported)
- genSlideImage(fullPrompt: string): Promise<string | null> (exported)
  - image_size: 'landscape_16_9' (NOT landscape_4_3)
  - timeout: 90000ms
  - NO "NO TEXT" directive
- buildContentPrompt() REWRITE with:
  - All 16 type JSON schemas inline
  - Design Thinking + Kolb pedagogy instructions
  - depthInstruction (10=breadth, 20=deep)
  - visualPrompt guidance (MUST include actual text)
  - Real companies (Infosys/Zomato/Tata for India, Apple/McKinsey/Amazon for Global)
  - max_tokens guidance: 8000

WHAT TO KEEP UNCHANGED:
- The `import Anthropic` is REMOVED, but DO NOT remove other imports
- Keep: DIRECTIONS, DirectionConfig, WB, BASE_CSS, WB_EXTRA_CSS, RUNTIME_JS, esc() helper
- Keep: all 16 slide type interfaces added by Phase 1 worker

AFTER CHANGES:
1. Run: cd /Users/sumitsatapathy/Unified_X/bba-ai-app && npx tsc --noEmit
2. Acceptable: errors in app/api/design-lab/route.ts (still imports old names) and components/DesignLab.tsx
3. NOT acceptable: errors in lib/design-lab.server.ts itself

Wave protocol:
- Call claws_hello(waveId=<WAVE_ID>, subWorkerRole="phase2-server") immediately
- Publish wave.<WAVE_ID>.phase2-server.boot
- Heartbeat every 20s: worker.<peerId>.heartbeat
- Publish wave.<WAVE_ID>.phase2-server.complete when done
- Call claws_done()
- Print __CLAWS_DONE__
```

---

## Phase 3 Sub-Worker Mission

Copy this text verbatim as the mission for Phase 3 dispatch:

```
You are Phase 3 worker in the Design Lab v3 upgrade wave.
Project root: /Users/sumitsatapathy/Unified_X/bba-ai-app/

Your mission: Update app/api/design-lab/route.ts and app/api/design-lab/regenerate/route.ts.
Read the blueprint at /Users/sumitsatapathy/Unified_X/bba-ai-app/blueprints/03-phase3-api-routes.md for complete replacement code.

TASK SUMMARY:

FILE 1: app/api/design-lab/route.ts
COMPLETE REPLACEMENT with new content (full code in blueprint). Key changes:
- Imports: remove DIRECTIONS, buildHtmlWrapper, genImage, genDiagram, renderSlide
  Add: buildSlideImagePrompt, genSlideImage (from @/lib/design-lab.server)
- maxDuration: 120 → 180
- generateSlides(): max_tokens 6000 → 8000, timeout 60000 → 90000
- init SSE event: remove wrapper and wb fields
- Pass 2: replace conditional task array with pure Promise.all over genSlideImage
- slide SSE event: remove html field, imageUrl present for ALL slides
- Per-slide errors are non-fatal (emit null imageUrl, continue)

FILE 2: app/api/design-lab/regenerate/route.ts
COMPLETE REPLACEMENT with new content (full code in blueprint). Key changes:
- Imports: remove DIRECTIONS, genImage, genDiagram, renderSlide
  Add: buildSlideImagePrompt, genSlideImage
- maxDuration: 60 → 90
- Body: remove all conditional media/HTML logic
  Replace with: const imageUrl = await genSlideImage(buildSlideImagePrompt(slideContent, direction, module.title))
- Response: return { imageUrl, content } — NO html field

AFTER CHANGES:
1. Run: cd /Users/sumitsatapathy/Unified_X/bba-ai-app && npx tsc --noEmit
2. Acceptable after Phase 3 only: errors in components/DesignLab.tsx (if Phase 4 not done yet)
3. NOT acceptable: errors in app/api/design-lab/route.ts or regenerate/route.ts

Wave protocol:
- Call claws_hello(waveId=<WAVE_ID>, subWorkerRole="phase3-routes") immediately
- Publish wave.<WAVE_ID>.phase3-routes.boot
- Heartbeat every 20s: worker.<peerId>.heartbeat
- Publish wave.<WAVE_ID>.phase3-routes.complete when done
- Call claws_done()
- Print __CLAWS_DONE__
```

---

## Phase 4 Sub-Worker Mission

Copy this text verbatim as the mission for Phase 4 dispatch:

```
You are Phase 4 worker in the Design Lab v3 upgrade wave.
Project root: /Users/sumitsatapathy/Unified_X/bba-ai-app/

Your mission: Rewrite components/DesignLab.tsx to replace iframe display with image carousel.
Read the blueprint at /Users/sumitsatapathy/Unified_X/bba-ai-app/blueprints/04-phase4-ui.md for the COMPLETE FILE REPLACEMENT.

The blueprint contains the full new file content — replace the entire file.

TASK SUMMARY (the blueprint has the full TypeScript):

1. REMOVE: WrapperInfo interface, buildFullHtml() function, wrapper state, fullHtml computed, all <iframe> elements
2. ADD: currentSlide state (useState<number>(0)), doneSlides derived from slides where status === 'done'
3. ADD: useEffect for keyboard navigation (ArrowRight/Space → next, ArrowLeft → prev, Escape → exit fullscreen)
4. ADD: SlideImageFallback component for null imageUrl slides
5. REPLACE: SLIDE_COUNTS with only 10 and 20 (with description strings)
6. REPLACE: SLIDE_TYPE_LABELS with 16 entries for all new types
7. REPLACE: preview area <iframe> with <img src={currentDoneSlide.imageUrl}> in 16:9 container
8. ADD: prev/next buttons in toolbar + slide position indicator (X/N)
9. REPLACE: fullscreen <iframe> with <img> carousel + dot navigation
10. REPLACE: handleDownload to fetch each imageUrl and download as PNG (200ms delay between)
11. REPLACE: download button label from "Download HTML" to "Download Images"
12. ADD: useEffect to reset currentSlide to 0 when status becomes 'streaming'
13. UPDATE: init SSE handler — remove setWrapper() call (no wrapper field)
14. UPDATE: slide SSE handler — store imageUrl (no html field)
15. UPDATE: handleRegenerateSlide — remove html from state update
16. REPLACE: SlideEditForm with 16 cases (one per slide type) + VisualPromptField on every case
17. UPDATE: toolbar status text to show slide position
18. Add: clicking a slide thumbnail sets currentSlide to match doneSlides position

Add `useEffect` to imports (was not imported before):
  import { useState, useRef, useCallback, useEffect } from 'react';

AFTER CHANGES:
1. Run: cd /Users/sumitsatapathy/Unified_X/bba-ai-app && npx tsc --noEmit
2. Expected: 0 errors (since both Phase 3 and Phase 4 should make the full project clean)
3. Also run: npm run build -- to verify no build errors

Wave protocol:
- Call claws_hello(waveId=<WAVE_ID>, subWorkerRole="phase4-ui") immediately
- Publish wave.<WAVE_ID>.phase4-ui.boot
- Heartbeat every 20s: worker.<peerId>.heartbeat
- Publish wave.<WAVE_ID>.phase4-ui.complete when done
- Call claws_done()
- Print __CLAWS_DONE__
```

---

## LEAD Pseudocode (MCP calls)

```typescript
// STEP 1: Create wave
const { waveId } = await claws_wave_create({
  name: "design-lab-v3",
  description: "Design Lab HTML→Image pipeline upgrade",
});

// STEP 2: Register
const { peerId } = await claws_hello({ waveId, subWorkerRole: "LEAD" });
startHeartbeat(peerId, 20000); // every 20s: claws_publish("worker.<peerId>.heartbeat", {})

// STEP 3: Phase 1
const p1 = await claws_dispatch_subworker({
  waveId,
  role: "phase1-types",
  mission: PHASE_1_MISSION_TEXT, // with waveId substituted
  detach: true,
});
Monitor({ command: p1.monitor_arm_command, timeout_ms: 300000 });
await claws_workers_wait({ terminal_ids: [p1.terminal_id] });

// Verify Phase 1
const p1check = await claws_exec("cd /Users/sumitsatapathy/Unified_X/bba-ai-app && npx tsc --noEmit 2>&1 | head -50");
// Check: no errors in lib/types.ts or the interfaces section

// STEP 4: Phase 2
const p2 = await claws_dispatch_subworker({
  waveId,
  role: "phase2-server",
  mission: PHASE_2_MISSION_TEXT,
  detach: true,
});
Monitor({ command: p2.monitor_arm_command, timeout_ms: 600000 });
await claws_workers_wait({ terminal_ids: [p2.terminal_id] });

// Verify Phase 2
const p2check = await claws_exec("cd /Users/sumitsatapathy/Unified_X/bba-ai-app && npx tsc --noEmit 2>&1 | head -50");
// Check: no errors in lib/design-lab.server.ts itself

// STEP 5: Phase 3 + Phase 4 in parallel
const p3 = await claws_dispatch_subworker({
  waveId, role: "phase3-routes", mission: PHASE_3_MISSION_TEXT, detach: true,
});
const p4 = await claws_dispatch_subworker({
  waveId, role: "phase4-ui", mission: PHASE_4_MISSION_TEXT, detach: true,
});

// Monitor both
Monitor({ command: p3.monitor_arm_command, timeout_ms: 600000 });
Monitor({ command: p4.monitor_arm_command, timeout_ms: 600000 });
await claws_workers_wait({ terminal_ids: [p3.terminal_id, p4.terminal_id] });

// STEP 6: Final verification
const finalCheck = await claws_exec("cd /Users/sumitsatapathy/Unified_X/bba-ai-app && npx tsc --noEmit 2>&1");
// Expected: empty output (0 errors)

// STEP 7: Complete
await claws_wave_complete({ waveId });
await claws_done();
// Print: __CLAWS_DONE__
```

---

## Timeouts and Failure Handling

| Phase | Expected Duration | Timeout |
|-------|------------------|---------|
| Phase 1 | 5–10 min | 5 min |
| Phase 2 | 15–25 min | 10 min |
| Phase 3 | 5–10 min | 10 min |
| Phase 4 | 20–35 min | 15 min |

If any phase worker times out:
1. LEAD reads the worker's log with `claws_read_log(terminal_id)`
2. Reports the error to the user with the last 50 lines of the log
3. Stops and marks the wave as failed
4. Does NOT continue to the next phase

---

## Pre-flight Checklist for LEAD

Before dispatching any workers, LEAD should verify:

```bash
# Confirm project exists
ls /Users/sumitsatapathy/Unified_X/bba-ai-app/

# Confirm blueprints exist
ls /Users/sumitsatapathy/Unified_X/bba-ai-app/blueprints/

# Confirm current state compiles (baseline)
cd /Users/sumitsatapathy/Unified_X/bba-ai-app && npx tsc --noEmit 2>&1 | head -20

# Confirm env vars exist (at minimum for local dev)
cat /Users/sumitsatapathy/Unified_X/bba-ai-app/.env.local 2>/dev/null | grep -E "FAL_KEY|OPENROUTER|ANTHROPIC" | sed 's/=.*/=***/'
```

If the current codebase doesn't compile at baseline, report to user before proceeding.
