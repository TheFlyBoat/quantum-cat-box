# The Quantum Cat

**🔗 Live app: [thequantumcat.app](https://thequantumcat.app/)**

A daily game inspired by Schrödinger's Cat. Open your Quantum Box once a day to discover whether your cat is **alive**, **dead**, or in a state of **paradox** — and receive an AI-generated philosophical message from wherever it is the cat exists.

Collect cats, save their wisdom to your diary, earn badges, and customise your box. No physics degree required.

---

## The Concept

Schrödinger's thought experiment says a cat sealed in a box with a radioactive trigger is simultaneously alive and dead until you look. The Quantum Cat turns that into a daily ritual — you get one observation per day, the outcome is genuinely random, and the AI crafts a message that fits whichever state your cat is in. Some messages are profound. Some are ridiculous. All of them are unique.

---

## Features

- **Daily Quantum Box** — one box opening per day, three possible cat states: `alive`, `dead`, or `paradox`
- **Quantum Messages** — AI-generated text delivered by the cat, written in the voice of each state
- **Cat Collection** — a gallery of every cat you've observed, organised by state
- **Cat Diary** — save messages that resonate and revisit them anytime
- **Fish Points** — earned through daily observations and interactions
- **Badges & Achievements** — unlocked through milestones and streaks
- **Box Skins** — personalise your Quantum Box with different themes
- **Guest Mode** — play immediately without creating an account
- **Full accounts** — sign in to persist your collection and diary across devices
- **Light and dark mode** — full theme support via `next-themes`

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router, Turbopack) |
| Language | TypeScript |
| AI Engine | Google Genkit (`@genkit-ai/googleai`) |
| Authentication | Firebase Auth (Guest + Account) |
| Database | Firebase Firestore |
| Storage | Firebase Storage |
| Hosting | Firebase App Hosting |
| Styling | Tailwind CSS, Shadcn/ui |
| Animation | Framer Motion |
| WebGL | OGL (box opening visuals) |
| Forms | React Hook Form + Zod |
| Image Export | html-to-image |
| Date Logic | date-fns |
| Carousel | Embla Carousel |
| Charts | Recharts |
| Security | secretlint + Husky (pre-commit secret scanning) |

---

## Project Structure

```
quantum-cat-box/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Public landing screen
│   │   ├── login/page.tsx        # Auth / sign-in page
│   │   └── (app)/                # Protected app routes
│   │       ├── layout.tsx        # Main layout (sidebar + header)
│   │       ├── home/             # Quantum Box — daily opening
│   │       ├── gallery/          # Cat collection (Alive / Dead / Paradox tabs)
│   │       └── awards/           # Badges and achievements
│   ├── components/
│   │   ├── ui/                   # Shadcn/ui primitives (Button, Card, Dialog, etc.)
│   │   ├── layout/               # Header, Sidebar
│   │   ├── auth/                 # LoginCard, NicknameDialog, UserStatusLabel
│   │   ├── cats/                 # Individual cat components (e.g. bones-cat.tsx)
│   │   └── features/             # App feature blocks:
│   │       ├── QuantumCatBox     # The main box interaction
│   │       ├── CatDiarySheet     # Diary overlay
│   │       ├── BadgeCard         # Badge display
│   │       └── celebration-card  # Badge unlock celebration modal
│   ├── context/                  # React Contexts — Auth, Points, Badges
│   ├── lib/
│   │   ├── firebase.ts           # Firebase initialisation
│   │   ├── utils.ts              # Shared utilities
│   │   └── types.ts              # Shared TypeScript types
│   └── ai/                       # Google Genkit flows
│       └── dev.ts                # Genkit dev entry point
├── public/                       # Static assets (images, icons, fonts)
├── .env.example                  # Environment variable template
├── .secretlintrc.json            # Secret scanning config
├── .husky/                       # Pre-commit hooks
├── apphosting.yaml               # Firebase App Hosting config
└── next.config.ts
```

---

## Domain Language

The codebase uses consistent domain terms everywhere — in variables, functions, and UI labels:

