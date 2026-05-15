# Chat UI Implementation Checklist
*~27 items across 4 parallel tracks*

---

## Track A — Shell & Layout (start immediately)

**A1. Add CSS design tokens to globals.css**
- Append `--chat-*` CSS variable block under `:root` (see blueprint §2)
- Add `.dark` selector block with dark-mode token overrides
- Add `@keyframes typingDot` for the 3-dot pulse: `0%,80%,100%{transform:scale(1)} 40%{transform:scale(1.4)}`
- Remove no-longer-needed AWS-specific vars (keep color values but remove `--aws-*` prefix vars — the tailwind tokens remain)

**A2. Update app/layout.tsx**
- Add `suppressHydrationWarning` to `<html>` tag (needed for dark mode class toggling)
- Add `<link rel="preconnect" href="https://fonts.googleapis.com">` and Inter font preload `<link>` in `<head>` to eliminate FOIT
- Add `className="antialiased"` to `<body>`

**A3. Update lib/types.ts — add chat types**
- Add `ChatStep` union type: `'landing' | 'parsing' | 'selecting-module' | 'selecting-artifact' | 'generating-notes' | 'generating-done' | 'design-lab'`
- Add `ChatMessageRole`: `'user' | 'assistant'`
- Add `ChatMessageType`: `'text' | 'file-attachment' | 'typing' | 'module-list' | 'artifact-options' | 'generating' | 'stream' | 'stream-done'`
- Add `ChatMessage` interface (id, role, type, content?, fileName?, modules?, artifactType?, streamContent?, wordCount?)
- Keep all existing types unchanged

**A4. Rewrite app/page.tsx as ChatOrchestrator**
- Replace all existing state (`step`, `modules`, `selectedModule`, `artifactType`) with chat equivalents:
  `chatStep`, `messages`, `modules`, `selectedModule`, `artifactType`, `darkMode`
- Import and conditionally render:
  - `chatStep === 'landing' || chatStep === 'parsing'` → `<ChatLanding>`
  - `chatStep === 'selecting-module' || chatStep === 'selecting-artifact' || chatStep === 'generating-notes' || chatStep === 'generating-done'` → `<ChatInterface>`
  - `chatStep === 'design-lab'` → wrap `<DesignLab>` in a div with `<ChatHeader>` at top
- Pass all handler callbacks down as props
- Root div: `className="min-h-screen"` with `style={{ background: 'var(--bg-base)' }}`
- Add `darkMode` toggle: `<html>` tag gets `className={darkMode ? 'dark' : ''}` — do this via `useEffect` on `document.documentElement.classList`

**A5. Create lib/chat-state.ts helper**
- `generateId()` → `crypto.randomUUID()` (or `Date.now().toString(36)`)
- `makeUserMessage(type, content?, fileName?)` → returns ChatMessage
- `makeAiMessage(type, opts?)` → returns ChatMessage
- `appendMessage(setMessages, msg)` → append helper
- `updateLastMessage(setMessages, updater)` → for live streaming updates to last AI bubble
- No React imports — pure functions only

---

## Track B — Chat UI Components (start immediately, parallel with A)

**B1. Create components/chat/FilePill.tsx**
- Props: `fileName: string`, `onRemove: () => void`
- Renders: pill div with 📎 icon + truncated filename + ✕ button
- Styles: `background: var(--bg-input)`, `border-radius: 12px`, `padding: 4px 10px`, `font-size: 13px`
- ✕ button calls `onRemove()`

**B2. Create components/chat/ChatInput.tsx**
- Props: `value: string`, `onChange`, `onSubmit`, `onFileSelect`, `disabled?: boolean`, `placeholder?: string`, `multiline?: boolean` (true on landing, false in chat mode)
- Hidden `<input type="file">` with ref
- Pill-shaped wrapper: `border-radius: 24px`, `background: var(--bg-input)`
- Auto-growing textarea (`rows={1}` base, max-height 200px via `onInput` height recalc)
- 📎 button (left of textarea): SVG paperclip icon, calls `fileInputRef.current?.click()`
- Send button (right, circular 40×40px): orange when enabled, disabled+opacity-40 when `!canSubmit`
- `canSubmit` = `value.trim().length > 30 || fileSelected`
- Shift+Enter = newline, Enter alone = `onSubmit()`
- Landing mode (`multiline=true`): textarea has min-height 140px, no pill shape — use `border-radius: 16px` rectangular

**B3. Create components/chat/TypingIndicator.tsx**
- Three dots in a row, each with `animation: typingDot 1.2s ease-in-out infinite` staggered 200ms
- Wrapped in a small pill: `padding: 12px 16px`, `background: var(--bg-ai-bubble)`, `border-radius: var(--chat-bubble-radius-ai)`
- Only render when passed `visible: boolean` prop

