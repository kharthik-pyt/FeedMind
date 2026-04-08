# 🧠 FeedMind — Personal AI Learning Feed

> Enter topics you're learning → AI fetches fresh articles daily → summarizes each into 3 bullets + difficulty level → you mark as read.

**100% free to run.** No paid APIs. Uses local LLM (Ollama) + Google News RSS.

---

## Architecture

```
Next.js (App Router)  →  FastAPI (Python)  →  Google News RSS
      ↕                        ↕                     ↓
 localStorage           SQLite (SQLModel)     Ollama (llama3)
```

---

## 🚀 Quick Start

### Prerequisites

| Tool | Install |
|---|---|
| Node.js ≥ 18 | https://nodejs.org |
| Python ≥ 3.11 | https://python.org |
| Ollama | `brew install ollama` |

---

### 1. Clone & enter project

```bash
git clone <your-repo-url>
cd feedmind
```

---

### 2. Start Ollama (local LLM)

```bash
# Pull the model first (one-time, ~4GB)
ollama pull llama3

# Start Ollama server
ollama serve
```

> ✅ Ollama runs at `http://localhost:11434`

---

### 3. Backend setup

```bash
cd backend

# Create virtual env
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy env file
cp .env.example .env

# Run the server
uvicorn main:app --reload --port 8000
```

> API docs: http://localhost:8000/docs

---

### 4. Frontend setup

```bash
cd frontend

npm install
npm run dev
```

> App: http://localhost:3000

---

## 📖 Usage

1. Go to **Topics** page → add topics (e.g. `machine learning`, `rust`, `system design`)
2. Back on **Feed** page → click **🔄 Refresh Feed** to fetch + summarize articles
3. Each article shows:
   - 3 AI-generated bullet points
   - Difficulty badge (Beginner / Intermediate / Advanced)
   - 💡 "Why it matters" insight
4. Mark articles as read or 🔖 bookmark them
5. Filter by topic, difficulty, unread, or bookmarks

> The scheduler auto-refreshes the feed every day at 06:00.

---

## 📁 Folder Structure

```
feedmind/
├── backend/
│   ├── main.py              ← FastAPI app entry, CORS, routers
│   ├── models.py            ← Topic + Article SQLModel models
│   ├── database.py          ← SQLite engine + session
│   ├── scheduler.py         ← APScheduler daily refresh
│   ├── routers/
│   │   ├── topics.py        ← GET/POST/DELETE /topics
│   │   └── feed.py          ← GET/POST /feed
│   ├── services/
│   │   ├── news_fetcher.py  ← RSS feed fetcher (Google News)
│   │   └── summarizer.py    ← Ollama llama3 summarizer
│   └── requirements.txt
│
├── frontend/
│   ├── app/
│   │   ├── layout.tsx       ← Root layout + nav
│   │   ├── page.tsx         ← Feed page
│   │   └── topics/
│   │       └── page.tsx     ← Topics management
│   ├── components/
│   │   ├── ArticleCard.tsx  ← Article card with bullets + badges
│   │   ├── DifficultyBadge.tsx
│   │   └── FilterBar.tsx    ← Topic / difficulty / unread filters
│   ├── lib/
│   │   └── api.ts           ← Typed fetch helpers
│   └── package.json
│
└── README.md
```

---

## 🔧 Configuration

| Variable | Default | Description |
|---|---|---|
| `DATABASE_URL` | `sqlite:///./feedmind.db` | SQLite path |
| `OLLAMA_URL` | `http://localhost:11434/api/generate` | Ollama endpoint |
| `OLLAMA_MODEL` | `llama3` | Model name (also try `mistral`, `phi`) |
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000` | Backend URL for frontend |

---

## 🛠️ Tech Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS |
| Backend | FastAPI, Python 3.11+ |
| Database | SQLite via SQLModel |
| AI Summarization | Ollama (llama3 / mistral / phi) — **free, local** |
| News Fetching | Google News RSS via feedparser — **no API key** |
| Scheduler | APScheduler (daily refresh) |

---

## 🚢 Deployment

### Backend → Render / Railway / Fly.io
- Swap SQLite for Supabase (Postgres) in `DATABASE_URL`
- Point `OLLAMA_URL` to a hosted Ollama instance or swap summarizer for a free HuggingFace endpoint

### Frontend → Vercel
```bash
cd frontend
npx vercel
```

Set `NEXT_PUBLIC_API_URL` to your deployed backend URL.
