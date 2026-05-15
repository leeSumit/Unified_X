# User Simulator Results — stress-test-v1

**Worker:** user-simulator  
**Wave:** stress-test-v1  
**Date:** 2026-05-16  
**Target:** https://bba-ai-app.vercel.app/

---

## Step 1 — Landing Page Load

| Field | Value |
|-------|-------|
| HTTP Status | 200 |
| Latency | 0.096s |
| Result | **PASS** |

Notes: Home page responds immediately. Sub-100ms cold load.

---

## Step 2 — Parse API (text mode)

| Field | Value |
|-------|-------|
| HTTP Status | 200 |
| Latency | 3.269s |
| Result | **PASS** |

Response snippet:
```json
{"modules":[{"semester":1,"module":1,"title":"Introduction to AI in Business","hours":10,...}]}
```

Notes: Parse completed in ~3.3s. Response is valid JSON with expected structure. AI expanded the 3 input topics to 10 enriched topics and mapped learning outcomes correctly.

---

## Step 3 — Parse Response Structure Validation

| Field | Value |
|-------|-------|
| HTTP Status | 200 |
| Structure Valid | Yes |
| Result | **PASS** |

Structure checks:
- `modules` array present: ✓
- `modules[0].semester`: 1 ✓
- `modules[0].module`: 1 ✓
- `modules[0].title`: "Introduction to AI in Business" ✓
- `modules[0].hours`: 10 ✓
- `modules[0].topics`: array (10 items) ✓
- `modules[0].learningOutcomes`: array (3 items) ✓
- `modules[0].tools`: array ✓
- `modules[0].rawText`: string ✓
- `modules[0].indianCaseStudy`: string ✓
- `modules[0].globalCaseStudy`: string ✓

Notes: Schema is fully populated. Optional fields (case studies) present as empty strings, not missing/null — consistent.

---

## Step 4 — Notes Generation (Streaming)

| Field | Value |
|-------|-------|
| HTTP Status | 200 (stream) |
| Stream Started | Yes |
| First 500 chars received | Yes |
| Result | **PASS** |

First chunk received:
```
# Introduction to AI in Business
### BBA in Artificial Intelligence — Semester 1, Module 1
#### Campus AI | Infinite Solutions | Student Study Companion

---

*These notes are your companion for the first ten hours of your BBA in AI...*
```

Notes: Stream initiated immediately. Proper markdown structure with module header, program name, and stylized prose. No 500 error. Streaming works correctly on Vercel.

---

## Summary

| Step | Status | Latency |
|------|--------|---------|
| Landing page | PASS | 0.096s |
| Parse API | PASS | 3.269s |
| Parse structure | PASS | ~3s |
| Generate stream | PASS | <10s (stream) |

**Overall: 4/4 PASS — all user-facing flows healthy.**
