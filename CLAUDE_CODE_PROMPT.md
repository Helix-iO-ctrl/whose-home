# Claude Code Handoff Prompt — Whose Home Prototype Deploy

> **How to use:** From a terminal in the project root (the folder containing this file), run `claude` and paste the prompt below. Claude Code will install, verify, push to GitHub, and deploy to Vercel autonomously.

---

## Copy-paste this into Claude Code:

I need you to deploy this Next.js prototype to Vercel under Hayden's account and report back the live URL. Hayden is driving and won't be available to respond — work autonomously, make sensible choices, and keep going until you have a working `*.vercel.app` URL or have hit something genuinely blocking.

**Project:** Whose Home — a click-through prototype of a property-management app for Greg (Hayden's neighbor / pilot client). Next.js 15 App Router, TypeScript, Tailwind, Supabase for a feedback log. Built fresh — no existing repo, no existing Vercel project.

**Goal:**

1. Install dependencies and verify the build works locally.
2. Initialize git, create a fresh public GitHub repo under Hayden's account, push.
3. Deploy to Vercel and get a `*.vercel.app` production URL.
4. Print a short summary at the end with the GitHub URL, the Vercel URL, and any caveats.

**Working autonomously — apply judgment, don't ask questions:**

- If the GitHub repo name `whose-home` is taken on Hayden's account, fall back to `whose-home-prototype` then `whose-home-greg`, then suffix with the date.
- If `gh` or `vercel` CLI isn't installed, install them (`brew install gh` / `npm i -g vercel`). If install fails, fall back to git remote add + manual `git push` and skip Vercel — but tell Hayden in the summary so he can finish from the dashboard.
- The app is designed to deploy *without* Supabase env vars set — feedback just won't persist until they're configured. Don't block on that. Mention it in the summary.
- The README, the brand guide rationale, and a palette preview are inside this folder. Read them only if you need context for an error you're debugging — otherwise just focus on shipping.

**Step-by-step:**

### 0. Pre-flight

```bash
node -v               # need 18.18+ ; ideally 20 or 22
npm -v
gh --version          # if missing → brew install gh
gh auth status        # if not authed → gh auth login (web flow)
vercel --version      # if missing → npm i -g vercel
vercel whoami         # if not authed → vercel login (email flow)
git config user.name && git config user.email   # set globally if missing
```

### 1. Install + verify

```bash
npm install
npm run typecheck     # tsc --noEmit
npm run build         # full Next build — catches any runtime issues that typecheck misses
```

If the build fails, fix the offending file (the error will name it). Common categories to check:
- React Server Component using a client-only hook → add `"use client"` at the top.
- Missing import → add it from `lucide-react` or `@/components/ui/...`.
- Async params type in `app/landlord/maintenance/[id]/page.tsx` should already be `Promise<{ id: string }>`.

After fix, re-run `npm run build` until it succeeds.

### 2. Git + GitHub

```bash
git init -b main
git add -A
git commit -m "Initial commit — Whose Home prototype (Option C, green & gold)"

# Create the repo and push in one shot. --public so Vercel can pull it without auth gymnastics.
gh repo create whose-home --public --source=. --remote=origin --push --description "Whose Home — click-through prototype for Greg"
```

If the name `whose-home` already exists on the account, retry with `whose-home-prototype`, then `whose-home-greg`, then `whose-home-$(date +%Y%m%d)`. Capture the final repo URL via `gh repo view --json url -q .url`.

### 3. Vercel deploy

```bash
# First deploy — links the local folder to a new Vercel project
vercel --yes                                       # creates project, runs preview deploy
vercel --prod --yes                                # promotes to production

# Capture the prod URL
PROD_URL=$(vercel ls --prod 2>/dev/null | awk 'NR>1 {print $2; exit}')
echo "Production URL: $PROD_URL"
```

If `vercel --yes` asks anything interactive that the `--yes` flag doesn't cover, answer with the project defaults: scope = Hayden's personal account, project name = `whose-home` (or whatever GitHub got), framework auto-detected as Next.js, no overrides.

### 4. (Optional) Supabase env vars

Don't ask Hayden for these. If `~/.config/supabase/...` or some env file in his shell already exposes `SUPABASE_URL` / `SUPABASE_ANON_KEY` for a project named anything resembling "whose home", set them on Vercel:

```bash
echo "$SUPABASE_URL"     | vercel env add NEXT_PUBLIC_SUPABASE_URL      production
echo "$SUPABASE_ANON_KEY"| vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel --prod --yes      # redeploy so the env vars take effect
```

If you can't find them, **skip this step**. The app degrades gracefully — feedback logs to the server console and the `/feedback` admin page tells Hayden to wire up Supabase. He can do that from the Vercel dashboard later.

### 5. Smoke test

```bash
curl -sI "$PROD_URL" | head -1                         # expect HTTP/2 200
curl -s  "$PROD_URL" | grep -o "Whose home" | head -1  # expect "Whose home"
```

If 200 + the brand string is in the HTML, you're done.

### 6. Final summary

Print exactly this format (replace bracketed values with what you actually got):

```
=== Whose Home — Deploy Summary ===
GitHub:        https://github.com/<user>/<repo>
Vercel URL:    https://<project>.vercel.app
Supabase:      [configured | not configured — feedback won't persist]
Build:         passed
Smoke test:    HTTP <code> + brand string detected
Caveats:       <one or two lines, or "none">
====================================
```

If anything fails along the way, get as far as you can and then print the same summary with the failed step called out and a recommended next action for Hayden to take when he's back at his laptop.

---

## What's in this folder

- `src/` — the Next.js app (App Router)
- `supabase/migrations/20260515000000_feedback.sql` — the table + RLS policies for the feedback log
- `README.md` — full project documentation (routes, design tokens, structure)
- `DEPLOYMENT.md` — human-readable deployment notes + troubleshooting
- `CLAUDE_CODE_PROMPT.md` — this file
