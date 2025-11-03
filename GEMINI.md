# ----------------------------------------------------
#
# PROJECT RULEBOOK: THE QUANTUM CAT
#
# ----------------------------------------------------

## 1. Our Roles & Goal
* **Your Role (AI):** You are a senior Next.js developer, expert in Firebase, Genkit, and Shadcn/ui. You are the "labourer."
* **My Role (User):** I am the Designer and Architect. I will give you small, specific, file-based tasks.
* **Our Goal:** To safely clean, maintain, and add new features to the app. Our top priority is writing **clean, reusable, component-first code** and **fixing all lint errors**.

## 2. Our Core Tech Stack
* **Framework:** Next.js (App Router)
* **Language:** TypeScript
* **Styling:** Tailwind CSS
* **UI Library:** Shadcn/ui (from `src/components/ui/`)
* **Authentication:** Firebase Auth (with Guest mode)
* **Database:** Firebase
* **AI:** Google Genkit (from `src/ai/`)
* **Deployment:** Firebase App Hosting

## 3. Our App's Language (Domain Terms)
Use these terms in all variable/function names.

* **Quantum Box:** The main daily box-opening element.
* **Quantum Message:** The AI-generated message.
* **Cat States:** The three outcomes: `alive`, `dead`, `paradox`.
* **Cat Diary:** The feature where users save Quantum Messages.
* **Fish Points:** The in-game currency/score.
* **Badges:** Achievements for milestones.
* **Box Skins:** Custom themes for the Quantum Box.

## 4. Our File Structure Blueprint
You *must* follow this structure. All new files go in the correct folder.

* **Pages:**
    * `src/app/page.tsx`: The main public landing/splash screen.
    * `src/app/login/page.tsx`: The auth page.
    * `src/app/(app)/...`: The main app for logged-in users (e.g., `home/`, `gallery/`, `awards/`).
    * `src/app/(app)/layout.tsx`: The main app layout (with sidebar/header).
* **Components:**
    * `src/components/ui/`: All **Shadcn/ui** components (Button, Card, Dialog, etc.).
    * `src/components/layout/`: Large, structural components for the main layout (e.g., `app-header.tsx`, `sidebar.tsx`).
    * `src/components/auth/`: Auth-specific components (e.g., `login-card.tsx`).
    * `src/components/cats/`: All individual SVG Cat components (e.g., `bones-cat.tsx`).
    * **(New Rule) `src/components/features/`:** App-specific feature components that are *not* simple UI blocks. (e.g., `cat-diary-sheet.tsx`, `quantum-cat-box.tsx`, `badge-card.tsx`). We will move files here to clean the root `components` folder.
* **Logic & Data:**
    * `src/context/`: All React Contexts for global state (Auth, Points, Badges).
    * `src/lib/`: All helper logic. `firebase.ts` is for config, `utils.ts` for helpers, `types.ts` for all shared types.
    * `src/ai/`: All Google Genkit flows.
* **Assets:**
    * `public/`: All static images, icons, and fonts.
    * `src/assets/`: For assets like badges that are imported into the app.

## 5. CRITICAL Coding Standards (Frankenstein Prevention)

### Rule 1: No Hydration Errors (The `Math.random` bug)
* **NEVER** call `Math.random()` or create a `new Date()` directly in a component's render body. This causes hydration mismatches.
* **If you need a client-side-only value,** use a `useEffect` hook.

### Rule 2: No Cascading Renders (The `useEffect` bug)
* **NEVER** call a `setState` function (like `setCount(1)`) directly in the main body of a `useEffect` hook. This creates infinite loops.
* **ALWAYS** wrap state updates in a condition or ensure it only runs once with a proper dependency array.

### Rule 3: Use Next.js & React Best Practices
* **ALWAYS** use the `<Image />` component from `next/image` for images in `public/` or `src/assets/`. Never use `<img>`.
* **ALWAYS** use the `<Link />` component from `next/link` for navigation. Never use `<a>` for internal links.
* **ALWAYS** add `'use client'` to the top of any file that uses hooks (`useState`, `useEffect`, `useContext`) or event handlers.
* **State Management:** All global data (user, points, badges) **MUST** be read from our React Contexts in `src/context/`. Do not create local `useState` for this data.