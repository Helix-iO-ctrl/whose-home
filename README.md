# Whose Home — Click-Through Prototype

A two-sided property management prototype for small operators. Built for Greg (Whose Home LLC) so he can poke at the experience end-to-end and leave inline feedback as he goes.

## Stack

- **Next.js 15** (App Router) + **TypeScript**
- **Tailwind CSS** with brand-locked design tokens (Option C, recolored to green &amp; gold)
- **shadcn-style** hand-rolled UI primitives
- **lucide-react** icons (no emojis anywhere in the UI)
- **Supabase** for the feedback log (graceful degradation if not configured)
- Hosted on **Vercel**

## Quickstart

```bash
npm install
cp .env.local.example .env.local   # optional — only needed if you want to persist feedback
npm run dev                        # http://localhost:3000
```

The app works without Supabase configured — feedback submissions just log to the server console and the `/feedback` admin page tells you to set up Supabase. Wire it up when ready.

## Routes

| Route | Purpose |
|---|---|
| `/` | Landing — pick a role |
| `/landlord/dashboard` | Greg's portfolio overview |
| `/landlord/properties` | Properties + units |
| `/landlord/maintenance` | Triage queue (grouped) |
| `/landlord/maintenance/[id]` | Request detail with AI triage results + dispatch |
| `/landlord/vendors` | Vendor directory |
| `/landlord/payments` | Rent collection |
| `/landlord/leases` | Lease library |
| `/landlord/messages` | Conversations with tenants |
| `/tenant/home` | James's portal home |
| `/tenant/maintenance` | Tenant's request list |
| `/tenant/maintenance/new` | 4-step AI triage flow |
| `/tenant/payments` | Pay rent + receipts |
| `/tenant/documents` | Lease, addenda, renewal |
| `/tenant/messages` | Chat with Greg |
| `/feedback` | Internal feedback inbox (newest first) |

## Feedback system

Two ways to send feedback:

1. **Floating "Send feedback" pill** — bottom-right on every page. Captures the current route; opens a slide-up panel with a textarea.
2. **Per-module dot** — every distinct module/widget is wrapped in `<Module id="…" label="…">`. Hover it and a small icon appears top-right; click it and the panel pre-targets that module.

Each submission writes a row to `public.feedback`:

```
id, created_at, user_id, page_route, module_id, module_label, body, user_agent, metadata
```

### Database setup

Run `supabase/migrations/20260515000000_feedback.sql` in the Supabase SQL editor (or via `supabase db push`). It creates the table, an index on `created_at`, and permissive RLS policies suitable for a prototype.

## Design tokens

Defined as Tailwind colors in `tailwind.config.ts`:

| Token | Hex | Role |
|---|---|---|
| `spruce` | `#0B1F14` | App background |
| `pine` / `pine-2` | `#10301F` / `#163A26` | Elevated surfaces |
| `forest` | `#14532D` | Primary brand |
| `moss` | `#1E7A45` | Secondary / success |
| `gold` | `#C9A227` | Accent / CTA |
| `gold-2` | `#E8C36A` | Highlight / italic accents |
| `parchment` | `#F7F1E1` | Cream neutral / light surface |
| `ink` | `#0E1A12` | Text on cream/gold |

Typography: **Libre Baskerville** for display + italic accents, **DM Sans** for body and labels.

## Project structure

```
src/
  app/
    layout.tsx                 # Root: fonts, FeedbackProvider, FeedbackButton
    page.tsx                   # Landing
    landlord/                  # Landlord workspace
    tenant/                    # Tenant portal
    feedback/page.tsx          # Internal feedback inbox
    api/feedback/route.ts      # POST/GET feedback (server-side Supabase write)
    globals.css
  components/
    app-shell.tsx              # Sidebar + mobile bottom nav
    owl-mark.tsx               # Brand mark (SVG)
    feedback/
      feedback-provider.tsx    # Context: route, current module, submit handler
      feedback-button.tsx      # Floating pill + slide-up panel
      module.tsx               # <Module> wrapper for per-module feedback
    ui/                        # button, card, chip, input, dialog, stat, section, avatar
  lib/
    data.ts                    # Mock seed data
    supabase.ts                # Client factory (returns null when not configured)
    utils.ts                   # cn(), currency(), date helpers
supabase/
  migrations/
    20260515000000_feedback.sql
```

## What this is not

This is a **click-through prototype**, not the production app. There's no auth, no Stripe, no real Twilio dispatch — those are wired only as visual affordances so Greg can imagine the flow. Everything the brief calls "P0/P1" is represented in some form so Greg can leave feedback on it.
