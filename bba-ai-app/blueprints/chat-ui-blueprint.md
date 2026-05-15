# Campus AI — Chat UI Blueprint
*Premium chat-based UI overhaul for bba-ai-app (Next.js 15 App Router)*

---

## 1. Executive Summary

Replace the current AWS-styled 4-step wizard (SyllabusStep → ModuleStep → ArtifactStep → GenerateStep/DesignLab) with a full-screen, Kimi-inspired premium chat interface. All existing API routes remain unchanged. The new UI is purely a frontend transformation — same data, same APIs, radically better experience.

---

## 2. Design Tokens

```css
/* globals.css additions — prefix: --chat-* */

/* Layout */
--chat-max-w: 720px;           /* max-width of chat column */
--chat-input-radius: 16px;     /* input bar corner radius */
--chat-bubble-radius-user: 20px 20px 4px 20px;
--chat-bubble-radius-ai: 20px 20px 20px 4px;
--chat-card-radius: 16px;      /* option cards */

/* Colors — light mode */
--bg-base: #fafafa;            /* page background */
--bg-surface: #ffffff;         /* bubbles, cards, panels */
--bg-input: #f4f4f5;           /* input bar background */
--bg-user-bubble: #f97316;     /* user bubble (orange brand) */
--text-user-bubble: #ffffff;
--bg-ai-bubble: #ffffff;       /* assistant bubble */
--text-ai-bubble: #0a0a0a;
--border-subtle: #e4e4e7;
--text-primary: #0a0a0a;
--text-muted: #71717a;
--accent: #f97316;             /* orange accent */
--accent-hover: #ea6c0f;

/* Colors — dark mode (prefers-color-scheme: dark) */
--bg-base-dark: #0a0a0a;
--bg-surface-dark: #141414;
--bg-input-dark: #1e1e1e;
--bg-user-bubble-dark: #f97316;
--bg-ai-bubble-dark: #1e1e1e;
--text-primary-dark: #fafafa;
--text-muted-dark: #a1a1aa;
--border-subtle-dark: #27272a;

/* Typography */
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
--text-xs: 11px;
--text-sm: 13px;
--text-base: 15px;

/* Spacing (8px grid) */
--sp-1: 8px;
--sp-2: 16px;
--sp-3: 24px;
--sp-4: 32px;
--sp-6: 48px;

/* Shadows */
--shadow-card: 0 1px 3px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.04);
--shadow-input: 0 2px 8px rgba(0,0,0,0.06);
```

---

## 3. Screen Architecture

### Screen 1 — Landing / Syllabus Input

**Layout:** Full viewport, vertically centered column (max-w 720px).

**Structure (top → bottom):**
```
┌─────────────────────────────────────────┐
│  [nav-dots-decoration]  (subtle top bar) │
│                                          │
│                                          │
│   ● Campus AI                            │  ← branding (centered)
│   Generate BBA content in seconds        │  ← tagline
│                                          │
│                                          │
│  ┌──────────────────────────────────┐    │
│  │  Paste your syllabus or upload…  │    │  ← textarea (grows)
│  │                                  │    │
│  │                                  │    │
│  └──────────────────────────────────┘    │
│  [📎 Upload]              [Send ↑]       │  ← action row below input
│                                          │
│  subtle gradient fade at bottom          │
└─────────────────────────────────────────┘
```

**Behavior:**
- Textarea auto-grows (min-h 120px, max-h 300px)
- Send button: disabled (opacity 40%) when textarea empty AND no file selected
- Send button: enabled (full orange) once > 30 chars OR file selected
- 📎 button opens `<input type="file" accept=".pdf,.docx,.txt,.md">`
- When file is selected: a pill appears above the textarea: "📎 module-1-syllabus.pdf ✕"
- Pressing Enter (without Shift) submits. Shift+Enter = newline.
- Background: `--bg-base` with very subtle radial gradient from center

**Transition to Screen 2:**
- On Submit: textarea collapses up with `transform: translateY(-20px); opacity: 0` (200ms ease-out)
- Chat view slides in from below: `transform: translateY(20px); opacity: 0` → resting (250ms ease-out, 50ms delay)

---

### Screen 2 — Chat Interface

**Layout:** Full viewport split into: top nav bar (48px) + scrollable message list + fixed input bar (80px).