| Term | Meaning |
|---|---|
| **Quantum Box** | The daily box-opening feature |
| **Quantum Message** | The AI-generated text delivered by the cat |
| **Cat States** | `alive`, `dead`, or `paradox` — the three possible outcomes |
| **Cat Diary** | The user's saved collection of Quantum Messages |
| **Fish Points** | In-app score/currency earned through play |
| **Badges** | Achievements unlocked through milestones |
| **Box Skins** | Custom visual themes for the Quantum Box |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v20 or later
- A [Firebase project](https://console.firebase.google.com/) with Auth, Firestore, and Storage enabled
- A [Google AI API key](https://aistudio.google.com/app/apikey) for Genkit

### Installation

1. Clone the repository:

```bash
git clone https://github.com/TheFlyBoat/quantum-cat-box.git
cd quantum-cat-box
```

2. Install dependencies:

```bash
npm install
```

3. Copy the environment template and fill in your values:

```bash
cp .env.example .env.local
```

4. Start the development server:

```bash
npm run dev
```

The app runs at `http://localhost:3000`.

To develop with the AI flows running locally, start Genkit alongside Next.js in a separate terminal:

```bash
npm run genkit:dev
# or with file watching:
npm run genkit:watch
```

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Next.js dev server (Turbopack) |
| `npm run build` | Production build |
| `npm start` | Run the production build locally |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | TypeScript type check (no emit) |
| `npm run genkit:dev` | Start Genkit dev server |
| `npm run genkit:watch` | Start Genkit dev server with file watching |

---

## Environment Variables

Copy `.env.example` to `.env.local` and populate all values. All variables are Firebase config — available from your Firebase project settings under "Your apps."

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
```

> The Google AI key for Genkit is configured separately via the Genkit SDK — it is not exposed as a `NEXT_PUBLIC_` variable and never reaches the client.

---

## How the AI Works

The Quantum Messages are generated by **Google Genkit**, Google's AI orchestration framework. Genkit flows live in `src/ai/` and run server-side via Next.js API routes — the AI key never touches the browser.

Each flow receives the cat's state (`alive`, `dead`, or `paradox`) and generates a message in the appropriate voice: serene and knowing for alive, cryptic and final for dead, delightfully contradictory for paradox. The output is stored in Firestore against the user's daily observation record.

---

## Design System

**Aesthetic:** Minimal, whimsical, playful — inspired by storybooks and casual mobile games.

**Typography:**
- Headlines: *Patrick Hand*
- Body: *Nunito*
- Quantum Messages: *Quicksand*

**Brand Palette:**

| Name | Hex |
|---|---|
| Violet | `#A240FF` |
| Pink | `#FF809F` |
| Sky | `#3696C9` |
| Lime | `#A9DB4A` |
| Orange | `#D14002` |
| Deep Navy | `#002D41` |

Components are built on **Shadcn/ui** with Radix UI primitives. Gallery tabs always render 12 slots — empty slots are filled with locked silhouettes or mystery placeholders to communicate that more cats are out there to discover.

---

## Security

The repo uses **secretlint** with a Husky pre-commit hook to prevent API keys and Firebase credentials from being accidentally committed. The configuration lives in `.secretlintrc.json` and `.secretlintignore`. The `.env.local` file is gitignored by default.

---

## Deployment

The app deploys to **Firebase App Hosting**, which handles Next.js SSR natively — no custom server configuration needed.

1. Install the Firebase CLI:

```bash
npm install -g firebase-tools
firebase login
```

2. Build the app:

```bash
npm run build
```

3. Deploy:

```bash
firebase deploy
```

Firebase App Hosting reads `apphosting.yaml` for configuration. Environment variables for production are managed through the Firebase console under App Hosting settings — do not commit `.env.local`.

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "Add your feature"`
4. Push and open a pull request

The pre-commit hooks will run secretlint automatically — make sure no credentials appear in staged files before committing.

---

## License

This project is private and not currently licensed for public distribution. Contact the repository owner for usage inquiries.
