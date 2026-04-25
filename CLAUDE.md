@AGENTS.md

# Resume Roast

AI-powered resume roasting app. Users upload a resume (PDF or image), it gets parsed and sent to GPT-4o, which returns a brutally honest humorous roast with actionable improvements.

## Tech Stack

- **Next.js 16** — App Router, Turbopack
- **TypeScript**
- **Tailwind CSS**
- **OpenAI GPT-4o** — text roast via chat completions, image roast via vision API
- **pdf-parse 1.1.1** — PDF text extraction (pure JS, serverless-safe)
- **mammoth** — DOCX text extraction
- **react-dropzone** — installed but not yet used (drag-drop is native in page.tsx)

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Landing page — upload UI, state machine, renders roast
│   ├── layout.tsx            # Root layout, metadata
│   ├── globals.css           # Tailwind base styles
│   ├── api/roast/route.ts    # POST /api/roast — core server endpoint
│   └── roast/page.tsx        # Placeholder result page (not yet wired up)
├── components/
│   ├── UploadForm.tsx        # Stub (upload logic lives in page.tsx)
│   ├── RoastDisplay.tsx      # Renders roast paragraphs + reset button
│   └── LoadingSpinner.tsx    # Stub
├── lib/
│   ├── types.ts              # RoastRequest, RoastResponse, UploadStatus
│   ├── extractText.ts        # PDF/DOCX buffer → plain text
│   └── roastClient.ts        # OpenAI GPT-4o wrapper (lazy client init)
└── hooks/
    └── useRoast.ts           # Stub state machine hook
```

## Key Implementation Notes

**OpenAI client must be lazy-initialized** (`roastClient.ts`). `new OpenAI()` at module level crashes Vercel builds because env vars aren't available at build time. The `getClient()` pattern defers instantiation to the first actual request.

**pdf-parse must be imported as `pdf-parse/lib/pdf-parse`**, not the top-level `pdf-parse`. The `index.js` entry point contains a `module.parent` guard that fails in newer Node.js, triggering a filesystem read of a test file that doesn't exist in serverless sandboxes.

**pdf-parse must stay at v1.1.1**. v2.x introduced a native binary dependency (`@napi-rs/canvas`) that can't be resolved in Vercel's build sandbox.

**`serverExternalPackages: ["pdf-parse", "mammoth"]`** is set in `next.config.ts` to prevent Next.js from bundling these Node.js-native packages.

**`maxDuration = 60`** is exported from the API route to extend Vercel's default 10s serverless timeout — PDF parsing + GPT-4o can take 15–30s.

## Environment Variables

| Variable | Where |
|---|---|
| `OPENAI_API_KEY` | `.env.local` locally, Vercel Environment Variables in production |

Never commit `.env.local` — it's in `.gitignore` via `.env*`.

## Running Locally

```bash
cd C:\Users\ROHIT\resume-roast
npm run dev       # starts on localhost:3000
npm run build     # production build (run this to catch errors before pushing)
npx tsc --noEmit  # type check only
```

## Deployment

Deployed on Vercel, connected to GitHub repo `rohitanaidu/resume-roaster`. Every push to `main` triggers an automatic redeploy.

After adding or changing environment variables in Vercel, a redeploy is required — push a commit or manually redeploy from the Vercel dashboard.

## Color Scheme

- Background: `#1a1a1a`
- Accent (roast red): `#ff6b6b`
- Text: white / `zinc-400` for secondary