**B4. Create components/chat/MessageBubble.tsx**
- Props: `message: ChatMessage`
- User bubbles: `align-self: flex-end`, orange bg, white text, user radius, `max-width: 80%`
- AI bubbles: `align-self: flex-start`, surface bg, dark text, ai radius, `max-width: 85%`, shadow-card
- For `type === 'file-attachment'`: renders paperclip icon + filename in user bubble
- For `type === 'text'`: renders `content` as text (support basic bold `**...**` → `<strong>` via simple replace)
- Entry animation: `opacity: 0; transform: translateY(8px)` → resting, triggered by adding `animate-in` class after 10ms mount

**B5. Create components/chat/StreamingBubble.tsx**
- Props: `streamContent: string`, `wordCount: number`, `done: boolean`
- Renders as an AI bubble variant
- While streaming: show `content` rendered as markdown (use the `renderMarkdown()` function copied/imported from GenerateStep), with a pulsing orange dot + word count badge in top-right corner
- When `done=true`: hide the dot, show `InlineActions` below
- Uses `useEffect` + ref to scroll into view as content grows

**B6. Create components/chat/InlineActions.tsx**
- Props: `content: string`, `artifactType: ArtifactType`, `module: ParsedModule`
- Renders row of action buttons: `[Copy] [Download PDF] [Edit]`
- Same logic as GenerateStep action buttons (copy to clipboard, html2pdf download)
- Style: small pill buttons, `background: var(--bg-input)`, `border-radius: 20px`, `font-size: 13px`
- Appears with fade-in after `done` prop becomes true

**B7. Create components/chat/ModuleCards.tsx**
- Props: `modules: ParsedModule[]`, `onSelect: (mod: ParsedModule) => void`
- Renders as a list inside an AI bubble (no separate container needed, just a `<div className="space-y-2 mt-2">`)
- Each card: full-width button, left orange stripe (4px), module number badge, title, `Sem N · M hrs`, truncated topics row
- Hover: `translateY(-2px)`, `box-shadow: var(--shadow-card)` stronger
- `border-radius: var(--chat-card-radius)`

**B8. Create components/chat/ArtifactCards.tsx**
- Props: `onSelect: (type: ArtifactType) => void`
- 3 cards in a grid: Notes (🗒), PPTX (📊), Workbook (📋)
- Each card: icon (large, centered or top-left), label (`font-weight: 700`), one-line description, output stats
- Cards sourced from `ARTIFACT_TYPES` in lib/types.ts
- Selected state: orange border + light orange bg tint
- `border-radius: var(--chat-card-radius)`

**B9. Create components/chat/GeneratingMessage.tsx**
- Props: `artifactType: ArtifactType`
- Renders AI bubble with: pulsing orange loader (spinner SVG), text "Generating your [Notes / PPTX / Workbook]…"
- For PPTX: add sub-line "Opening Design Lab in a moment…"
- Animation: spinner + text fade-in on mount

**B10. Create components/chat/ChatHeader.tsx**
- Props: `onNew: () => void`, `darkMode: boolean`, `onToggleDark: () => void`, `showBackToChat?: boolean`, `onBackToChat?: () => void`
- Fixed 48px bar at top: `position: sticky; top: 0; z-index: 40`
- Left: "← New" button (calls `onNew`) OR "← Chat" button (when `showBackToChat`)
- Center: "Campus AI" wordmark (font-size 15px, font-weight 700)
- Right: ◑ dark/light toggle button
- Background: `var(--bg-surface)`, bottom border `1px solid var(--border-subtle)`, `backdrop-filter: blur(8px)`

---

## Track C — Flow & State Logic (wait ~90s for Track B to exist)

**C1. Create components/chat/ChatLanding.tsx**
- Props: `onModulesExtracted: (mods: ParsedModule[]) => void`, `isParsing: boolean`
- Full-viewport centered layout: branding (logo circle + "Campus AI" + tagline) centered in upper half
- Lower half: FilePill (if file selected) + ChatInput (multiline mode)
- State: `text`, `file`, `error` — same logic as SyllabusStep
- On submit: calls `onModulesExtracted` after `POST /api/parse` resolves
- Transition class: add `data-exiting` attr when isParsing, CSS applies exit animation

**C2. Create components/chat/ChatInterface.tsx**
- Props: `messages: ChatMessage[]`, `chatStep: ChatStep`, `modules: ParsedModule[]`, `selectedModule: ParsedModule | null`, `artifactType: ArtifactType | null`, `onModuleSelect`, `onArtifactSelect`, `onRestart`, `streamContent: string`, `wordCount: number`, `streamDone: boolean`
- Renders: `<ChatHeader>` + scrollable message list + `<ChatInput>` (minimal mode, disabled during selections)
- Message list: `<div ref={listRef}>` that scrolls to bottom on messages change
- For each message in `messages`: render appropriate component based on `message.type`:
  - `text` / `file-attachment` → `<MessageBubble>`
  - `typing` → `<TypingIndicator>`
  - `module-list` → `<MessageBubble>` (ai) containing `<ModuleCards>`
  - `artifact-options` → `<MessageBubble>` (ai) containing `<ArtifactCards>`
  - `generating` → `<GeneratingMessage>`
  - `stream` / `stream-done` → `<StreamingBubble>`