**Structure:**
```
┌─────────────────────────────────────────┐
│ [← New] Campus AI              [theme ◑] │  ← ChatHeader (48px)
├─────────────────────────────────────────┤
│                                          │
│   ┌──────────────────────────────────┐  │
│   │ 📎 marketing-syllabus-2025.pdf   │  │  ← user message bubble (right)
│   └──────────────────────────────────┘  │
│                                          │
│  ●●● (typing indicator)                  │  ← AI typing
│                                          │
│  I found 8 modules in your syllabus.     │  ← AI message (left)
│  Which one would you like to explore?    │
│                                          │
│  ┌──────┐ ┌──────────────────────────┐  │
│  │ 01   │ │ Prompt Engineering       │  │  ← ModuleCards
│  │      │ │ Sem 1 · 12 hrs           │  │
│  └──────┘ └──────────────────────────┘  │
│  ... (more module cards)                 │
│                                          │
├─────────────────────────────────────────┤
│  ┌────────────────────────────────────┐  │
│  │ Message…                    [📎][↑]│  │  ← ChatInput (fixed bottom)
│  └────────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

**Chat message flow:**

```
Step 1 — Syllabus submitted
  USER: "📎 [filename]"  OR  first 80 chars of pasted text + "…"
  TYPING: 800ms delay
  AI: "I've parsed your syllabus and found [N] modules. Which one would you like to explore?"
  AI: <ModuleCards list>

Step 2 — Module selected (user taps a card)
  USER: "[Module Title]"
  TYPING: 600ms delay
  AI: "**[Module Title]**\nSemester [N] · [H] hours\nTopics: [t1], [t2], [t3]…\n\nWhat would you like to create?"
  AI: <ArtifactCards: Notes | PPTX | Workbook>

Step 3 — Artifact selected (user taps a card)
  USER: "Notes" / "PPTX" / "Workbook"
  TYPING: 400ms delay
  AI: "Generating your [artifact]… this usually takes 1–2 minutes."
  AI: <GeneratingMessage pulsing loader>
  → Transition to Screen 3 for PPTX (DesignLab)
  → Stream content in-chat for Notes/Workbook, then show download actions
```

---

### Screen 3 — Generation View

**For PPTX:** Smooth animated transition. Chat slides out left (translateX -30px, opacity 0, 250ms). DesignLab slides in from right (translateX +30px → 0, opacity 0 → 1, 300ms). A slim navigation bar stays at top: `[← Back to chat]  Campus AI  [New module]`.

**For Notes / Workbook:** Stays within the chat view. The streaming text appears as an expanding AI bubble with live word counter. When streaming is done, action buttons appear inline below the bubble: `[Copy] [Download PDF] [Edit]`.

---

## 4. Component Tree

```
app/
  page.tsx                          MODIFY — becomes ChatOrchestrator root
  layout.tsx                        MODIFY — add dark mode class, font preload
  globals.css                       MODIFY — add --chat-* tokens, remove AWS vars

components/
  chat/                             CREATE (new directory)
    ChatLanding.tsx                 CREATE — Screen 1 full-page landing
    ChatInterface.tsx               CREATE — Screen 2 chat message list + input
    ChatHeader.tsx                  CREATE — top nav bar (48px)
    ChatInput.tsx                   CREATE — textarea + send + upload button
    MessageBubble.tsx               CREATE — user and assistant bubble variants
    TypingIndicator.tsx             CREATE — pulsing 3-dot animation
    ModuleCards.tsx                 CREATE — list of tappable module option cards
    ArtifactCards.tsx               CREATE — Notes / PPTX / Workbook selection cards
    GeneratingMessage.tsx           CREATE — pulsing loader + status text in chat
    FilePill.tsx                    CREATE — file attachment pill shown in input area
    StreamingBubble.tsx             CREATE — AI bubble with live streaming text
    InlineActions.tsx               CREATE — Copy / Download PDF / Edit action row

  DesignLab.tsx                     MODIFY — add className prop for wrapper styling
  Header.tsx                        ARCHIVE (no longer rendered in new flow)
  StepIndicator.tsx                 ARCHIVE (wizard step indicator — replaced)
  SyllabusStep.tsx                  ARCHIVE (logic absorbed into ChatLanding)
  ModuleStep.tsx                    ARCHIVE (logic absorbed into ChatInterface)
  ArtifactStep.tsx                  ARCHIVE (logic absorbed into ChatInterface)
  GenerateStep.tsx                  ARCHIVE (logic absorbed into StreamingBubble)

lib/
  types.ts                          MODIFY — add ChatMessage, ChatStep types
  chat-state.ts                     CREATE — chat step state machine helpers
