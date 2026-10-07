# Charity Z — NGO Website

Full-stack website for Charity Z Ghana ([www.charityz.org](https://www.charityz.org)): donations (Paystack), volunteer and membership sign-up, projects, events, newsletter, an AI assistant, and an admin dashboard.

## Tech stack

- **Frontend:** Vite, React 18, TypeScript, Tailwind CSS, shadcn/ui
- **Backend:** Supabase (Postgres + Row Level Security, Auth, Storage, Edge Functions)
- **Payments:** Paystack (cards and mobile money, GHS)
- **Email:** Resend
- **AI chatbot:** Claude (Anthropic API), called from the `ai-chatbot` Edge Function
- **Hosting:** Hostinger (static build from GitHub, auto-deploy on push to `main`)

## Local development

Requires Node.js 20+.

```sh
npm install
cp .env.example .env   # then fill in your Supabase URL and anon key
npm run dev            # http://localhost:8080
```

## Environment variables

Frontend (set in `.env` locally and in Hostinger's environment variables):

| Variable | Where to find it |
| --- | --- |
| `VITE_SUPABASE_URL` | Supabase > Project Settings > API > Project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase > Project Settings > API > anon / publishable key |

Edge Function secrets (set in Supabase > Edge Functions > Secrets, never in the frontend):

| Secret | Used by |
| --- | --- |
| `PAYSTACK_PUBLIC_KEY`, `PAYSTACK_SECRET_KEY` | `create-donation`, `verify-donation`, `paystack-webhook` |
| `RESEND_API_KEY` | `send-contact-email`, `send-newsletter` |
| `ANTHROPIC_API_KEY` | `ai-chatbot` |

`SUPABASE_URL`, `SUPABASE_ANON_KEY` and `SUPABASE_SERVICE_ROLE_KEY` are provided to Edge Functions automatically.

## Database setup (new Supabase project)

All schema lives in `supabase/migrations`. With the [Supabase CLI](https://supabase.com/docs/guides/cli):

```sh
supabase login
supabase link --project-ref <your-project-ref>
supabase db push                 # creates all tables, policies, functions and the storage bucket
supabase functions deploy        # deploys every Edge Function in supabase/functions
supabase secrets set PAYSTACK_PUBLIC_KEY=... PAYSTACK_SECRET_KEY=... RESEND_API_KEY=... ANTHROPIC_API_KEY=...
```

Then, in the Supabase dashboard:

1. **Authentication > URL Configuration:** set Site URL to `https://www.charityz.org`, and add `https://www.charityz.org/**`, `https://charityz.org/**` and `http://localhost:8080/**` to Redirect URLs.
2. **Make yourself an admin:** sign up on the site, then run in the SQL editor:
   ```sql
   insert into public.user_roles (user_id, role)
   select id, 'admin' from auth.users where email = 'you@example.com';
   ```

## Deploying to Hostinger

In hPanel, create a website from this GitHub repository with these build settings:

| Setting | Value |
| --- | --- |
| Framework | Vite |
| Branch | `main` |
| Build command | `npm run build` |
| Output directory | `dist` |
| Node version | 20.x or newer |
| Environment variables | `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` |

`public/.htaccess` is copied into the build so that deep links such as `/projects` or `/admin` load the app instead of returning 404.

## AI chatbot

The `ai-chatbot` Edge Function answers visitors' questions with Claude Haiku 4.5 (`claude-haiku-4-5`, the lowest-cost Claude model). It is public, so it is rate-limited per visitor (20 messages per 10 minutes, keyed by a hash of the IP address) and overall (2,000 messages per day). Both limits are constants at the top of `supabase/functions/ai-chatbot/index.ts`.

## Payments (Paystack)

1. `create-donation` validates the form and stores a **pending** donation, then the browser opens Paystack (card or mobile money).
2. When Paystack reports success, `verify-donation` checks the payment with Paystack's API, confirms the amount and currency match, marks the donation **successful** and issues a receipt.
3. `paystack-webhook` runs the same check when Paystack notifies us, so donations are recorded even if the donor closes the page.

The browser can't write donations or receipts directly; only these functions can.

In the Paystack dashboard (Settings > API Keys & Webhooks), set the webhook URL for both test and live mode to:
`https://<your-project-ref>.supabase.co/functions/v1/paystack-webhook`

**Going live:** replace the test keys with live ones. No code changes are needed:

```sh
supabase secrets set PAYSTACK_PUBLIC_KEY=pk_live_... PAYSTACK_SECRET_KEY=sk_live_...
```
