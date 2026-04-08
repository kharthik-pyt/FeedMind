"use client";

import { useEffect, useState } from "react";
import { getTopics, createTopic, deleteTopic, Topic } from "@/lib/api";

export default function TopicsPage() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    getTopics()
      .then(setTopics)
      .catch(() => setError("Could not load topics."))
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = input.trim().toLowerCase();
    if (!name) return;
    setAdding(true);
    setError(null);
    try {
      const newTopic = await createTopic(name);
      setTopics((prev) => [...prev, newTopic]);
      setInput("");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to add topic.");
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteTopic(id);
      setTopics((prev) => prev.filter((t) => t.id !== id));
    } catch {
      setError("Failed to delete topic.");
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Manage Topics</h1>
      <p className="text-slate-500 text-sm mb-8">
        Add topics you want to learn. The feed refreshes daily with the latest articles.
      </p>

      {/* ── Add form ── */}
      <form onSubmit={handleAdd} className="flex gap-2 mb-8">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. machine learning, rust, system design"
          className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={adding || !input.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-60 transition-colors"
        >
          {adding ? "Adding…" : "+ Add"}
        </button>
      </form>

      {error && (
        <p className="text-red-600 text-sm mb-4 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      {/* ── Topic list ── */}
      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-slate-100 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : topics.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <div className="text-4xl mb-3">🗂️</div>
          <p className="text-sm">No topics yet. Add one above to get started.</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {topics.map((t) => (
            <li
              key={t.id}
              className="flex items-center justify-between bg-white border border-slate-200 rounded-lg px-4 py-3"
            >
              <span className="font-medium text-slate-800 capitalize">{t.name}</span>
              <button
                onClick={() => handleDelete(t.id)}
                className="text-slate-400 hover:text-red-500 transition-colors text-lg leading-none"
                aria-label={`Remove ${t.name}`}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
