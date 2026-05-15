# Deployment Guide — Whose Home

Two paths: **autonomous (Claude Code does it)** or **manual (you do it)**. Both end with a `*.vercel.app` URL you can hand to Greg.

---

## Path A — Autonomous via Claude Code

1. `cd` into this folder in a terminal.
2. Run `claude`.
3. Open `CLAUDE_CODE_PROMPT.md`, copy the whole "Copy-paste this into Claude Code" block.
4. Paste it as the first message.
5. Walk away. The summary at the end has the live URL.

---

## Path B — Manual (10–15 minutes)

### 1. Verify locally

```bash
npm install
npm run dev
# open http://localhost:3000
```

Click around — landing → landlord/dashboard → tenant/home. Verify the floating "Send feedback" pill works (no Supabase needed; it'll log to the terminal where `npm run dev` is running).

### 2. Push to GitHub

```bash
git init -b main
git add -A
git commit -m "Initial commit — Whose Home prototype"

# Either:
gh repo create whose-home --public --source=. --remote=origin --push

# …or, if you don't use the gh CLI:
# 1. Create the repo on github.com manually (Public, no README/license/gitignore)
# 2. Then:
git remote add origin git@github.com:<your-username>/whose-home.git
git push -u origin main
```

### 3. Deploy to Vercel

#### Option 1 — CLI (recommended)

```bash
npm i -g vercel              # if you don't have it
vercel login                 # one-time
vercel --yes                 # first deploy + project link (preview)
vercel --prod --yes          # promote to production
```

#### Option 2 — Dashboard

1. Go to **vercel.com/new**.
2. Import the `whose-home` repo from GitHub.
3. Framework preset auto-detects as **Next.js**. Leave all build settings default.
4. Click **Deploy**.

Either way you get a `https://whose-home-<hash>.vercel.app` URL within ~60 seconds.

### 4. Wire up Supabase (optional, but recommended for live feedback collection)

The feedback button works without Supabase, but submissions only land in the server console. To persist them:

1. Create a Supabase project at **supabase.com/dashboard**.
2. In **Project Settings → API**, copy the **Project URL** and the **anon public** key.
3. Run the migration: open the SQL editor, paste the contents of `supabase/migrations/20260515000000_feedback.sql`, and run it. (Or `supabase db push` if you've linked the CLI.)
4. Add the keys to Vercel:

   ```bash
   vercel env add NEXT_PUBLIC_SUPABASE_URL      production
   vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
   vercel --prod --yes      # redeploy
   ```

   Or via the Vercel dashboard: **Project → Settings → Environment Variables**.

5. Visit `https://<your-vercel-url>/feedback` to confirm submissions are landing.

---

## Troubleshooting

**`gh repo create` says the name is taken.**
Pick a different one — `whose-home-prototype`, `whose-home-greg`, `whose-home-2026`, etc.

**`vercel --yes` asks for the scope.**
Pick your personal account (whatever email is in `vercel whoami`). The `--yes` flag will accept defaults for everything else.

**Build fails on Vercel but works locally.**
Run `npm run build` locally to reproduce. Most common cause: missing env var that you have in `.env.local` but didn't add to Vercel. Add it via `vercel env add` and redeploy.

**The `/feedback` admin page shows "Supabase not configured".**
Expected behaviour when env vars aren't set. Either set them (above), or leave it — the rest of the app still works.

**The feedback button doesn't appear on `/feedback`.**
Intentional — we hide the floating pill on the admin page so you can read submissions without being prompted to leave more.

**Greg sends feedback but you don't see it.**
Check the Vercel server logs (`vercel logs <url>`). If you see the payload there, Supabase isn't wired up. If you don't see anything, check the browser network tab on the deployed site for the `/api/feedback` POST.
