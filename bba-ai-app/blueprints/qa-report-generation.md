# QA Report — Generation Pipelines (Layer 1)
Date: 2026-05-16

---

## 1. `/api/generate/route.ts` — Notes / Workbook

| Check | Result | Notes |
|---|---|---|
| Accepts `{ module, artifactType }` body | **PASS** | Validates both fields, 400 on missing |
| ANTHROPIC_API_KEY guard | **PASS** | Returns 503 with clear message |
| Streams plain text (not SSE) | **PASS** | `Content-Type: text/plain; charset=utf-8`, raw chunks |
| page.tsx reads plain text correctly | **PASS** | `getReader()` loop accumulates into `full`, no SSE parsing needed |
| Error appended inline as markdown | **PASS** | Fallback writes `\n\n---\n\n**Error**: …` into stream |

**Verdict: ALL PASS**

> Note: task brief called this "SSE endpoint" — it is intentionally a plain text stream. The client handles it correctly.

---

## 2. `/api/design-lab/route.ts` — PPTX / Slide Generation

| Check | Result | Notes |
|---|---|---|
| `programName` field handled | **PASS** | `body.programName \|\| 'BBA'` |
| `universityName` field handled | **PASS** | `body.universityName \|\| ''` |
| `customThemeColors` field handled | **PASS** | Parsed from body; forwarded to `buildSlideImagePrompt` |
| SSE `init` shape: `{ event, total, direction, resolvedCount }` | **PASS** | Matches DesignLab consumer |
| SSE `slide` shape: `{ event, index, type, content, imageUrl, status }` | **PASS** | Matches DesignLab consumer exactly |
| SSE `done` shape: `{ event, total }` | **PASS** | DesignLab sets status to 'done' on receipt |
| Error shape: `{ error: string }` | **PASS** | Emitted on content-gen failure; DesignLab sets errorMsg |
| Individual slide failure non-fatal | **PASS** | `.catch` emits `imageUrl: null` and continues |
| `maxDuration = 180` export | **PASS** | Prevents Vercel 60s timeout for large decks |
| OpenRouter primary + Anthropic fallback | **PASS** | Falls back silently on OpenRouter error |

**Verdict: ALL PASS**

---

## 3. `/api/generate-image/route.ts`

| Check | Result | Notes |
|---|---|---|
| FAL_KEY guard | **PASS** | Returns `{ imageUrl: null, reason: 'FAL_KEY not configured' }` — non-fatal |
| Request shape `{ prompt: string }` | **PASS** | 400 on missing/empty prompt |
| Response `{ imageUrl: string \| null }` | **PASS** | Null on error with `reason` field |
| `AbortSignal.timeout(60000)` | **PASS** | Prevents hanging fal.ai requests |
| 16:9 aspect ratio + quality params | **PASS** | `aspect_ratio: '16:9'`, negative_prompt set |

**Verdict: ALL PASS**

---

## 4. `app/page.tsx` — Orchestration Logic

| Check | Result | Notes |
|---|---|---|
| `handleArtifactSelect('pptx')` → `design-lab` step | **PASS** | `setTransitioning(true)` → `setChatStep('design-lab')` → 350ms timeout clears |
| `handleArtifactSelect('notes'\|'workbook')` → `/api/generate` | **PASS** | POST with `{ module: selectedModule, artifactType: type }` |
| `updateLastMessage` pattern (stream chunk) | **PASS** | Checks `last.id !== streamMsg.id` guard before updating |
| Word count computed inline | **PASS** | `full.trim().split(/\s+/).filter(Boolean).length` |
| `stream` → `stream-done` type transition | **PASS** | `setChatStep('generating-done')` + message type flip on stream end |
| Design-lab renders DesignLab + back-button header | **PASS** | `ChatHeader showBackToChat` + `onBackToChat` → `selecting-artifact` |

**Verdict: ALL PASS**

---

## 5. `components/chat/StreamingBubble.tsx`

| Check | Result | Notes |
|---|---|---|
| Renders `streamContent` via `renderMarkdown` | **PASS** | `dangerouslySetInnerHTML` with `renderMarkdown(streamContent)` |
| Placeholder while empty | **PASS** | "Starting generation…" when `streamContent` is falsy |
| Word count badge (live) | **PASS** | `{wordCount.toLocaleString()} words` shown when `!done && wordCount > 0` |
| Pulsing live indicator | **PASS** | Ping animation dot shown when `!done` |
| Done state shows `InlineActions` | **PASS** | `done && artifactType && module` guard |
| Auto-scroll on update | **PASS** | `useEffect` on `streamContent` calls `scrollIntoView` |

**Verdict: ALL PASS**

---

## Warnings (non-breaking)

### WARN-1: Duplicate chat type definitions in `lib/types.ts`
- `ChatStep`, `ChatMessage`, `ChatMessageRole`, `ChatMessageType` are defined in both `lib/types.ts` (lines 24–56) and `lib/chat-types.ts`.
- Nothing currently imports these from `lib/types.ts`; all files use `lib/chat-types.ts`.
- Risk: future developers may import from either file and get divergence if one is updated without the other.
- Recommendation: remove the duplicate chat type block from `lib/types.ts` when convenient.

### WARN-2: `customThemeColors` gated on `direction === 'custom'` in DesignLab
- `DesignLab.tsx:209` only sends `customThemeColors` when `direction === 'custom'`.
- This is intentional (custom colors only apply in custom direction mode), but if the UX allows color editing in other directions this will silently ignore them.

---

## TypeScript

```
npx tsc --noEmit → 0 errors
```

**PASS**

---

## Summary

| Area | Status |
|---|---|
| `/api/generate` body + stream | PASS |
| `/api/design-lab` fields + SSE shapes | PASS |
| `/api/generate-image` FAL_KEY + shapes | PASS |
| `page.tsx` routing + streaming logic | PASS |
| `StreamingBubble` rendering + done state | PASS |
| TypeScript (`tsc --noEmit`) | PASS (0 errors) |
| Fixes applied | None required |
