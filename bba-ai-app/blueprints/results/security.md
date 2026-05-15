# Security Audit Report — bba-ai-app
**Date:** 2026-05-16  
**Worker:** worker-security (wave: stress-test-v1)  
**Target:** https://bba-ai-app.vercel.app/

---

## Results Summary

| # | Check | Result | Notes |
|---|-------|--------|-------|
| 1 | HTTP Security Headers | ⚠️ WARN | HSTS present; CSP, X-Frame-Options, Referrer-Policy, Permissions-Policy missing |
| 2 | CORS policy on API | ✅ PASS | No ACAO headers returned for untrusted origin |
| 3 | Rate limit headers | ⚠️ WARN | Rate limiting implemented but not exposed via X-RateLimit-* headers |
| 4 | XSS probe on parse endpoint | ✅ PASS | Input not reflected; no XSS in response |
| 5 | Path traversal probe | ✅ PASS | 403 returned; Vercel blocks traversal at platform level |
| 6 | Exposed .env / config | ✅ PASS | Both .env and .env.local return 404 |
| 7 | npm audit | ❌ FAIL | 2 moderate vulnerabilities (postcss via Next.js) |
| 8 | Server info leakage | ✅ PASS | Only `server: Vercel` header; no x-powered-by or via |

**Overall score: 5/8 checks passed** (5 PASS, 2 WARN, 1 FAIL)

---

## Detailed Findings

### CHECK 1 — HTTP Security Headers ⚠️ WARN

**Present:**
```
strict-transport-security: max-age=63072000; includeSubDomains; preload
```

**Missing:**
- `x-frame-options` — clickjacking protection absent
- `x-content-type-options: nosniff` — absent on homepage (present on API responses)
- `content-security-policy` — no CSP defined; XSS/injection risk higher
- `referrer-policy` — referrer data sent to third-party links
- `permissions-policy` — browser feature access unrestricted

**Recommendation:** Add security headers via `next.config.js` headers config or Vercel middleware:
```js
// next.config.js
headers: () => [{
  source: '/(.*)',
  headers: [
    { key: 'X-Frame-Options', value: 'DENY' },
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
    { key: 'Content-Security-Policy', value: "default-src 'self'; ..." },
  ]
}]
```

---

### CHECK 2 — CORS policy on API ✅ PASS

```bash
curl -sI -X OPTIONS https://bba-ai-app.vercel.app/api/generate \
  -H "Origin: https://evil.com" \
  -H "Access-Control-Request-Method: POST"
# → (no access-control headers returned)
```

No `Access-Control-Allow-Origin` or `Access-Control-Allow-Methods` returned for untrusted origins. The `/api/generate` endpoint does not allow cross-origin POST from arbitrary domains.

**Note:** The homepage static assets do return `access-control-allow-origin: *` — acceptable for public static content.

---

### CHECK 3 — Rate limit headers ⚠️ WARN

```
HTTP/2 200
cache-control: no-cache
content-type: text/plain; charset=utf-8
```

The generate endpoint accepted the request and began streaming. Rate limiting is present in code (per IP sliding window: generate 5/hr) but the implementation does **not** expose standard `X-RateLimit-Limit`, `X-RateLimit-Remaining`, or `X-RateLimit-Reset` headers in the response.

**Recommendation:** Add rate limit state headers so clients can self-throttle:
```ts
res.headers.set('X-RateLimit-Limit', '5');
res.headers.set('X-RateLimit-Remaining', remaining.toString());
res.headers.set('X-RateLimit-Reset', resetTimestamp.toString());
```

---

### CHECK 4 — XSS probe on parse endpoint ✅ PASS

```bash
curl -s -X POST https://bba-ai-app.vercel.app/api/parse \
  -F 'text=<script>alert(1)</script>'
# → empty / non-reflective response
```

The parse endpoint did not reflect the `<script>` payload back in the response body. No XSS reflected. The endpoint either rejects malformed multipart payloads or sanitizes input before returning.

---

### CHECK 5 — Path traversal probe ✅ PASS

```
curl -si "https://bba-ai-app.vercel.app/api/../../../etc/passwd"
→ HTTP/2 403
```

Vercel's platform-level routing blocks path traversal attempts. No file system access possible via URL manipulation.

---

### CHECK 6 — Exposed .env / config ✅ PASS

```
curl -si "https://bba-ai-app.vercel.app/.env"       → HTTP/2 404
curl -si "https://bba-ai-app.vercel.app/.env.local"  → HTTP/2 404
```

Environment configuration files are not publicly accessible.

---

### CHECK 7 — npm audit ❌ FAIL

```
postcss  <8.5.10
Severity: moderate
PostCSS has XSS via Unescaped </style> in its CSS Stringify Output
Advisory: https://github.com/advisories/GHSA-qx2v-qp2m-jg93

Affected path: next → postcss (next 9.3.4-canary.0 - 16.3.0-canary.5)
2 moderate severity vulnerabilities
```

**Impact:** Build-time XSS in PostCSS CSS stringify — affects server-side CSS processing during build. Risk is moderate, not runtime-exploitable by end users but could affect generated HTML.

**Recommendation:** 
```bash
npm audit fix
```
If `--force` is required (breaks Next.js), pin postcss directly:
```bash
npm install postcss@^8.5.10
```
Check for Next.js version compatibility before upgrading.

---

### CHECK 8 — Server info leakage ✅ PASS

```
server: Vercel
```

Only the platform name is disclosed (standard for Vercel-hosted apps). No `x-powered-by`, no framework version, no `via` proxy header. Minimal attack surface from header enumeration.

---

## Priority Recommendations

| Priority | Action |
|----------|--------|
| HIGH | Add `Content-Security-Policy` header to prevent XSS |
| HIGH | Run `npm audit fix` — address postcss vulnerability |
| MEDIUM | Add `X-Frame-Options: DENY` to prevent clickjacking |
| MEDIUM | Add `Referrer-Policy` and `Permissions-Policy` headers |
| LOW | Expose `X-RateLimit-*` headers on rate-limited endpoints |
| LOW | Ensure `x-content-type-options: nosniff` on all routes (not just API) |
