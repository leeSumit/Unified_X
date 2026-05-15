# Dependency Audit — bba-ai-app
**Wave:** stress-test-v1 | **Worker:** dep-audit | **Date:** 2026-05-16

---

## 1. Vulnerability Summary (`npm audit`)

| Severity | Count | Package | Advisory |
|----------|-------|---------|----------|
| Moderate | 2 | `postcss` < 8.5.10 (via `next`) | [GHSA-qx2v-qp2m-jg93](https://github.com/advisories/GHSA-qx2v-qp2m-jg93) — XSS via unescaped `</style>` in CSS Stringify |

**Details:**
- Vulnerable path: `next → postcss` (affects Next.js 9.3.4-canary.0 through 16.3.0-canary.5)
- `npm audit fix --force` would downgrade to `next@9.3.3` — a **breaking change**, do not run blindly.
- **Recommended fix:** Upgrade `next` to 16.x (see Outdated section) which ships a patched `postcss`.

---

## 2. Outdated Packages

| Package | Current (resolved) | Pinned in pkg.json | Latest | Gap |
|---------|--------------------|--------------------|--------|-----|
| `next` | 15.5.18 | `^15.1.0` | **16.2.6** | Major |
| `react` | 18.3.1 | `^18.3.1` | **19.2.6** | Major |
| `react-dom` | 18.3.1 | `^18.3.1` | **19.2.6** | Major |
| `tailwindcss` | 3.4.19 | (3.x) | **4.3.0** | Major |
| `typescript` | 5.9.3 | (5.x) | **6.0.3** | Major |
| `marked` | 13.0.3 | (13.x) | **18.0.3** | Major (5 majors behind) |
| `@anthropic-ai/sdk` | 0.95.2 | (0.x) | **0.96.0** | Patch |
| `@types/node` | 22.19.19 | (22.x) | **25.8.0** | Major |
| `@types/react` | 18.3.28 | (18.x) | **19.2.14** | Major (tied to react v18) |
| `@types/react-dom` | 18.3.7 | (18.x) | **19.2.3** | Major (tied to react v18) |
| `pdf-parse` | 1.1.4 | (1.x) | **2.4.5** | Minor |

**Upgrade priority:**
1. **`next` → 16.x** — resolves the moderate postcss CVE and is the most impactful single upgrade.
2. **`@anthropic-ai/sdk` → 0.96.0** — safe patch bump, pick up immediately.
3. **`react`/`react-dom` → 19.x** — major; requires testing but React 19 is stable.
4. **`marked` → 18.x** — 5 major versions behind; likely has API changes; schedule with care.
5. **`tailwindcss` → 4.x** / **`typescript` → 6.x** — major breaking changes; plan separately.
6. **`pdf-parse` → 2.x** — minor, test PDF parsing flows after upgrade.

---

## 3. Key Versions in Use

| Key | Version |
|-----|---------|
| `next` (pinned) | `^15.1.0` → resolved `15.5.18` |
| `react` (pinned) | `^18.3.1` → resolved `18.3.1` |
| `@anthropic-ai/sdk` | `0.95.2` |
| `tailwindcss` | `3.4.19` |
| `typescript` | `5.9.3` |

---

## 4. Environment File Safety

**`.gitignore` coverage:**
```
.env.local
.env.*.local
```

**`.env` files found in git history:** None

### Verdict: ⚠️ PARTIAL — gaps exist

| Pattern | Covered? |
|---------|----------|
| `.env.local` | ✅ Covered |
| `.env.development.local`, `.env.production.local`, etc. | ✅ Covered |
| `.env` (bare, root) | ❌ NOT covered |
| `.env.production` | ❌ NOT covered |
| `.env.development` | ❌ NOT covered |
| `.env.staging` | ❌ NOT covered |

**No `.env` files were found in git history** — no leak has occurred so far. However, if a developer creates a bare `.env` or `.env.production` file, it would be committed.

**Recommended `.gitignore` addition:**
```
# Add these lines to cover all .env variants
.env
.env.*
!.env.example
!.env.template
```

---

## Summary

| Area | Status | Action |
|------|--------|--------|
| CVEs | ⚠️ 2 moderate | Upgrade `next` to 16.x |
| Outdated deps | ⚠️ 10 packages behind | Prioritized list above |
| Next.js version | ⚠️ 15.5.18 (16.x available) | Upgrade to fix CVE |
| React version | ℹ️ 18.3.1 (19.x available) | Plan React 19 migration |
| .env in git history | ✅ None found | No leak |
| .gitignore .env coverage | ⚠️ Partial | Add `.env` and `.env.*` rules |
