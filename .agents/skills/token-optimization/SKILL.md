---
name: token-optimization
description: >
  Optimize Claude/Antigravity token usage for this Next.js 16 + Supabase +
  Cloudinary photography portfolio. Reduce unnecessary reads, searches, and
  context while preserving correctness and output quality.
---

# Token Optimization — GVenketram Photography

## Purpose

Get the best result with the **fewest unnecessary tokens** on this specific codebase.

Correctness always comes before token savings.

---

## Project Map (Memorize — Don t Re-Explore)

```
src/
  app/
    admin/page.jsx          <- Monolithic admin panel (~2200 lines). Search before reading.
    api/                    <- Route handlers (portfolio, artworks, upload, storage-stats, settings)
    portfolio/              <- Portfolio gallery pages
    art-gallery/            <- Art gallery + cart + [id] detail page
    about/ contact/ workshop/
  components/
    admin/                  <- AddPortfolioImageModal, EditPortfolioImageModal, AdminSkeletons
    Footer.jsx
  context/CartContext.jsx
  lib/storageGuard.js
  utils/formatTitle.js

.env.local                  <- Supabase URL/key, Cloudinary creds, Admin username/password
next.config.mjs             <- Image domains, /Admin -> /admin rewrite
.agents/skills/             <- Project-local skills
```

**Key facts to reuse — never re-discover:**
- Admin route: `src/app/admin/page.jsx` — credentials via `NEXT_PUBLIC_ADMIN_USERNAME` / `NEXT_PUBLIC_ADMIN_PASSWORD` from `.env.local`
- Auth is **client-side only** (no server session, no NextAuth)
- Storage: Supabase + Cloudinary (25 GB free tier)
- Images served via Cloudinary; Supabase used for metadata + RLS
- Next.js App Router (not Pages Router) — file-based routing under `src/app/`
- `NEXT_PUBLIC_` prefix = exposed in browser bundle

---

## Core Principles

### 1. Read Minimum Required

```
Search -> identify location -> read targeted section -> modify
```

Never:
```
Read entire file -> understand everything -> start working
```

**This project large files:**
| File | Lines | Strategy |
|------|-------|----------|
| `src/app/admin/page.jsx` | ~2200 | grep for symbol, read +-50 lines |
| `src/app/art-gallery/page.jsx` | large | search for hook/handler name |
| `src/app/art-gallery/[id]/page.jsx` | large | search for specific section |

### 2. Reuse Context

Don t re-discover things already established in the conversation:
- File paths already found
- Errors already identified
- Decisions already made
- Credentials location (.env.local, lines 12-15)

### 3. Progressive Disclosure

1. File names / structure
2. grep results
3. Small code sections (+-50 lines)
4. Full files only when truly required

---

## Preferred Workflow

```
UNDERSTAND goal
|
TARGET: which file/symbol?
|
SEARCH with grep (not full read)
|
READ minimum required section
|
IMPLEMENT minimal change
|
VALIDATE only affected area
|
SUMMARIZE: what changed / what remains
```

---

## Project-Specific Optimizations

### Admin Panel (admin/page.jsx)
- Never read the full file unless doing a full audit.
- Always grep for the specific state variable, handler, or JSX section.
- The login gate is at lines ~54-95. UI JSX starts ~line 800+.

### API Routes (src/app/api/)
- Each route is a small standalone file. Reading the full file is fine.
- Check route.js exists before assuming a route works (e.g. /api/settings returned 404).

### Environment Variables
- Source of truth: .env.local
- NEXT_PUBLIC_* = client-exposed (browser bundle)
- CLOUDINARY_API_SECRET, CLOUDINARY_API_KEY = server-only (safe)
- Never hardcode credentials as fallbacks in source files.

### Next.js Config (next.config.mjs)
- Changes here require a dev server restart — always remind the user.
- Current rewrites: /Admin -> /admin
- Route matching is case-sensitive in App Router.

### Supabase
- Use the supabase-ops skill for storage/RLS tasks.
- Anon key is NEXT_PUBLIC_SUPABASE_ANON_KEY — client-side safe by design.

### Media / Images
- Use the media-performance skill for image optimization tasks.
- Cloudinary cloud name: NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME (client-safe).

---

## Debugging Strategy

```
1. Identify exact error (status code, message, file)
2. Locate source (grep, not full read)
3. Inspect relevant section only
4. Form hypothesis
5. Minimal fix
6. Targeted validation (restart server if config changed)
7. Expand only if still failing
```

**Common issues in this project:**
| Symptom | Likely cause | Check |
|---------|-------------|-------|
| 404 on /Admin | Case sensitivity or config not reloaded | Restart dev server |
| 404 on /api/settings | Route file missing | Check src/app/api/settings/route.js exists |
| Admin login fails | Env var not set or server not restarted | Check .env.local |
| Image not loading | Cloudinary domain not in remotePatterns | Check next.config.mjs |
| Hydration mismatch | typeof window branch or Date.now() in client component | Check SSR/client split |

---

## Tool Usage Rules

| Situation | Preferred tool |
|-----------|---------------|
| Find where a function is defined | grep (MatchPerLine, specific file) |
| Find which file uses a variable | grep (file-level, SearchPath = src/) |
| Read a section of admin/page.jsx | view_file with StartLine/EndLine |
| Understand a new route | view_file on that specific route file |
| Check env vars | view_file .env.local (12 lines, cheap) |
| Config changes | view_file next.config.mjs (34 lines, cheap) |

---

## Response Format

Keep responses:
- Concise — what was found, what changed, what remains
- Scannable — use tables and short bullets
- No repetition — don t restate the user request or already-known facts

Token efficiency report: only after large multi-file tasks, never after trivial changes.

---

## Decision Check (Before Any Expensive Operation)

Is this necessary?
Can I make it smaller?
Do I already know this from context?
Can I grep instead of reading the whole file?
Can I validate only the affected area?

If yes, use the cheaper approach.

---

## Final Principle

Never spend tokens on information, tools, explanations, or code that does not improve the result.
