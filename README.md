<div align="center">

<!-- Animated title -->
<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=36&pause=1000&color=6366F1&center=true&vCenter=true&width=600&lines=🧠+FeedMind;Your+Personal+AI+Tutor;Learn+Smarter%2C+Not+Harder" alt="FeedMind" />

<br/>

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Python](https://img.shields.io/badge/Python-3.9-3776AB?style=for-the-badge&logo=python&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)

![Ollama](https://img.shields.io/badge/Ollama-LLaMA3-FF6B35?style=for-the-badge)
![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-Database-003B57?style=for-the-badge&logo=sqlite&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

![No API Key](https://img.shields.io/badge/API%20Key-Not%20Required-brightgreen?style=for-the-badge)
![Local AI](https://img.shields.io/badge/AI-100%25%20Local-purple?style=for-the-badge)
![Free Forever](https://img.shields.io/badge/Cost-Free%20Forever-gold?style=for-the-badge)

<br/>

> **Ask any topic → Get a teacher-style AI explanation + curated YouTube videos + live articles.**
> Powered by a **local LLM (no API keys, no cost)** — runs entirely on your machine.

<br/>

[Features](#-features) · [Demo](#-demo) · [Architecture](#-architecture) · [Tech Stack](#-tech-stack) · [Quick Start](#-quick-start) · [API Reference](#-api-reference) · [Roadmap](#-roadmap)

</div>

---

## 🎬 Demo

<div align="center">

> 📹 *Drop your screen recording at `assets/demo.gif` to show it here*

```
┌──────────────────────────────────────────────────────────────┐
│  🧠 FeedMind — AI Learning Chat                              │
│──────────────────────────────────────────────────────────────│
│                                                              │
│  You ▶  "Explain transformers in deep learning"              │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  🏷 intermediate                                       │   │
│  │                                                        │  │
│  │  Transformers are a neural network architecture that   │  │
│  │  revolutionized NLP by replacing RNNs with attention…  │  │
│  │                                                        │  │
│  │  🔍 What is it?                                        │  │
│  │     A transformer processes entire sequences at once   │  │
│  │     using self-attention rather than step-by-step...   │  │
│  │                                                        │  │
│  │  ⚙️  How does it work?                                  │  │
│  │     Multi-head attention lets every token attend to    │  │
│  │     every other token simultaneously...                │  │
│  │                                                        │  │
│  │  🚀 Key features & real-world use cases                │  │
│  │     Powers GPT-4, BERT, Gemini, GitHub Copilot...      │  │
│  │                                                        │  │
│  │  ⚠️  Common mistakes                                    │  │
│  │     Confusing self-attention with cross-attention...   │  │
│  │                                                        │  │
│  │  📌 Key Takeaways                                      │  │
│  │     1  Self-attention runs in O(n²) — quadratic...     │  │
│  │     2  Positional encodings inject sequence order...   │  │
│  │     3  Encoder-decoder is used for translation...      │  │
│  │     4  Decoder-only (GPT) is used for generation...    │  │
│  │     5  Flash Attention reduces memory from O(n²)...    │  │
│  │                                                        │  │
│  │  💡 Why it matters                                     │  │
│  │     Transformers power every major AI system in 2026.  │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  🎥 Related Videos  ·  📚 3 Related Articles                  │
└──────────────────────────────────────────────────────────────┘
```

</div>

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 🤖 AI Teacher Mode
- **Structured 4-section explanations** — What / How / Use Cases / Gotchas
- **5 rich key takeaways** with full-sentence insights
- **3 difficulty levels** — Beginner · Intermediate · Advanced
- Powered by **LLaMA 3** running 100% locally via Ollama

</td>
<td width="50%">

### 🎥 YouTube Integration
- Auto-fetches **top 3 relevant videos** per query
- **No YouTube API key required** — uses `youtube-search-python`
- Embedded player directly in the UI
- Duration badges on every video card

</td>
</tr>
<tr>
<td width="50%">

### 📰 Live News Feed
- **RSS-powered** article fetching from Google News
- AI-summarized into **3 bullets** per article
- Difficulty tags, bookmarks, and read tracking
- **Daily auto-refresh** at 06:00 via APScheduler

</td>
<td width="50%">

### 🗂️ Smart Caching & History
- Every chat response is **cached in SQLite**
- Same query = **instant replay**, no LLM re-run
- Collapsible history view with full response replay
- Per-entry delete support

</td>
</tr>
</table>

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                       FRONTEND  (Next.js 14)                     │
│                                                                  │
│  /chat          /feed          /history         /topics          │
│  ChatPage       FeedPage       HistoryPage      TopicsPage       │
│     │               │               │               │            │
│     └───────────────┴───────────────┴───────────────┘            │
│                             │                                     │
│                         lib/api.ts  (typed fetch helpers)         │
└─────────────────────────────┼────────────────────────────────────┘
                              │  HTTP / JSON
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│                       BACKEND  (FastAPI)                         │
│                                                                  │
│   POST /chat    GET /feed    GET /history    CRUD /topics         │
│        │             │                                           │
│        ▼             ▼                                           │
│   ┌─────────────────────────────────────────────────────┐        │
│   │              Orchestrator  (asyncio.gather)          │        │
│   │                                                     │        │
│   │   ┌───────────────┐  ┌────────────────┐             │        │
│   │   │  AI Service   │  │YouTube Service │             │        │
│   │   │  (Ollama API) │  │(yt-search-py)  │             │        │
│   │   └───────────────┘  └────────────────┘             │        │
│   │   ┌─────────────────────────────────┐               │        │
│   │   │  RSS Service  (feedparser)      │               │        │
│   │   └─────────────────────────────────┘               │        │
│   └─────────────────────────────────────────────────────┘        │
│                             │                                    │
│                             ▼                                    │
│                    SQLite  (feedmind.db)                         │
│              Topics · Articles · ChatHistory                     │
└─────────────────────────────┼────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│                     LOCAL AI LAYER                               │
│                                                                  │
│          Ollama v0.20+  ←→  LLaMA 3 (4.7 GB, 8B params)         │
│                  http://localhost:11434                           │
│                                                                  │
│   ✅ No cloud   ✅ No API key   ✅ Free forever   ✅ Private      │
└──────────────────────────────────────────────────────────────────┘
```

---

## 🧩 Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| **Frontend** | Next.js 14 (App Router) | Fast, file-based routing |
| **Styling** | Tailwind CSS | Rapid, consistent design |
| **Language (FE)** | TypeScript | Type safety across all API calls |
| **Backend** | FastAPI 0.111 | Async Python REST API |
| **ORM** | SQLModel | Pydantic + SQLAlchemy unified |
| **Database** | SQLite | Zero-config, file-based persistence |
| **AI Runtime** | Ollama 0.20 | Serve LLMs locally |
| **LLM Model** | LLaMA 3 (8B) | High-quality explanations |
| **News** | feedparser + Google News RSS | Free, no key needed |
| **Videos** | youtube-search-python | Free, no YouTube API key |
| **Scheduler** | APScheduler | Cron-style daily feed refresh |

---

## 📂 Project Structure

```
feedmind/
├── 📁 frontend/
│   ├── 📁 app/
│   │   ├── 📄 layout.tsx            # Root layout + navigation
│   │   ├── 📄 page.tsx              # 📰 Feed page
│   │   ├── 📁 chat/page.tsx         # 💬 AI chat interface
│   │   ├── 📁 history/page.tsx      # 🕒 Chat history
│   │   └── 📁 topics/page.tsx       # 🏷 Topic management
│   ├── 📁 components/
│   │   ├── 📄 ExplanationCard.tsx   # Rich AI response (4 sections + key points)
│   │   ├── 📄 VideoCard.tsx         # YouTube embed + duration badge
│   │   ├── 📄 ArticleCard.tsx       # News article card
│   │   ├── 📄 DifficultyBadge.tsx   # Beginner / Intermediate / Advanced badge
│   │   └── 📄 FilterBar.tsx         # Feed filter controls
│   └── 📁 lib/
│       └── 📄 api.ts                # All typed API helpers
│
├── 📁 backend/
│   ├── 📁 routers/
│   │   ├── �� chat.py               # POST /chat — LLM + cache
│   │   ├── 📄 feed.py               # RSS feed CRUD
│   │   ├── 📄 history.py            # Chat history endpoints
│   │   └── 📄 topics.py             # Topic management
│   ├── 📁 services/
│   │   ├── 📄 ai_service.py         # Ollama teacher prompt
│   │   ├── 📄 orchestrator.py       # Parallel gather
│   │   ├── 📄 youtube_service.py    # YouTube search
│   │   ├── 📄 news_fetcher.py       # Google News RSS
│   │   └── 📄 summarizer.py         # Article summarizer
│   ├── 📄 models.py                 # All SQLModel schemas
│   ├── 📄 database.py               # SQLite engine + session
│   ├── 📄 main.py                   # FastAPI app entry
│   ├── 📄 scheduler.py              # APScheduler daily job
│   └── 📄 requirements.txt
│
└── 📄 README.md
```

---

## ⚡ Quick Start

### Prerequisites

```bash
# macOS
brew install ollama node python@3.11

# Pull the AI model (one-time, ~4.7 GB)
ollama pull llama3
```

### 1 · Clone

```bash
git clone https://github.com/your-username/feedmind.git
cd feedmind
```

### 2 · Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### 3 · Frontend

```bash
cd frontend
npm install
npm run dev
```

### 4 · Open

```
http://localhost:3000
```

> ✅ No `.env` needed — everything runs locally out of the box.

---

## 🔌 API Reference

### `POST /chat/`

```http
POST http://localhost:8000/chat/
Content-Type: application/json

{
  "query": "How does React useEffect work?",
  "difficulty_mode": "intermediate"
}
```

**Response:**

```json
{
  "id": 7,
  "query": "how does react useeffect work?",
  "explanation": "useEffect is a React Hook that lets you synchronize a component with an external system...",
  "sections": [
    { "heading": "What is it?",       "content": "useEffect runs side effects after render..." },
    { "heading": "How does it work?", "content": "React defers it until after painting the DOM..." },
    { "heading": "Key features & real-world use cases", "content": "Fetching data, subscriptions, timers..." },
    { "heading": "Common mistakes & things to watch out for", "content": "Missing dependency array causes infinite loops..." }
  ],
  "key_points": [
    "Runs after every render by default — pass a dependency array to control when",
    "Empty array [] means 'run once on mount' — equivalent to componentDidMount",
    "Return a cleanup function to unsubscribe, clear timers, or cancel fetches",
    "React 18 runs effects twice in StrictMode — design cleanup to handle this",
    "useLayoutEffect fires synchronously before paint — use for DOM measurements"
  ],
  "difficulty": "intermediate",
  "why_it_matters": "useEffect is the bridge between React's declarative world and imperative APIs like fetch, WebSockets, and browser timers.",
  "videos": [{ "title": "...", "videoId": "...", "duration": "14:22", "url": "..." }],
  "articles": [{ "title": "...", "link": "...", "source": "Google News" }],
  "cached": false
}
```

### Full Endpoint Map

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/health` | Health check |
| `GET` | `/topics/` | List learning topics |
| `POST` | `/topics/` | Add topic |
| `DELETE` | `/topics/{id}` | Remove topic |
| `GET` | `/feed/` | Articles (filter by topic/difficulty/unread) |
| `POST` | `/feed/refresh` | Trigger feed refresh |
| `PATCH` | `/feed/{id}/read` | Mark as read |
| `PATCH` | `/feed/{id}/bookmark` | Toggle bookmark |
| `POST` | `/chat/` | AI explanation + videos + articles |
| `GET` | `/history/` | Past queries (newest first) |
| `DELETE` | `/history/{id}` | Delete entry |

---

## 🔄 Request Flow

```
User types: "What is Rust ownership?"
         │
         ▼
POST /chat/  →  cache check (SQLite)
         │
    cache HIT? ──── YES ──▶  instant return (0ms LLM)
         │
        NO
         │
         ▼
  asyncio.gather() ──── runs all 3 in parallel ────────────────┐
         │                                                      │
         ▼                    ▼                    ▼            │
  Ollama LLaMA 3      youtube-search-py      feedparser RSS     │
  (8–15 sec)          (1–2 sec)              (1–2 sec)          │
  4-section JSON      top 3 videos           top 5 articles     │
         │                                                      │
         └────────────── merge ───────────────────────────────┘
                          │
                          ▼
                   save to SQLite
                          │
                          ▼
              ExplanationCard + VideoCard + ArticleList
```

---

## 🔐 Environment Variables

> All optional — defaults work out of the box.

**`backend/.env`**

```env
# Ollama server (default: localhost)
OLLAMA_URL=http://localhost:11434/api/generate

# Model to use (switch to mistral or gemma for variety)
OLLAMA_MODEL=llama3
```

---

## 🚀 Roadmap

- [x] RSS news feed with AI bullet summaries
- [x] 100% local LLM via Ollama — zero API cost
- [x] Chat interface with 4 difficulty modes
- [x] YouTube video search with no API key
- [x] Chat history with SQLite response caching
- [x] Structured 4-section explanations + 5 key points
- [x] Feed duplicate-article bug fixed
- [ ] 🧠 Multi-agent research paths (CrewAI)
- [ ] 📊 Personal learning analytics dashboard
- [ ] 🔍 Vector search / RAG over saved articles
- [ ] 🗣️ Voice input + text-to-speech output
- [ ] 📱 Progressive Web App (PWA) support
- [ ] 🌐 Deploy guide (Vercel + Fly.io)

---

## 🧠 Why FeedMind Stands Out

| Typical learning app | FeedMind |
|---------------------|---------|
| Static or paywalled content | 🔄 Fresh daily RSS feed |
| Requires OpenAI / Gemini API | 🆓 Free local LLM (Ollama) |
| One-size-fits-all answers | 🎯 Beginner / Intermediate / Advanced |
| Just text | 📺 Text + Videos + Articles combined |
| No memory | 🗂️ Persistent history + response caching |
| Short generic answers | 🏗️ Structured 4-section teacher format |
| API key management | ✅ Zero keys required |

---

## 🤝 Contributing

```bash
# 1. Fork the repo
# 2. Create a feature branch
git checkout -b feature/voice-input

# 3. Make your changes, then commit
git commit -m 'feat: add voice input support'

# 4. Push and open a PR
git push origin feature/voice-input
```

---

## 📜 License

MIT © 2026 — Free to use, modify, and distribute.

---

<div align="center">

**Built with ❤️ — local AI, zero cost, infinite learning.**

⭐ Star this repo if it helped you learn something today!

</div>
