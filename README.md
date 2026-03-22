# Sabaragamuwa Agriculture Web Portal

Web portal for the **Provincial Ministry of Land, Irrigation, Agriculture, Animal Production, and Fisheries** (Sabaragamuwa Province, Sri Lanka). Public content and admin tools are backed by **Firebase** (Firestore, Storage, Authentication).

## Stack

- Vite, TypeScript, React
- shadcn-ui, Tailwind CSS
- Firebase (Firestore, Storage, Auth)
- Firebase Hosting for production

## Run locally

```sh
git clone <YOUR_REPO_URL>
cd spcagriculture-web-portal
npm install
```

Create a `.env` file in the project root with your Firebase `VITE_*` variables (see `src/integrations/firebase/client.ts`).

| Command | Description |
|--------|-------------|
| `npm run dev` | Dev server with hot reload (port 8080). |
| `npm run build` | Production build output in `dist/`. |
| `npm run preview` | Serve the production build locally before deploy. |

## Deploy (Firebase Hosting)

**One-time:** `npx firebase login` → `npx firebase use --add` (same project as `VITE_FIREBASE_PROJECT_ID`). Use **`.env.production`** for production `VITE_*` values (same keys as `.env`).

**Publish updates:**

```sh
npm run deploy:hosting
```

Commits and pushes do not update the live site; run the command above when you want to go live.

**Hosting + Firestore + Storage rules:**

```sh
npm run deploy
```

If `firebase` is not on your PATH, use `npx firebase ...` or install globally: `npm install -g firebase-tools`.

## Custom domain

Add and verify your domain in [Firebase Console](https://console.firebase.google.com/) → **Hosting** → **Add custom domain**, then update DNS as shown there.
