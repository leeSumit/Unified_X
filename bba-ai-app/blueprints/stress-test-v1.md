# Stress Test & Security Audit — UNAITED (bba-ai-app) v1

**Date:** 2026-05-16  
**Target URL:** https://bba-ai-app.vercel.app  
**Orchestrator:** LEAD (stress-test-v1 wave)

---

## Endpoints Under Test

| Endpoint | Method | Safe to Hammer? | Notes |
|----------|--------|-----------------|-------|
| `/` | GET | Yes | Static landing page |
| `/api/parse` | POST | Yes | No AI calls |
| `/api/generate` | POST | **NO — max 6 total** | Calls Claude API |
| `/api/design-lab` | POST | **NO — max 6 total** | Calls Claude API |

---

## Virtual User (VU) Targets

| Test | Endpoint | VU Target | Duration |
|------|----------|-----------|----------|
| Landing page ramp | `/` | 50 → 200 → 0 | 2 min |
| Rate limit probe | `/api/generate` | 1 VU, 10 iters | One-shot |

---

## Wave Workers

| Role | Assignment | Output File |
|------|-----------|-------------|
| `load-tester` | k6 load tests on landing + rate limit | `blueprints/results/load-test.md` |
| `security` | HTTP headers, CORS, XSS, path traversal, npm audit | `blueprints/results/security.md` |
| `user-simulator` | End-to-end user journey (parse → generate 1 call) | `blueprints/results/user-simulator.md` |
| `dep-audit` | npm audit, outdated packages, env safety | `blueprints/results/dep-audit.md` |

---

## Constraints

- AI endpoints (`/api/generate`, `/api/design-lab`): **≤ 6 total calls across all workers**
- No code changes, no commits, no pushes
- k6 scripts written to `/tmp/` only
- Results written to `blueprints/results/` only
