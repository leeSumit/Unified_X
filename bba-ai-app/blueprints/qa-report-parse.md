# QA Report — Syllabus Parse Pipeline (Layer 1)

**Date:** 2026-05-16  
**Scope:** End-to-end parse flow: ChatLanding → page.tsx → /api/parse

---

## Check 1 — `route.ts` request body field names

**Status: PASS**

Route handles two content types:

| Content-Type | Field name | Source |
|---|---|---|
| `multipart/form-data` | `file` (File) | `formData.get('file')` |
| `multipart/form-data` | `text` (string) | `formData.get('text')` |
| `application/json` | `text` (string) | `body.text` |

No `syllabus` or `content` field — field names are `file` and `text`.

---

## Check 2 — `route.ts` response shape

**Status: PASS**

Returns `NextResponse.json({ modules })` where `modules: ParsedModule[]`.  
Response key is exactly `modules`.

Early-return conditions that could yield 0 modules:
- `ANTHROPIC_API_KEY` missing → 503 error (no modules key)
- No file or text → 400 error
- Text shorter than 30 chars → 400 error
- AI returns empty/non-array → throws → 500 error (no modules key)

**No code path returns `{ modules: [] }`.** Empty result always surfaces as an error response.

---

## Check 3 — `ChatLanding.tsx` fetch body field alignment

**Status: PASS (N/A — ChatLanding does not fetch)**

`ChatLanding` is a pure UI component. It calls `onSubmit?.(text, file)` and delegates all network logic to the parent (`page.tsx`). It performs no `fetch()` call and has no dependency on route field names.

---

## Check 4 — `ChatLanding.tsx` response reading

**Status: PASS (N/A — ChatLanding does not read response)**

Response handling lives entirely in `page.tsx → handleSyllabusSubmit`. No response reading in `ChatLanding`.

---

## Check 5 — `page.tsx` request field names vs route.ts expectation

**Status: PASS**

`handleSyllabusSubmit` builds a `FormData` and appends:

```ts
if (file) {
  formData.append('file', file);   // matches formData.get('file') in route
} else {
  formData.append('text', text);   // matches formData.get('text') in route
}
fetch('/api/parse', { method: 'POST', body: formData })
// FormData body → browser sets Content-Type: multipart/form-data automatically
```

Field names match exactly. No mismatch.

---

## Check 6 — `page.tsx` response reading

**Status: PASS**

```ts
const data = await res.json();
const parsed: ParsedModule[] = data.modules ?? [];
```

Reads `data.modules` — matches route's `{ modules }` exactly.  
Fallback `?? []` is unreachable in practice (route errors before returning empty modules) but harmless.

---

## Check 7 — `page.tsx` length/empty check that could discard valid modules

**Status: PASS**

After `const parsed = data.modules ?? []`:
- No `if (parsed.length === 0) return` guard
- Calls `setModules(parsed)` and immediately advances to `selecting-module`
- The AI confirmation message shows `parsed.length` count to the user

No valid module array is silently discarded.

---

## Check 8 — TypeScript

**Status: PASS**

```
npx tsc --noEmit
```

Exit code: 0. Zero errors.

---

## Summary

| Check | Status |
|---|---|
| route.ts request field names | PASS |
| route.ts response shape `{ modules }` | PASS |
| ChatLanding fetch field alignment | PASS (N/A) |
| ChatLanding response reading | PASS (N/A) |
| page.tsx → route.ts field name match | PASS |
| page.tsx `data.modules` read | PASS |
| No empty-module discard | PASS |
| TypeScript 0 errors | PASS |

**Overall: ALL PASS — no mismatches found. No fixes required.**