- `useEffect([messages])` → `listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })`

**C3. Wire syllabus parse flow in page.tsx**
- `handleSyllabusSubmit(text, file)`:
  1. Append user message (text snippet or file attachment)
  2. Set `chatStep = 'parsing'`
  3. POST to `/api/parse`
  4. On resolve: set `modules`, set `chatStep = 'selecting-module'`
  5. Append AI typing indicator (remove after 800ms delay)
  6. Append AI message: "I found [N] modules. Which would you like to explore?" + module-list message

**C4. Wire module selection flow in page.tsx**
- `handleModuleSelect(mod: ParsedModule)`:
  1. Append user message: `mod.title`
  2. Set `selectedModule`
  3. Set `chatStep = 'selecting-artifact'`
  4. After 600ms: append AI message with module detail + artifact-options

**C5. Wire artifact selection flow in page.tsx**
- `handleArtifactSelect(type: ArtifactType)`:
  1. Append user message: "Notes" / "PPTX" / "Workbook"
  2. Set `artifactType`
  3. If `type === 'pptx'`:
     - After 400ms delay: append AI `generating` message
     - After 1200ms: transition to `chatStep = 'design-lab'`
  4. If `type === 'notes' || 'workbook'`:
     - Set `chatStep = 'generating-notes'`
     - Append AI `stream` message (empty)
     - Start streaming from `/api/generate` (POST), update `streamContent` and `wordCount` live
     - On stream end: set `chatStep = 'generating-done'`, mark message as `stream-done`

**C6. Handle restart flow**
- `handleRestart()`: clear messages array, clear selectedModule, clear artifactType, set chatStep = 'landing'

**C7. Handle streaming state in page.tsx**
- `streamContent` and `wordCount` live in page.tsx state
- `updateLastMessage` helper updates the last message in the array with new `streamContent` / `wordCount`
- On stream done: `setMessages(msgs => [...msgs.slice(0,-1), {...lastMsg, type:'stream-done'}])`

---

## Track D — Generation Transition & DesignLab Integration (wait ~120s for B+C)

**D1. DesignLab wrapper in page.tsx for design-lab step**
```tsx
{chatStep === 'design-lab' && selectedModule && (
  <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-base)' }}>
    <ChatHeader
      onNew={handleRestart}
      darkMode={darkMode}
      onToggleDark={() => setDarkMode(d => !d)}
      showBackToChat
      onBackToChat={() => setChatStep('selecting-artifact')}
    />
    <div className="flex-1 overflow-auto pt-4">
      <DesignLab
        module={selectedModule}
        onBack={() => setChatStep('selecting-artifact')}
        onRestart={handleRestart}
      />
    </div>
  </div>
)}
```

**D2. CSS transition classes for screen switches**
In `globals.css`:
```css
.chat-exit { animation: slideUpFade 200ms ease-out forwards; }
.chat-enter { animation: slideInUp 250ms ease-out 50ms both; }
.designlab-exit { animation: slideLeftFade 250ms ease-in-out forwards; }
.designlab-enter { animation: slideInRight 300ms ease-out 100ms both; }

@keyframes slideUpFade { to { opacity:0; transform:translateY(-20px); } }
@keyframes slideInUp { from { opacity:0; transform:translateY(20px); } }
@keyframes slideLeftFade { to { opacity:0; transform:translateX(-30px); } }
@keyframes slideInRight { from { opacity:0; transform:translateX(30px); } }
```
Apply classes in page.tsx based on step transitions using a `prevStep` ref.

**D3. Notes/Workbook streaming in ChatInterface**
- `StreamingBubble` receives `streamContent`, `wordCount`, `done` props from page.tsx
- It renders the live content using the `renderMarkdown()` helper (copy from GenerateStep or extract to `lib/render-markdown.ts`)
- When `done=true`, `InlineActions` renders with fade-in

**D4. Verify TypeScript — run npx tsc --noEmit**
- Fix any type errors introduced by the new ChatMessage / ChatStep types
- Ensure all component prop types are correct
- Verify DesignLab.tsx still compiles without modification

**D5. Final visual QA checklist**
- Landing: branding centered, input works, file pill shows, send enables correctly
- Chat: messages append in order, scroll tracks bottom, module cards are tappable
- Artifact cards: all 3 render, selection fires correct flow
- Notes flow: streaming text appears live in AI bubble, word count badge updates
- PPTX flow: transition to DesignLab animates correctly, back-to-chat works
- Dark mode toggle: token swaps correctly, no flash on toggle
- Mobile: chat column is full-width, input bar is touch-friendly (min 44px targets)
- TypeScript: zero errors from `npx tsc --noEmit`
