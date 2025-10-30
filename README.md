# BookIt — Experiences & Booking

This repository contains two projects in one workspace:

- `bookit/` — Frontend (Vite + React + TypeScript)
- `bookit-api/` — Backend (Node.js + Express + TypeScript + MySQL)

This README explains how to run locally, seed data, and deploy to cloud providers (Render / Railway / Vercel) so you can provide a live hosted version for review.

---

## Quick overview

- Frontend: located at `bookit/`. Uses Vite. Toggle mock vs API mode with `VITE_USE_MOCKS` in `bookit/.env`.
- Backend: located at `bookit-api/`. TypeScript Node server that exposes REST endpoints:
  - GET /experiences
  - GET /experiences/:id
  - POST /bookings
  - POST /promo/validate

Database: MySQL (local for development or managed DB in cloud deployments).

---

## Local setup (Windows / PowerShell)

Prerequisites:
- Node.js (v18+ recommended)
- npm
- MySQL server (or use a cloud database)
- Git

1. Clone the repo (if not in this workspace yet):

```powershell
# Replace <your-git-url> with your GitHub repo once created
git clone <your-git-url> BookIt_Experiences_Slots
cd BookIt_Experiences_Slots
```

2. Backend setup (bookit-api)

```powershell
cd bookit-api
npm install
# copy env example and edit values
copy .env.example .env
# Edit .env and set DB_* values and PORT (default 3000)
# Example in PowerShell: (change values appropriately)
# (Use an editor) or run: notepad .env

# Create DB schema and seed experiences
npm run migrate
# Then seed experiences (if needed):
node scripts/seed_experiences.js

# Build and run
npm run build
npm start
# or for development with auto-reload
npm run dev
```

3. Frontend setup (bookit)

```powershell
cd ..\bookit
npm install
# If you want to use the real API (not mocks), set in bookit/.env:
# VITE_USE_MOCKS=false
# And set API URL (if different):
# VITE_API_URL=http://localhost:3000

# Run dev server
npm run dev
```

Open the frontend in the browser (Vite usually serves at http://localhost:5173).

---

## Why bookings didn't persist in your previous run

By default this project includes mock data. If `VITE_USE_MOCKS=true` (frontend `.env`), the app uses in-memory mocks and never sends bookings to the backend database. Set `VITE_USE_MOCKS=false` and restart the frontend to use the real API.

Also ensure the backend is running and has correct DB credentials.

---

## Database seeding

We provide `scripts/seed_experiences.js` to seed experiences and slots. Run it from `bookit-api/`:

```powershell
node scripts/seed_experiences.js
```

We also provide `scripts/print_bookings.js` to inspect the `bookings` table.

---

## Deploying to the cloud

Common approach (recommended):
- Backend: Render or Railway (Node + MySQL). Use a managed MySQL add-on or external DB (ClearDB, PlanetScale, Amazon RDS, etc.).
- Frontend: Vercel (deploy the `bookit` folder). Set `VITE_USE_MOCKS=false` and `VITE_API_URL` to your backend URL.

Below are step-by-step guides for Render (backend) and Vercel (frontend). Railway steps are similar.

### A. Create a GitHub repository and push

1. Create a new repository on GitHub (private/public as you prefer).
2. From local workspace root:

```powershell
git init
git add .
git commit -m "Initial commit"
# replace <your-remote-url> with the GitHub repo URL
git remote add origin <your-remote-url>
git push -u origin main
```

### B. Deploy backend to Render (recommended)

1. In Render, create a new Web Service (Connect your GitHub account and select the repository).
2. Choose the `bookit-api` folder as the root (Render allows monorepos): set "Root Directory" to `bookit-api`.
3. Build command: `npm run build`
4. Start command: `npm start`
5. Add environment variables (in Render dashboard -> Environment):
   - `DB_HOST` — database host
   - `DB_USER` — database user
   - `DB_PASSWORD` — database password
   - `DB_NAME` — database name
   - `DB_PORT` — database port (usually 3306)
   - `PORT` — leave empty (Render injects automatically), or set `3000`
6. Add a managed MySQL service in Render or provide connection details of your managed DB (be sure to open DB access to Render IPs or use the DB provider add-on).
7. Deploy. After deployment you'll get a public backend URL (e.g. `https://bookit-api.onrender.com`).

Notes: If you prefer Docker, use the provided `bookit-api/Dockerfile` (included in this repo) and choose the Docker option on Render.

### C. Deploy frontend to Vercel

1. Import your GitHub repo in Vercel.
2. When configuring the project, set the Root Directory to `/bookit`.
3. Set build command: `npm run build` (the `bookit/package.json` build runs `tsc -b && vite build`).
4. Set Output Directory: `dist`
5. Add Environment Variables in Vercel (Project > Settings > Environment Variables):
   - `VITE_USE_MOCKS` = `false`
   - `VITE_API_URL` = `https://your-backend-url` (the Render/hosted backend URL)
6. Deploy. Vercel will return a public URL for your frontend.

### D. Verify the flow

1. Open the frontend URL in a browser.
2. Book an experience. Confirm the Checkout flow posts a booking to your backend.
3. Check the backend logs (Render) and/or execute `node scripts/print_bookings.js` (or connect to the MySQL DB) to verify the booking row exists.

---

## Useful tips and troubleshooting

- Port in use errors: If your local backend fails to start due to `EADDRINUSE`, stop the process using that port or change `PORT` env.
- If the frontend still returns mock responses after setting `VITE_USE_MOCKS=false`, ensure you fully stop and restart the frontend dev server.
- Database datetime errors: ensure you send MySQL-friendly datetime (scripts provided handle that).

---

## Files added to help deployment

- `bookit-api/Dockerfile` — containerizes the backend for Render/Docker-based deployments.

---

## What I can do next (I can perform these if you give permission)

- Create a GitHub repo and push the workspace code.
- Configure Render / Railway for backend, create the managed MySQL DB, and deploy.
- Configure Vercel for frontend and deploy.
- Run a live booking test and return the hosted URLs.

If you'd like me to proceed with any of the above (create repo, deploy, test), tell me which provider(s) you prefer and whether you want the repo public or private. If you want to keep credentials private, I can prepare everything and provide step-by-step commands you can run.

---

## Contact / submission

When ready, provide the GitHub repo link and the frontend/backend hosted URLs. I'll verify the deployment and the booking flow and provide a short report for the reviewer.

