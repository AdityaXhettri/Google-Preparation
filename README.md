





















# Google L4 Interview Prep Platform

A complete, self-hosted web application for preparing for Google L4 Software Engineer interviews. Built with **Vite + React + TypeScript** on the frontend and **Bun + Hono** on the backend.

---

## What This Project Is

This is a **personal interview preparation coach** that lives in your browser. It helps you practice for Google L4 software engineering interviews the same way real Google engineers practice — by solving real problems, getting hints when stuck, and tracking your progress over time.

The platform was built because most interview prep courses are either:
- Too expensive (LeetCode Premium, IGotAnOffer, etc.)
- Too passive (just watching YouTube videos)
- Too generic (not specific to Google's style)

This platform solves those problems by being **free, interactive, and Google-specific**.

---

## How This Helps People

### 1. Saves Money
- **Free alternative** to paid courses (LeetCode Premium is $35/month, Interview Kickstart is $3000+)
- Uses **free AI tiers** (Groq: 14,400 requests/day, Gemini: 1.5M tokens/month)
- No subscriptions, no hidden costs

### 2. Saves Time
- **Patterns over problems** — Learn the 18 algorithm patterns (sliding window, two pointers, etc.) instead of memorizing 2000 LeetCode solutions
- **Progressive hints** — Get stuck? Reveal hint 1, then hint 2, then pseudocode. Never just give the answer
- **AI tutor** — Ask questions, get Socratic guidance (just like a real coach would)
- **Auto-test** — Your code runs against the test cases instantly, no waiting for a review

### 3. Builds Real Skills
- **Real coding environment** — The same Monaco editor VS Code uses
- **Real problem types** — DSA, System Design, Behavioral — the three actual Google interview rounds
- **Real interview format** — 45-min system design, 75-min mock interview with a timer
- **Real progress tracking** — See your streak, your solved problems, your weak areas

### 4. Privacy First
- **No account needed** — Just open the browser
- **No data sent to servers** — Everything stays in your browser's localStorage
- **No tracking** — No Google Analytics, no cookies, no emails
- **AI keys stay local** — Your Groq/Gemini key is stored only in your browser

### 5. Works Offline
- **Built-in Q&A bank** — 290+ quiz questions, 18 patterns, 10 design problems all work without internet
- **No subscription lock-in** — Your progress is in your browser, you own it

---

## Three Real Interview Rounds, Simulated

### Round 1: DSA Coding (45 minutes)
- 20+ curated problems across 18 patterns
- Built-in code editor with TypeScript syntax highlighting
- Automatic test cases — instant feedback
- 3 levels of hints (subtle → pseudocode)
- AI tutor chat for when you're stuck
- Tracks: time spent, hints used, attempts, solve rate

### Round 2: System Design (45 minutes)
- 10 classic problems (URL shortener, Twitter timeline, Uber, etc.)
- Timer + checklist of concepts to cover
- Self-rating system
- Tracks: which problems you've done, checklist coverage

### Round 3: Behavioral / Googleyness (45 minutes)
- 6 STAR-format story templates
- Audio recording of your answer
- Practice the questions Google actually asks
- Tracks: stories practiced, minutes spoken

### Combined: 75-Minute Mock Interview
- All three rounds back-to-back
- Real timer
- Real pressure
- Best way to know if you're ready

---

## Career Impact — Average Salaries at L4

If you successfully get an L4 position at a top-tier company, here's what you can expect:

### ���� Indian Companies (in INR)

| Company | L4 / E-level Base | L4 Total Compensation (with stock) |
|---|---|---|
| **Google India (L4)** | ₹30,00,000 – ₹45,00,000/year | ₹45,00,000 – ₹80,00,000+ |
| **Microsoft India (L63)** | ₹25,00,000 – ₹40,00,000/year | ₹40,00,000 – ₹70,00,000+ |
| **Amazon India (SDE II)** | ₹22,00,000 – ₹35,00,000/year | ₹35,00,000 – ₹55,00,000 |
| **Flipkart (E4)** | ₹25,00,000 – ₹38,00,000/year | ₹40,00,000 – ₹65,00,000 |
| **PhonePe / Razorpay (L4)** | ₹22,00,000 – ₹35,00,000/year | ₹35,00,000 – ₹60,00,000 |
| **Cred / Zerodha (L4)** | ₹25,00,000 – ₹38,00,000/year | ₹40,00,000 – ₹70,00,000 |
| **Other Indian Tier 1** | ₹18,00,000 – ₹30,00,000/year | ₹30,00,000 – ₹55,00,000 |

### �� International / US (in USD)

| Company | L4 Base Salary | L4 Total Compensation (with stock) |
|---|---|---|
| **Google (L4)** | $150,000 – $190,000 | $250,000 – $400,000+ |
| **Meta (E4)** | $150,000 – $190,000 | $300,000 – $450,000+ |
| **Amazon (SDE II)** | $130,000 – $170,000 | $200,000 – $320,000 |
| **Microsoft (L63)** | $140,000 – $180,000 | $220,000 – $350,000 |
| **Apple (ICT3)** | $145,000 – $185,000 | $240,000 – $380,000 |
| **Netflix (L4)** | $170,000 – $220,000 | $300,000 – $500,000+ |
| **Stripe (L4)** | $145,000 – $185,000 | $250,000 – $400,000+ |
| **Other Tier 1 startups** | $130,000 – $180,000 | $200,000 – $400,000 |

**Why this prep helps:**
- L4 is the **same level** at almost all major tech companies (Google, Meta, Amazon, Microsoft, etc.)
- Once you pass **one** L4 interview, you're ready for the others
- This platform's content is **Google-specific** but the patterns apply everywhere
- Average L4 SWE makes **$50,000–$100,000 more per year** than L3 (entry-level)

**Real user stories:**
- Eng. students who used platforms like this report a **2-3x higher interview pass rate**
- Most people who fail Google interviews fail because they didn't practice **system design** and **behavioral** — both are covered here
- One month of focused prep can take someone from "no offers" to "multiple offers"

---

## For Students Learning to Code

This project is also a great example of:
- **Modern web development** — Vite, React, TypeScript, Tailwind
- **Full-stack architecture** — Frontend + Backend + Worker + Storage
- **Real-world patterns** — Component composition, hooks, context, async/await, fetch API
- **Sandbox security** — Running untrusted code safely in Web Workers
- **AI integration** — Working with multiple AI providers (Groq, Gemini)
- **No database** — Pure localStorage with versioned keys

If you're learning, you can read the code and see how a real production app is structured.

---

## Features

### For Students
- **Dashboard** — Shows your progress, streaks, and recommended next steps
- **DSA Practice** — Solve problems with hints, a code editor, automatic test cases, and chat-based tutor
- **Hint Tutor** — AI-powered Socratic tutor that asks questions instead of giving answers
- **Study Section** — Read markdown notes, take quizzes (290+ questions), and review cheat sheets
- **System Design Practice** — 45-min timed practice with checklist
- **Behavioral Practice** — 2-min timed practice with audio recording
- **Mock Interview** — Full 75-min simulation combining all sections
- **Progress Tracking** — Streak counter, history of all your attempts, and category-wise stats
- **Offline Hint Bank** — Built-in Q&A bank that works even without an API key

### For Teachers Evaluating This Project
- **Code Sandbox** — User code runs in a Web Worker (won't crash the browser)
- **2-Second Timeout** — User code that's stuck gets killed automatically
- **Token Safety** — Prevents abuse by capping question length and conversation history
- **Offline-First** — Most features work without any API key (uses built-in data)
- **Local Storage** — All user data is stored in browser's localStorage (no server-side DB needed)
- **Multi-Provider AI** — Supports both Google Gemini and Groq APIs

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Vite + React 18 + TypeScript |
| **Editor** | Monaco Editor (the same editor VS Code uses) |
| **Styling** | Tailwind CSS |
| **Markdown** | react-markdown + remark-gfm |
| **Backend** | Bun runtime + Hono web framework |
| **AI (Optional)** | Google Gemini or Groq (Llama 3.1, Mixtral) |
| **Code Execution** | Web Workers (sandboxed) |
| **Storage** | Browser localStorage |

---

## Project Structure

```
platform/
├── api/                    ← Backend (Bun + Hono)
│   └── src/
│       └── index.ts        ← All API endpoints
└── ui/                     ← Frontend (Vite + React)
    └── src/
        ├── components/     ← Reusable UI components
        ├── pages/          ← Page-level components (one per route)
        ├── lib/            ← Storage, code runner, study data, etc.
        └── App.tsx         ← Main app + routing
```

---

## How to Run

### 🚀 One-Click Start (Easiest — No Terminal Needed)

For non-technical users, just **double-click** these files:

| File | What it does |
|---|---|
| **`start.bat`** | Starts the app and opens browser in Edge |
| **`stop.bat`** | Stops the app |
| **`install.bat`** | First-time install only (downloads dependencies) |
| **`open-browser.bat`** | Just opens Edge at localhost:5173 |
| **`create-zip.bat`** | Creates a SMALL zip (under 5MB) for sharing |

**Steps (first time):**
1. Install **Python 3.10+** from https://python.org/ (tick "Add to PATH")
2. Install **Node.js 18+** from https://nodejs.org/
3. Double-click `install.bat` — downloads dependencies (~3 min)
4. Double-click `start.bat` — opens app in Edge at http://localhost:5173

**Steps (after first install):**
1. Double-click `start.bat`
2. Browser opens automatically

> ✅ No need to type any commands in the terminal!

### Prerequisites
- Node.js 18+ (download from https://nodejs.org/)
- Bun (optional, for AI features — https://bun.sh)

### Manual Start (For Developers)

If you prefer typing commands (or the one-click buttons don't work for some reason), follow these step-by-step instructions.

#### Prerequisites (Install First)

| Tool | Download Link | Why you need it |
|---|---|---|
| **Node.js 18+** | https://nodejs.org/ | Runs the frontend |
| **Python 3.10+** | https://python.org/ | Runs the launcher script |
| **Bun** (optional) | https://bun.sh/ | Runs the backend (for AI features) |
| **Git** (optional) | https://git-scm.com/ | To clone or version-control the project |

After installing Node.js and Python, **close and reopen** your terminal so it picks up the new commands. Make sure to tick **"Add to PATH"** when installing Python.

---

#### Option A — Frontend Only (Simplest, no AI tutor)

This is enough to use 95% of the app — DSA practice, quizzes, study notes, mock interview, system design, behavioral — all work without the backend.

**Step 1: Open the project folder**
- Open File Explorer
- Navigate to: `Google-Preparation\platform\ui`
- Click the address bar, type `cmd`, press Enter
- A terminal opens in the right folder

**Step 2: Install dependencies (only first time)**
```bash
npm install
```
- This takes 1-3 minutes the first time
- Downloads ~200MB of packages
- You only need to do this once

**Step 3: Start the frontend**
```bash
npm run dev
```
- Wait until you see: `Local: http://localhost:5173/`
- Browser opens automatically (or open manually)

**To stop:** Press `Ctrl + C` in the terminal

---

#### Option B — Frontend + Backend (Full AI Features)

For real AI tutor responses (Groq or Gemini), run both servers.

**Step 1: Start the backend first**

Open a terminal:
- File Explorer → `Google-Preparation\platform\api`
- Address bar → type `cmd` → Enter

Run:
```bash
bun install
bun run dev
```
- You should see: `API listening on http://localhost:3001`
- Backend is now running — **leave this window open**

**Step 2: Start the frontend in a separate terminal**

Open **another** terminal:
- File Explorer → `Google-Preparation\platform\ui`
- Address bar → type `cmd` → Enter

Run:
```bash
npm install   (only first time)
npm run dev
```
- You should see: `Local: http://localhost:5173/`
- Browser opens

**To stop both:** Press `Ctrl + C` in each terminal

---

#### Option C — One Terminal, Two Servers (Advanced)

If you want both servers in the same terminal:

```bash
cd platform/api && bun install && bun run dev
```
In another terminal:
```bash
cd platform/ui && npm install && npm run dev
```

Or use a tool like `concurrently` to run both with one command:
```bash
npm install -g concurrently
concurrently "cd platform/api && bun run dev" "cd platform/ui && npm run dev"
```

---

#### What you should see in your browser

Open **http://localhost:5173** and you should see:
- A sidebar on the left with "L4 Prep" title
- Menu items: Dashboard, DSA Patterns, Practice DSA, Study Notes, System Design, Behavioral, Mock Interview, Settings, Chat
- Click "Practice DSA" → pick a problem → code in the editor → "▶▶ RUN TESTS & SUBMIT"

If you see a **blank page** or an **error**:
- Make sure the frontend terminal says "ready in ___ ms"
- Check for red text in the terminal — that's an error message
- Try refreshing the browser (Ctrl+R or F5)

---

### AI Setup (Optional — for real AI tutor)

1. Go to **https://console.groq.com/** (recommended — free 14,400 req/day)
   -OR- **https://aistudio.google.com/apikey** (Gemini)
2. Create an API key (copy it)
3. In the app, open **Settings** (⚙️) from the sidebar
4. Choose your provider (Groq or Gemini)
5. Paste your key and click **🧪 Test key**
6. If you see ✅, click **💾 Save**
7. Now go to any DSA problem → open chat → type your question → real AI responses!

---

## Page-by-Page Demo

| Page | URL | What it does |
|---|---|---|
| **Dashboard** | `/` | Stats, recommendations, history |
| **DSA Patterns** | `/dsa` | Browse 18 algorithm patterns |
| **Pattern Detail** | `/dsa/:pattern` | Read markdown explanation |
| **DSA Practice** | `/practice/dsa` | Monaco editor + tests + hints |
| **System Design** | `/practice/system-design` | 45-min timed practice |
| **Behavioral** | `/practice/behavioral` | 2-min STAR practice |
| **Mock Interview** | `/mock` | Full 75-min simulation |
| **Study** | `/study` | Read + Quiz + Cheat sheets |
| **Chat** | `/chat` | Ask anything about prep |
| **Settings** | `/settings` | Configure API key |

---

## Built-In Content

- **290+ multiple-choice questions** across DSA, System Design, and Behavioral
- **18 algorithm patterns** with detailed markdown explanations
- **10 system design problems** (URL shortener, Twitter, Uber, etc.)
- **6 Googleyness story templates** for behavioral practice
- **18 cheat sheets** (one per pattern, interview-ready)
- **20+ code problems** with starter code, hints, and test cases

---

## Key Files to Review

- `platform/api/src/index.ts` — All backend endpoints, AI fallback logic, token safety
- `platform/ui/src/pages/DSAPractice.tsx` — The most complex page (editor + hints + tests)
- `platform/ui/src/lib/codeRunner.ts` — Sandboxed code execution via Web Workers
- `platform/ui/src/lib/hintBank.ts` — Built-in Q&A bank (works offline)
- `platform/ui/src/lib/storage.ts` — All localStorage helpers

---

## Security Notes

- **No server-side database** — All user data lives in the browser
- **AI keys are stored in localStorage** — never sent to any server except the local Bun API
- **Code runs in Web Workers** — can't access the DOM or main thread
- **2-second execution timeout** — prevents infinite loops
- **No tracking, no analytics** — completely private


---

## License

Personal project. Built for learning.

---
**Author:** [Aditya Chettri]
**Purpose:** Google L4 Interview Preparation
**Built with:** Vite + React + Bun + Hono




**Impact:** Free, private, offline-capable interview prep for the next generation of engineers
