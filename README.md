# Mixtape — frontend

React + Vite frontend for Mixtape: build a digital mixtape (title, note, songs, a cassette color, and stickers) and share it with a code — no account required.

## Setup

```bash
npm install
cp .env.example .env   # point VITE_API_URL at your backend
npm run dev
```

Requires the `mixtape-backend` API running (defaults to `http://localhost:3000/api`).

## How it works

- **No accounts.** A mixtape is "owned" by whoever holds its **edit code**; a separate **share code** is view-only. Both are shown once, right after creation.
- This browser remembers mixtapes you've created (id + codes) in `localStorage` so they show up under "Your mixtapes" on the home page. Edit links also carry the edit code as a `?code=` query param, so they work from a fresh browser too.
- Cassette colors and stickers are rendered from CSS/SVG keyed off each template's `imageName` (see `src/components/templateArt.js`) since the backend only stores template metadata, not actual image assets. Swap that file out once real artwork exists.

## Pages

- `/` — home, your mixtapes, open-by-share-code
- `/create` — build a new mixtape
- `/mixtapes/:id/created` — codes/links shown once after creation
- `/mixtapes/:id/edit?code=EDIT_CODE` — owner-only editing (full CRUD on songs/stickers/details, delete)
- `/share/:shareCode` — public, view-only mixtape page