```

*"ARCHIVE" = keep file, just no longer imported from page.tsx. Do not delete yet.*

---

## 5. State Machine

### ChatStep type (replaces WizardStep)

```typescript
// lib/types.ts additions
export type ChatStep =
  | 'landing'          // Screen 1: syllabus input
  | 'parsing'          // API call to /api/parse in-flight
  | 'selecting-module' // modules list shown in chat
  | 'selecting-artifact' // module chosen, artifact cards shown
  | 'generating-notes' // streaming notes/workbook
  | 'generating-done'  // notes/workbook done (actions visible)
  | 'design-lab';      // PPTX → DesignLab full view

export type ChatMessageRole = 'user' | 'assistant';

export type ChatMessageType =
  | 'text'
  | 'file-attachment'
  | 'typing'
  | 'module-list'
  | 'artifact-options'
  | 'generating'
  | 'stream'
  | 'stream-done';

export interface ChatMessage {
  id: string;
  role: ChatMessageRole;
  type: ChatMessageType;
  content?: string;       // text content
  fileName?: string;      // for file-attachment type
  modules?: ParsedModule[];   // for module-list type
  artifactType?: ArtifactType; // for artifact-options / generating types
  streamContent?: string; // for stream type (live)
  wordCount?: number;     // for stream type
}
```

### Root state (page.tsx)

```typescript
// app/page.tsx state
const [chatStep, setChatStep] = useState<ChatStep>('landing');
const [messages, setMessages] = useState<ChatMessage[]>([]);
const [modules, setModules] = useState<ParsedModule[]>([]);
const [selectedModule, setSelectedModule] = useState<ParsedModule | null>(null);
const [artifactType, setArtifactType] = useState<ArtifactType | null>(null);
const [darkMode, setDarkMode] = useState(false);
```

### Transition graph

```
landing
  → [user submits syllabus or file]
  → parsing
    → [/api/parse resolves]
    → selecting-module
      → [user taps a module card]
      → selecting-artifact
        → [user taps Notes or Workbook]
        → generating-notes
          → [stream ends]
          → generating-done
        → [user taps PPTX]
        → design-lab

Any step → landing  (when user clicks "New" or "Restart")
```

---

## 6. Animation Specs

| Transition | Element | From | To | Duration | Easing |
|------------|---------|------|----|----------|--------|
| Landing → Chat | Landing | opacity:1, y:0 | opacity:0, y:-20px | 200ms | ease-out |
| Landing → Chat | Chat | opacity:0, y:20px | opacity:1, y:0 | 250ms delay:50ms | ease-out |
| Chat → DesignLab | Chat | opacity:1, x:0 | opacity:0, x:-30px | 250ms | ease-in-out |
| Chat → DesignLab | DesignLab | opacity:0, x:30px | opacity:1, x:0 | 300ms delay:100ms | ease-out |
| DesignLab → Chat | DesignLab | opacity:1, x:0 | opacity:0, x:30px | 200ms | ease-in |
| DesignLab → Chat | Chat | opacity:0, x:-30px | opacity:1, x:0 | 250ms delay:50ms | ease-out |
| New message | MessageBubble | opacity:0, y:8px | opacity:1, y:0 | 200ms | ease-out |
| Typing indicator | TypingIndicator | opacity:0 | opacity:1 | 150ms | ease |
| Dot pulse | Each dot | scale:1 | scale:1.4 | 600ms stagger:200ms | ease-in-out loop |
| Option card hover | ModuleCard / ArtifactCard | shadow-card | shadow-md, y:-2px | 150ms | ease |
| Send button enable | SendButton | opacity:0.4 | opacity:1, scale:1 | 100ms | ease |

All transitions use CSS classes + Tailwind `transition-*` utilities. No external animation library needed. Use `@keyframes` in globals.css for the typing dot pulse.

---

## 7. File Structure — New Files to Create

```
components/chat/
  ChatLanding.tsx       ~120 lines
  ChatInterface.tsx     ~200 lines
  ChatHeader.tsx        ~50 lines
  ChatInput.tsx         ~110 lines
  MessageBubble.tsx     ~80 lines
  TypingIndicator.tsx   ~30 lines
  ModuleCards.tsx       ~90 lines
  ArtifactCards.tsx     ~70 lines
  GeneratingMessage.tsx ~40 lines
  FilePill.tsx          ~30 lines
  StreamingBubble.tsx   ~80 lines
  InlineActions.tsx     ~60 lines

