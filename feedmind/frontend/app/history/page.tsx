"use client";

import { useEffect, useState } from "react";
import { getHistory, deleteHistoryEntry, ChatHistoryItem } from "@/lib/api";
import DifficultyBadge from "@/components/DifficultyBadge";
import VideoCard from "@/components/VideoCard";

export default function HistoryPage() {
  const [items, setItems] = useState<ChatHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<number | null>(null);

  useEffect(() => {
    getHistory()
      .then(setItems)
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: number) => {
    await deleteHistoryEntry(id);
    setItems((prev) => prev.filter((i) => i.id !== id));
    if (expanded === id) setExpanded(null);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Learning History</h1>
        <p className="text-slate-500 text-sm">
          All your past AI research sessions — click any item to expand.
        </p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-slate-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <div className="text-5xl mb-3">📭</div>
          <p className="text-sm">No history yet. Go ask something in the Chat tab!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-slate-200 rounded-xl overflow-hidden"
            >
              {/* Row */}
              <div
                className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-slate-50 transition-colors"
                onClick={() => setExpanded(expanded === item.id ? null : item.id)}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-slate-400 text-sm shrink-0">
                    {expanded === item.id ? "▼" : "▶"}
                  </span>
                  <span className="font-medium text-slate-800 capitalize truncate">
                    {item.query}
                  </span>
                  {item.difficulty && <DifficultyBadge level={item.difficulty} />}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-slate-400">
                    {new Date(item.created_at).toLocaleDateString()}
                  </span>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                    className="text-slate-300 hover:text-red-500 transition-colors text-lg leading-none ml-1"
                    title="Delete"
                  >
                    ×
                  </button>
                </div>
              </div>

              {/* Expanded content */}
              {expanded === item.id && (
                <div className="border-t border-slate-100 px-4 py-4 space-y-4">
                  {item.explanation && (
                    <div>
                      <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                        📘 Explanation
                      </h4>
                      <p className="text-sm text-slate-700 leading-relaxed">{item.explanation}</p>
                    </div>
                  )}

                  {item.key_points.length > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                        📌 Key Points
                      </h4>
                      <ul className="space-y-1">
                        {item.key_points.map((p, i) => (
                          <li key={i} className="text-sm text-slate-700 flex gap-1.5">
                            <span className="text-blue-500 font-bold shrink-0">{i + 1}.</span>
                            {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {item.why_it_matters && (
                    <div className="bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
                      <p className="text-xs text-amber-800">
                        <span className="font-semibold">💡 Why it matters: </span>
                        {item.why_it_matters}
                      </p>
                    </div>
                  )}

                  {item.videos.length > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                        🎥 Videos
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {item.videos.map((v, i) => (
                          <VideoCard key={i} video={v} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
