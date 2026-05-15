# Blueprint 06 — End-to-End Verification Checklist

This checklist is for the final worker or human reviewer after all 4 phases are complete. Run all checks in order. Every item must pass before the upgrade is considered done.

---

## Environment Setup

Before running checks, ensure:
- Dev server is running: `cd /Users/sumitsatapathy/Unified_X/bba-ai-app && npm run dev`
- Browser DevTools open (Network tab, Console tab)
- `.env.local` has `FAL_KEY`, `OPENROUTER_API_KEY` (or `ANTHROPIC_API_KEY`)
- Browser is at `http://localhost:3000`

---

## Checklist

### TypeScript & Build

- [ ] `npx tsc --noEmit` reports **0 errors**
  - Run: `cd /Users/sumitsatapathy/Unified_X/bba-ai-app && npx tsc --noEmit`
  - Expected output: empty (zero lines)

- [ ] `npm run build` completes without errors
  - Run: `cd /Users/sumitsatapathy/Unified_X/bba-ai-app && npm run build`
  - Expected: "Route (app)" table printed, no red errors

- [ ] `npm run dev` starts without TypeScript errors in terminal output

### Old Code Removal

- [ ] `lib/design-lab.server.ts` contains NO `renderTitle` function
  - Verify: `grep -n "renderTitle" /Users/sumitsatapathy/Unified_X/bba-ai-app/lib/design-lab.server.ts`
  - Expected: no output

- [ ] `lib/design-lab.server.ts` contains NO `buildHtmlWrapper` function
  - Verify: `grep -n "buildHtmlWrapper" /Users/sumitsatapathy/Unified_X/bba-ai-app/lib/design-lab.server.ts`
  - Expected: no output

- [ ] `lib/design-lab.server.ts` contains NO `genDiagram` function
  - Verify: `grep -n "genDiagram" /Users/sumitsatapathy/Unified_X/bba-ai-app/lib/design-lab.server.ts`
  - Expected: no output

- [ ] `lib/design-lab.server.ts` contains NO `genImage` function (old signature)
  - Verify: `grep -n "export async function genImage" /Users/sumitsatapathy/Unified_X/bba-ai-app/lib/design-lab.server.ts`
  - Expected: no output

- [ ] `components/DesignLab.tsx` contains NO `<iframe` elements
  - Verify: `grep -n "iframe" /Users/sumitsatapathy/Unified_X/bba-ai-app/components/DesignLab.tsx`
  - Expected: no output

- [ ] `components/DesignLab.tsx` contains NO `buildFullHtml` function
  - Verify: `grep -n "buildFullHtml" /Users/sumitsatapathy/Unified_X/bba-ai-app/components/DesignLab.tsx`
  - Expected: no output

- [ ] `components/DesignLab.tsx` contains NO `WrapperInfo` interface
  - Verify: `grep -n "WrapperInfo" /Users/sumitsatapathy/Unified_X/bba-ai-app/components/DesignLab.tsx`
  - Expected: no output

### New Code Presence

- [ ] `lib/design-lab.server.ts` exports `genSlideImage`
  - Verify: `grep -n "export async function genSlideImage" /Users/sumitsatapathy/Unified_X/bba-ai-app/lib/design-lab.server.ts`
  - Expected: 1 line found

- [ ] `lib/design-lab.server.ts` exports `buildSlideImagePrompt`
  - Verify: `grep -n "export function buildSlideImagePrompt" /Users/sumitsatapathy/Unified_X/bba-ai-app/lib/design-lab.server.ts`
  - Expected: 1 line found

- [ ] `lib/design-lab.server.ts` exports `THEME_STYLE_DESCRIPTORS`
  - Verify: `grep -n "export const THEME_STYLE_DESCRIPTORS" /Users/sumitsatapathy/Unified_X/bba-ai-app/lib/design-lab.server.ts`
  - Expected: 1 line found

- [ ] `lib/design-lab.server.ts` has `landscape_16_9` image size
  - Verify: `grep -n "landscape_16_9" /Users/sumitsatapathy/Unified_X/bba-ai-app/lib/design-lab.server.ts`
  - Expected: 1 line found

