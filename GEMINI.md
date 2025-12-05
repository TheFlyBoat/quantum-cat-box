## **1. Roles & Goal**

**AI’s Role:**
You are a **senior Next.js developer**, expert in **Firebase**, **Genkit**, and **Shadcn/ui**. You write production-ready, maintainable code.

**User’s Role:**
I am the **designer and no-code product owner**. I provide direction, creative decisions, and design input.

**Shared Goal:**
Safely clean, maintain, and expand the app.
Top priorities:

* **Clean, reusable, component-first code.**
* **Zero lint errors.**
* **Strict adherence to this rulebook.**

---

## **2. Core Tech Stack**

| Area               | Tool                             |
| ------------------ | -------------------------------- |
| **Framework**      | Next.js (App Router)             |
| **Language**       | TypeScript                       |
| **Styling**        | Tailwind CSS                     |
| **UI Library**     | Shadcn/ui (`src/components/ui/`) |
| **Authentication** | Firebase Auth (with Guest Mode)  |
| **Database**       | Firebase Firestore & Storage     |
| **AI Engine**      | Google Genkit (`src/ai/`)        |
| **Deployment**     | Firebase App Hosting             |

---

## **3. App Language (Domain Terms)**

Always use these terms in variables, functions, and UI labels:

* **Quantum Box** → The daily box-opening feature.
* **Quantum Message** → AI-generated message content.
* **Cat States** → `alive`, `dead`, or `paradox`.
* **Cat Diary** → Log of saved Quantum Messages.
* **Fish Points** → In-app score or currency.
* **Badges** → Achievements or rewards.
* **Box Skins** → Custom themes for the Quantum Box.

---

## **4. File Structure Blueprint**

Every file must live in the correct folder. When editing, move misplaced files, update imports, and refactor names accordingly.

Also:

1. Rename variables to match domain terms.
2. Replace hard-coded colors with brand palette tokens.
3. Fix all style issues before commit.

### **Pages**

```
src/app/page.tsx          → Public landing screen
src/app/login/page.tsx    → Login / auth page
src/app/(app)/...         → Main app (home, gallery, awards, etc.)
src/app/(app)/layout.tsx  → Main layout (sidebar + header)
```

### **Components**

```
src/components/ui/         → Shadcn UI components (Button, Card, Dialog, etc.)
src/components/layout/     → Structural layout parts (Header, Sidebar)
src/components/auth/       → Auth components (LoginCard, NicknameDialog)
src/components/cats/       → Individual cat components (bones-cat.tsx, etc.)
src/components/features/   → App feature blocks (QuantumCatBox, CatDiarySheet, BadgeCard)
```

### **Logic & Data**

```
src/context/   → React Contexts (Auth, Points, Badges)
src/lib/       → Utilities & logic (firebase.ts, utils.ts, types.ts)
src/ai/        → Google Genkit flows and AI logic
```

### **Assets**

```
public/        → Static files (images, icons, fonts)
src/assets/    → Imported assets (badges, illustrations)
```

---

## **5. Critical Coding Standards (Frankenstein Prevention)**

**Rule 1 – Hydration Safety**

* Never call `Math.random()` or `new Date()` in component render.
* If you need random or time-based data, compute it inside `useEffect`.

**Rule 2 – Safe Effects**

* Never call a `setState()` directly in `useEffect` without conditions.
* Always wrap updates in a condition or run once with an empty dependency array.

**Rule 3 – Next.js & React Discipline**

* Always use `<Image />` from `next/image`. Never plain `<img>`.
* Always use `<Link />` from `next/link` for internal navigation.
* Add `'use client'` to the top of any component using hooks or event handlers.
* Global data (user, points, badges) must come from Contexts — never local `useState`.

---

## **6. Design & Theme Rules**

**Theme:**
Minimal, whimsical, playful, and clean — inspired by storybooks and casual mobile games.

**Fonts (via `next/font` in `src/app/layout.tsx`):**

* **Headlines:** *Patrick Hand*
* **Body:** *Nunito*
* **Quantum Messages:** *Quicksand*

