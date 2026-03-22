# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Add environment variables (Firebase / Vite).
# Create .env with your VITE_* keys (see firebase client config under src/integrations/firebase/).

# Step 5: Start the development server with auto-reloading and an instant preview.
npm run dev
```

### Run locally

| Command | Description |
|--------|-------------|
| `npm install` | Install dependencies (first time or after pulling changes). |
| `npm run dev` | Dev server with hot reload (default: port 8080). |
| `npm run build` | Production build to `dist/`. |
| `npm run preview` | Serve the production build locally to test before deploy. |

Ensure `.env` exists with the same `VITE_*` variables your app needs (see `src/integrations/firebase/client.ts`).

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Deploy to Firebase Hosting

This app uses **Firebase** (Firestore, Storage) and is configured for **Firebase Hosting** (`firebase.json` serves the Vite `dist/` output).

### One-time setup

1. Install dependencies: `npm install`
2. Log in: `npx firebase login`
3. Link the Firebase project: `npx firebase use --add` (pick the project that matches your `VITE_FIREBASE_PROJECT_ID`)
4. For production builds, keep a **`.env.production`** file with the same `VITE_*` variables as `.env` (Vite loads it when you run `npm run build` / deploy scripts)

### Deploy command

From the project root:

```sh
npm run deploy:hosting
```

This runs `vite build` (production mode, uses `.env.production`) then `firebase deploy --only hosting`.

To deploy hosting **and** Firestore + Storage rules:

```sh
npm run deploy
```

If `firebase` is not found on your PATH, always use `npx` (e.g. `npx firebase login`). You can also install the CLI globally: `npm install -g firebase-tools`.

### After you change code

Git commits and pushes **do not** update the live site by themselves. When you want the hosted site to show your latest changes:

```sh
npm run deploy:hosting
```

### Alternative: Lovable publish

You can also open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and use **Share → Publish** if you use that workflow.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