- [ ] `lib/design-lab.server.ts` SLIDE_DISTRIBUTIONS has keys 10 and 20 only
  - Verify: `grep -n "SLIDE_DISTRIBUTIONS" /Users/sumitsatapathy/Unified_X/bba-ai-app/lib/design-lab.server.ts`
  - Then read the SLIDE_DISTRIBUTIONS block — should have exactly 2 keys: 10 and 20

- [ ] `lib/types.ts` SlideCount is `10 | 20` only
  - Verify: `grep -n "SlideCount" /Users/sumitsatapathy/Unified_X/bba-ai-app/lib/types.ts`
  - Expected: `export type SlideCount = 10 | 20;`

- [ ] `lib/types.ts` SlideState has NO `html` field
  - Verify: `grep -n "html" /Users/sumitsatapathy/Unified_X/bba-ai-app/lib/types.ts`
  - Expected: no output

- [ ] `app/api/design-lab/route.ts` has `maxDuration = 180`
  - Verify: `grep -n "maxDuration" /Users/sumitsatapathy/Unified_X/bba-ai-app/app/api/design-lab/route.ts`
  - Expected: `export const maxDuration = 180;`

- [ ] `app/api/design-lab/route.ts` has `max_tokens: 8000`
  - Verify: `grep -n "max_tokens" /Users/sumitsatapathy/Unified_X/bba-ai-app/app/api/design-lab/route.ts`
  - Expected: `max_tokens: 8000`

### UI Functional Tests

Navigate to Design Lab in the browser (`http://localhost:3000` → select a module → Design Lab):

- [ ] **Slide count selector shows only 2 options**: "10 slides" and "20 slides"
  - Open Design Lab, check the Slide Count section
  - Should see exactly 2 buttons: "10 slides" and "20 slides"
  - Should NOT see 6, 15, or 30

- [ ] **Each slide count button shows a description**
  - "10 slides" button shows: "Quick overview — all topics, concise"
  - "20 slides" button shows: "Deep dive — full pedagogical treatment"

- [ ] **Generate 10-slide deck** — submit a module with multiple topics
  - Click "Generate Slides"
  - Watch the progress cards — they should fill in as slides complete
  - After generation: exactly 10 progress cards

- [ ] **Slides render as `<img>` tags, NOT iframes**
  - Open DevTools > Elements
  - Look at the main preview area after slides generate
  - Should see `<img src="https://fal.media/...">` NOT `<iframe>`

- [ ] **All N slides fire image requests simultaneously (parallel)**
  - Open DevTools > Network tab
  - Filter by "fal.run" or look at the timeline
  - When Pass 2 starts, multiple image requests should start at nearly the same time
  - They should NOT be sequential (one starting after the previous finishes)

- [ ] **Slide position counter appears in toolbar**
  - After generation, toolbar shows "1 / 10" or similar counter
  - Counter has prev (←) and next (→) buttons

- [ ] **Keyboard arrows navigate slides**
  - Click anywhere in the main preview area
  - Press → arrow key: advances to slide 2
  - Press ← arrow key: goes back to slide 1
  - Space bar: advances to next slide

- [ ] **Prev/Next buttons navigate slides**
  - Click ← button: goes to previous slide
  - Click → button: goes to next slide
  - Buttons disable at boundaries (first/last slide)

- [ ] **Clicking a slide thumbnail selects it in the preview**
  - Click slide card #5 in the grid
  - Main preview updates to show slide 5's image

- [ ] **Null imageUrl shows graceful fallback**
  - If FAL_KEY is not set or image fails, should see an orange fallback card
  - Should NOT show a broken image icon or crash
  - Fallback shows slide type and title text

- [ ] **10-slide deck covers all input topics (breadth-first)**
  - Submit a module with 5+ topics (e.g., "Marketing Mix, Segmentation, Branding, Positioning, Consumer Behavior")
  - After generation, review slide content cards
  - All topics should appear across the 10 slides

- [ ] **20-slide deck is deeper and covers all topics**
  - Submit same module with slideCount = 20
  - Should generate 20 slides
  - More slide types visible (reflection, framework, comparison, test-feedback, prototype-studio)

