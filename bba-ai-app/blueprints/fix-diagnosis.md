# Fix Diagnosis — bba-ai-app

## Root Cause: 0-Module Parse Bug

**File:** `app/page.tsx:52` sends `formData.append('syllabus', text)` — uses key `'syllabus'`
**File:** `app/api/parse/route.ts:136` reads `formData.get('text')` — expects key `'text'`

Field name mismatch means `pastedText` is always `null` when user pastes text. The API returns `{ error: 'No file or text provided.' }` with a 400 status. Then in `page.tsx:58` the code does `data.modules ?? []` — which silently produces 0 modules, no error shown to user.

**Fix:** Change `page.tsx:52` from `formData.append('syllabus', text)` → `formData.append('text', text)`.

Or alternatively, update `route.ts` to also check `formData.get('syllabus')`. Either works; the page.tsx fix is simpler.

## ChatLanding — What Needs to Change

1. **App name:** `Campus AI` → `UNAITED` with UN**AI**TED render (AI in white/highlighted)
2. **Logo circle:** Currently shows `✦` — change to white `U` letter
3. **Tagline:** `Generate BBA content in minutes` → `Turn your syllabus into a complete learning experience`
4. **Input:** `ChatInput` is rendered with `multiline=true` which gives borderRadius:16 box shape. Need pill shape (`borderRadius: 9999px`, height 52px min)
5. **Layout:** Two zones — upper 55% branding, lower 45% pill input
6. **Title font size:** Currently `28px` — should be `clamp(52px, 7vw, 96px)`, weight 800

## ChatInput — What Needs to Change

1. **multiline mode shape:** Currently uses `borderRadius: 16` — need `borderRadius: 9999px` (pill), expanding to 24px when rows > 1
2. **Background:** Use `#16161e` explicitly (not just CSS var which may resolve to light color)
3. **Border:** `1px solid rgba(255,255,255,0.08)` — subtle white border
4. **No outer wrapper border** — the pill IS the input container
5. **canSubmit threshold:** Currently `value.trim().length > 30` — this is correct but note that the input placeholder says "Paste your syllabus here or upload a file…" and users may type less than 30 chars before the arrow activates
6. **Send button:** Should be `#f97316` (orange) — currently uses `var(--accent)` which is correct if CSS var is set

## ChatHeader — What Needs to Change

1. **App name:** `Campus AI` (line 64) → `UNAITED`
2. **Dark styling:** `background: var(--bg-surface)` needs to resolve to dark in default mode
3. **Backdrop blur:** Already has `backdropFilter: blur(8px)` — good

## globals.css — What Needs to Change

1. **`--bg-base`:** Currently `#fafafa` (light) — should be `#0a0a0f` (dark) as default
2. **`--bg-surface`:** Currently `#ffffff` — should be dark `#141420`
3. **`--bg-input`:** Currently `#f4f4f5` — should be `#16161e`
4. **`--text-primary`:** Currently `#0a0a0a` — should be `#e2e8f0`
5. **`--text-muted`:** Currently `#71717a` — should be `#8892a4`
6. **`--border-subtle`:** Currently `#e4e4e7` — should be `rgba(255,255,255,0.06)`
7. **body background:** Currently `#F2F3F3` (AWS style) — override with dark bg
8. **The app is dark-first:** Remove light-mode defaults; `.dark` class overrides are redundant once default is dark

## Other Issues

- `page.tsx` doesn't show any error to the user if parse fails (catch block just resets to landing silently)
- The `ChatInterface.tsx` probably has a wrapper div around ChatInput with a visible border that needs removing
- `body { background-color: #F2F3F3 }` at top of globals.css overrides the dark CSS vars