lib/
  chat-state.ts         ~60 lines  (pure helper functions, no React)
```

### Files to modify

| File | Change |
|------|--------|
| `app/page.tsx` | Replace wizard state with ChatStep state machine, render ChatLanding / ChatInterface / DesignLab based on chatStep |
| `app/layout.tsx` | Add `dark` class support on `<html>`, add font preload hint |
| `app/globals.css` | Add `--chat-*` CSS variables, `@keyframes` for typing dots, dark mode token overrides |
| `lib/types.ts` | Add ChatStep, ChatMessage, ChatMessageRole, ChatMessageType types |

---

## 8. API Integration Notes

| Chat Step | API Call | Trigger | Handler |
|-----------|---------|---------|---------|
| `parsing` | `POST /api/parse` (FormData) | User submits syllabus | In ChatLanding: same logic as current SyllabusStep.handleExtract |
| `generating-notes` | `POST /api/generate` (JSON, streaming) | User selects Notes or Workbook | In StreamingBubble: same logic as current GenerateStep useEffect stream |
| `design-lab` | `POST /api/design-lab` (JSON, SSE) | User selects PPTX | In DesignLab.handleGenerate — unchanged, no modifications to DesignLab internals |
| Slide regenerate | `POST /api/design-lab/regenerate` | Edit panel | DesignLab — unchanged |
| Export PPTX | `POST /api/design-lab/export-pptx` | Download button | DesignLab — unchanged |

The parse and generate calls move into the new chat components. DesignLab retains all its own API calls internally.

---

## 9. Key Implementation Notes

### ChatLanding
- No tabs (paste / upload). Instead: single unified input that accepts both text typing AND file drop/click. File and text are mutually exclusive (selecting a file clears text, typing clears file).
- Upload triggers via hidden `<input ref>` + 📎 button click.
- FilePill renders above the textarea row when a file is selected.

### ChatInterface message rendering
- Messages array is append-only. Each append triggers scroll-to-bottom on the MessageList container.
- TypingIndicator is a special pseudo-message rendered when `chatStep === 'parsing'` or during deliberate typing delays (use `setTimeout` before appending AI messages).
- ModuleCards inside a message bubble: tapping a card immediately adds a user message bubble (`type: 'text', content: module.title`) then triggers the next AI response sequence.
- ArtifactCards same pattern: tap → user bubble → AI response.

### ChatInput in chat mode
- Textarea is single-line style (no vertical resize) during chat. The large multi-line is only for the landing screen.
- Send button submits free-text user messages (for potential future free-text input), but in the current flow, selection happens via option cards, so the input is mostly decorative during module/artifact steps.

### DesignLab integration
- DesignLab receives `module`, `onBack`, `onRestart` — same as today.
- `onBack` now sets chatStep back to `'selecting-artifact'` (restoring chat view at the artifact options step).
- `onRestart` resets to `'landing'` and clears messages.
- The DesignLab component itself does NOT change visually — but the container around it gets the chat nav bar (ChatHeader) at top showing "← Back to chat" and "New module →".

### Dark mode
- `darkMode` state in page.tsx drives `className={darkMode ? 'dark' : ''}` on the root `<div>`.
- CSS variables defined under `.dark` selector in globals.css.
- ChatHeader has a toggle button (◑ icon) that flips `darkMode`.
- No Tailwind `dark:` classes needed — all via CSS variables.

---

## 10. Typography & Visual Details

- **Headings in chat**: Use `font-weight: 600`, `font-size: 15px`. AI message titles (module name) can be `font-weight: 700`.
- **User bubbles**: Orange background (`--bg-user-bubble`), white text, `border-radius: var(--chat-bubble-radius-user)`, `max-width: 80%`, `align-self: flex-end`.
- **AI bubbles**: White/surface background, dark text, `border-radius: var(--chat-bubble-radius-ai)`, `max-width: 85%`, `align-self: flex-start`. Subtle `box-shadow: var(--shadow-card)`.
- **Module cards**: Full-width inside AI bubble. Left colored stripe (4px, accent color), module number badge, title, hours. Tappable with hover state.
- **Artifact cards**: 3-column grid (or vertical stack on mobile). Icon (🗒 📊 📋) + label + short description. Border becomes orange on hover/selected.
- **Input bar**: Pill-shaped (border-radius 24px), background `--bg-input`, no visible border in light mode, subtle ring on focus.
- **Send button**: Circle (40px × 40px), orange, arrow-up icon (↑). Disabled = opacity 40%, no cursor-pointer.
