"use client";

import { useState, useRef, useEffect } from "react";
import { sendChatQuery, ChatResponse } from "@/lib/api";
import ExplanationCard from "@/components/ExplanationCard";
import VideoCard from "@/components/VideoCard";
import DifficultyBadge from "@/components/DifficultyBadge";

type Message =
  | { role: "user"; text: string }
  | { role: "ai"; data: ChatResponse };

const DIFFICULTY_OPTIONS = ["auto", "beginner", "intermediate", "advanced"];
const SUGGESTIONS = [
  "Explain transformers in deep learning",
  "What is system design?",
  "How does React hooks work?",
  "Explain time complexity",
  "What is Rust ownership?",
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [difficulty, setDifficulty] = useState("auto");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (query?: string) => {
    const q = (query ?? input).trim();
    if (!q || loading) return;

    setInput("");
    setError(null);
    setMessages((prev) => [...prev, { role: "user", text: q }]);
    setLoading(true);

    try {
      const result = await sendChatQuery(q, difficulty);
      setMessages((prev) => [...prev, { role: "ai", data: result }]);
    } catch {
      setError("Could not reach the backend. Is it running on :8000?");
      setMessages((prev) => prev.slice(0, -1)); // remove user bubble on error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto flex flex-col h-[calc(100vh-4rem)]">
      {/* ── Chat header ── */}
      <div className="py-4 border-b border-slate-200 mb-4 shrink-0">
        <h1 className="text-xl font-bold text-slate-900">🤖 AI Learning Chat</h1>
        <p className="text-slate-500 text-sm mt-0.5">
          Ask anything — get a teacher-style explanation + YouTube videos
        </p>
      </div>

      {/* ── Message list ── */}
      <div className="flex-1 overflow-y-auto space-y-6 pb-4 pr-1">
        {/* Welcome state */}
        {messages.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🧠</div>
            <p className="text-slate-500 text-sm mb-6">
              Type a topic below, or try one of these:
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSend(s)}
                  className="text-sm px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full border border-blue-200 hover:bg-blue-100 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i}>
            {msg.role === "user" ? (
              /* User bubble */
              <div className="flex justify-end">
                <div className="max-w-lg bg-blue-600 text-white rounded-2xl rounded-br-sm px-4 py-3 text-sm shadow-sm">
                  {msg.text}
                </div>
              </div>
            ) : (
              /* AI response */
              <div className="space-y-4">
                <ExplanationCard data={msg.data} />

                {/* Videos */}
                {msg.data.videos.length > 0 && (
                  <div>
                    <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                      🎥 Related Videos
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {msg.data.videos.map((v, vi) => (
                        <VideoCard key={vi} video={v} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Articles */}
                {msg.data.articles.length > 0 && (
                  <div>
                    <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      📚 Related Articles
                    </h3>
                    <ul className="space-y-1.5">
                      {msg.data.articles.map((a, ai) => (
                        <li key={ai}>
                          <a
                            href={a.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline flex items-start gap-1"
                          >
                            <span className="shrink-0 mt-0.5">→</span>
                            <span className="line-clamp-1">{a.title}</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {/* Loading indicator */}
        {loading && (
          <div className="flex gap-3 items-start">
            <div className="bg-white border border-slate-200 rounded-2xl px-5 py-4 w-full">
              <div className="flex items-center gap-2 text-slate-500 text-sm">
                <span className="inline-flex gap-1">
                  <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:0ms]" />
                  <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:150ms]" />
                  <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:300ms]" />
                </span>
                Researching + generating explanation…
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
            {error}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* ── Input bar ── */}
      <div className="shrink-0 border-t border-slate-200 pt-4 pb-2">
        {/* Difficulty selector */}
        <div className="flex gap-1.5 mb-3">
          {DIFFICULTY_OPTIONS.map((d) => (
            <button
              key={d}
              onClick={() => setDifficulty(d)}
              className={`text-xs px-2.5 py-1 rounded-full border transition-colors capitalize ${
                difficulty === d
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-slate-500 border-slate-300 hover:border-blue-400"
              }`}
            >
              {d}
            </button>
          ))}
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything… e.g. 'Explain neural networks'"
            disabled={loading}
            className="flex-1 border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="px-5 py-3 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-60 transition-colors"
          >
            {loading ? "⏳" : "Ask →"}
          </button>
        </form>
      </div>
    </div>
  );
}
