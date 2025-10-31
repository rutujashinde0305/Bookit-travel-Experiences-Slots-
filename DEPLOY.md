Render and Vercel deployment notes
=================================

This repo contains two projects:

- `bookit` — frontend (Vite + React)
- `bookit-api` — backend (Node + TypeScript)

Quick notes for safe deployments (do NOT deploy automatically unless ready):

Render (backend)
- A `render.yaml` manifest is present and configures a Node web service using the `bookit-api` folder as the root.
- If you prefer Docker, set the Render service Root Directory to `bookit-api` so Render finds `bookit-api/Dockerfile`.

Vercel (frontend)
- A `vercel.json` file is present to tell Vercel to use `bookit/package.json` as the build entry and `bookit/dist` as the output.

Before deploying
- Review environment variables (database credentials, Supabase keys, etc.) in the provider dashboard.
- Consider removing committed `node_modules` from the repo and adding/updating `.gitignore` (be careful; large files are already in history).

To prevent accidental deployment
- Do not push new commits if you want to avoid triggering CI/CD.
- If you want me to push and trigger deployments, confirm and I will push and watch the logs.