**Brand Palette:**
`#A240FF`, `#FF809F`, `#3696C9`, `#A9DB4A`, `#D14002`, `#002D41`

**UI Library:**
Always prefer Shadcn/ui components before building new ones.

**Modes:**
App must support **Light** and **Dark** using `next-themes`.

### **Interface Styling Rules (Menu, Tabs, Cards)**

1. **Typography**
   - `page-title` → `text-3xl font-headline text-primary` (override color per screen if needed).
   - Section headings inside cards → uppercase label (`text-[10px]`, tracking `0.16em`, `text-muted-foreground`).
   - Body copy → `text-sm text-muted-foreground`; never apply brand colors directly to paragraphs.
   - Emphasis uses brand accent spans only (e.g., Alive/Dead/Paradox chips).

2. **Tabs**
   - `TabsList` wrapper: `rounded-3xl border border-border/40 bg-background/80 p-2 shadow-sm`, grid with 2–4 columns and `gap-3`.
   - Tab trigger base class: `px-3 py-1.5 font-semibold rounded-2xl transition transform hover:scale-105 hover:shadow-md data-[state=active]:bg-white data-[state=active]:font-bold data-[state=active]:text-foreground data-[state=active]:scale-[1.08] dark:data-[state=active]:bg-white`.
   - Assign brand-aligned background/text colors per tab (Sky `#3696C9`, Pink `#FF809F`, Emerald `#A9DB4A`, Violet `#A240FF`, Orange `#D14002`).
   - All menu tabs honor tooltips; active states must remain colored + enlarged after selection.

3. **Card Shells**
   - Primary content cards use `rounded-3xl border border-border/60 bg-background/80 p-6 shadow-sm`.
   - Badge/cat slot tiles use `rounded-3xl border border-border/40 bg-background/80 shadow-sm` with gradient interiors.
   - Placeholder slots (`???` / Coming Soon) use dashed borders `border-muted-foreground/40` and inherit the slot grid to keep counts consistent (12 items per section).

4. **Tooltips**
   - Use `TooltipProvider` + `Tooltip` from shadcn with default styling; ensure every interactive icon in the bottom menu and gallery/customize slots exposes a tooltip label.

5. **Menu Section Slot Rules**
   - Gallery tabs (Alive/Dead/Paradox/Awards) always render 12 slots, padding with locked silhouettes or mystery awards.
   - Customize > Box Skins always renders 12 slots, padding with “Coming Soon” placeholders.
   - Tabs in Settings: `System`, `Info`, `How` follow the shared tab pattern; reset controls live inside `System`.

---

## **7. Component Consistency Rules**

| Use Case                   | Component                           | From                                    | Description                                                   |
| -------------------------- | ----------------------------------- | --------------------------------------- | ------------------------------------------------------------- |
| **Pop-ups / Modals**       | `<Dialog>`                          | `src/components/ui/dialog.tsx`          | Used for all modals — cat details, settings, login, etc.      |
| **Notifications**          | `useToast()`                        | `src/hooks/use-toast.ts`                | Small, temporary messages (e.g., “Saved in your diary”).      |
| **Milestone Celebrations** | `celebration-card.tsx` + `<Dialog>` | `src/components/features/`              | Shown when a badge is unlocked — large, animated celebration. |
| **Buttons**                | `<Button>`                          | `src/components/ui/button.tsx`          | Use for every clickable button. Never style raw `<button>`.   |
| **Status Tags / Labels**   | `<Badge>`                           | `src/components/ui/badge.tsx`           | For cat state chips like “Alive”, “Dead”, “Paradox”.          |
| **User Auth Badge**        | `<UserStatusLabel>`                 | `src/components/auth/user-status-label` | Guest: outline `#CDC1E1` / text `#8D52F6` (dark `#2F374C` / `#A8AEBD`); signed-in: fill `#F2BB33` / text `#1F1404`. |
| **Awards Display**         | `<BadgeCard>`                       | `src/components/features/BadgeCard.tsx` | Used in the Awards page for unlocked milestones.              |

---
