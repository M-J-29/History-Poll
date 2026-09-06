# Setup Log

## What this is
A single live poll: "If you could travel back to any time period, which would you pick?"
People vote once, then watch live results update in real time.
This is the **simple v1** — no host controls, no room codes, no lobby. One global poll,
anyone with the link can vote once (enforced client-side via localStorage, not bulletproof —
fine for v1).

## Stack
- Next.js 15 (App Router, TypeScript), Tailwind CSS
- Supabase (Postgres + Realtime), no Supabase Auth
- GitHub repo: https://github.com/M-J-29/History-Poll
- Deploys to Vercel on push to `main`

## Status
- [x] GitHub repo created (with README)
- [x] Supabase project created
- [x] App code written locally: vote page (`app/page.tsx`) + live results page (`app/results/page.tsx`)
- [x] Database setup SQL written (`supabase/setup.sql`)
- [ ] Code pushed to GitHub
- [ ] SQL run in Supabase (creates `poll_options` + `votes` tables)
- [ ] Deployed to Vercel with environment variables
- [ ] End-to-end tested on the live URL

## Values to remember
- Supabase Project URL: `https://zuhtoyqdmbikkmauxmht.supabase.co`
- Supabase publishable key: starts `sb_publishable_LRNrj5zhC77Ytv2gQ6UgeQ...` (safe to expose publicly)
- These two go into Vercel as environment variables:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Notes for picking this back up
- Local machine has no Node.js installed — the app has never been build-tested locally.
  First real test of whether it builds is Vercel's build log after deploy.
- Poll options (the 6 time periods) live in the `poll_options` table in Supabase, not in code —
  edit them anytime via Supabase's Table Editor.
- Future upgrades (not built yet): real host login, room codes / multiple simultaneous polls,
  a proper "closed / final results" state, quiz/scoring mode. See original project spec for
  the fuller multi-room design if we build that later.