- [ ] **Fullscreen mode works as image carousel**
  - Click "Present" button
  - Should open fullscreen overlay
  - Slides display as `<img>` (not iframe)
  - Dot navigation at bottom works
  - ← → arrow keys navigate
  - Escape key or ✕ button exits fullscreen

- [ ] **Download Images button appears** (not "Download HTML")
  - After generation, verify button label says "↓ Download Images"
  - NOT "↓ Download HTML"

- [ ] **Download triggers PNG downloads**
  - Click "↓ Download Images"
  - Browser should show multiple PNG download prompts or save files
  - Filenames should be `<module-slug>-slide-01-title.png` etc.

- [ ] **Edit panel opens for any slide type**
  - Click any slide card (concept, process-flow, example-case, etc.)
  - Edit panel opens showing correct fields for that type
  - Every case should have a "Visual Prompt" textarea at the bottom

- [ ] **Regenerate Slide updates image in place**
  - Open edit panel for a slide
  - Modify the Visual Prompt text
  - Click "Regenerate Slide Image"
  - Slide card shows spinner, then green dot
  - Main preview updates with new image

- [ ] **All 6 themes produce different visual prompts**
  - Check `THEME_STYLE_DESCRIPTORS` in lib/design-lab.server.ts
  - 6 distinct entries, each describing a different color palette and aesthetic
  - When generating with "tech-dark" vs "modern-minimal", the image prompts are visibly different

### SSE Event Shape Verification

Test with curl to verify route behavior without UI:

```bash
curl -X POST http://localhost:3000/api/design-lab \
  -H "Content-Type: application/json" \
  -d '{
    "module": {
      "semester": 2,
      "module": 3,
      "title": "Consumer Behaviour",
      "hours": 4,
      "topics": ["Buying Decision Process", "Psychological Factors", "Social Influences"],
      "tools": [],
      "indianCaseStudy": "Flipkart Big Billion Days consumer psychology"
    },
    "direction": "campus-ai",
    "slideCount": 10,
    "customPrompt": ""
  }' --no-buffer 2>&1
```

Expected:
- [ ] First event has `"event":"init"` with `"total":10` and `"direction":"campus-ai"` — NO `wrapper` or `wb` fields
- [ ] Slide events have `"event":"slide"` with `imageUrl` field (either a URL or null) — NO `html` field
- [ ] Last event is `"event":"done"` with `"total":10`
- [ ] 10 slide events total (all 10 fires before done event)

### Regenerate Route

```bash
curl -X POST http://localhost:3000/api/design-lab/regenerate \
  -H "Content-Type: application/json" \
  -d '{
    "slideContent": {
      "type": "concept",
      "eyebrow": "KEY CONCEPT",
      "title": "Consumer Decision Process",
      "definition": "The consumer decision process is a series of steps...",
      "bullets": ["Need recognition", "Information search", "Evaluation"],
      "visualPrompt": "Slide titled Consumer Decision Process, left side definition text..."
    },
    "direction": "modern-minimal",
    "module": {
      "semester": 2,
      "module": 3,
      "title": "Consumer Behaviour",
      "hours": 4,
      "topics": ["Buying Decision Process"],
      "tools": []
    }
  }'
```

Expected:
- [ ] Response is JSON with `imageUrl` (string or null) and `content` object
- [ ] Response does NOT have `html` field
- [ ] Response does NOT have `wrapper` or `wb` fields

---

## Pass Criteria

All checkboxes must be checked before this upgrade is considered complete.

Any failing check must be investigated and fixed before reporting success. Do not mark the wave as complete if any check fails.

---

## Reporting

If all checks pass, report to the user:

```
Design Lab v3 upgrade complete.
- 16 slide types active (Refer.pdf pedagogy)
- Image pipeline: all slides rendered as 16:9 PNGs via nano-banana-pro
- Slide counts: 10 (breadth) and 20 (depth)
- No iframes — pure <img> carousel with keyboard nav
- TypeScript: 0 errors
- Build: clean
```

If any checks fail, list them and their diagnostic output.
