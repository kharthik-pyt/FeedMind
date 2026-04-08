"use client";

import { useState } from "react";
import { Article, markRead, toggleBookmark } from "@/lib/api";
import DifficultyBadge from "./DifficultyBadge";

interface Props {
  article: Article;
  onUpdate: (updated: Article) => void;
}

export default function ArticleCard({ article, onUpdate }: Props) {
  const [loading, setLoading] = useState(false);
  const bullets = article.summary
    ? article.summary.split("\n").filter(Boolean)
    : [];

  const handleMarkRead = async () => {
    if (article.is_read || loading) return;
    setLoading(true);
    try {
      const updated = await markRead(article.id);
      onUpdate(updated);
    } finally {
      setLoading(false);
    }
  };

  const handleBookmark = async () => {
    setLoading(true);
    try {
      const updated = await toggleBookmark(article.id);
      onUpdate(updated);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`bg-white border rounded-xl p-5 flex flex-col gap-3 transition-opacity ${
        article.is_read ? "opacity-60" : "opacity-100"
      } hover:shadow-md`}
    >
      {/* ── Top row: topic + difficulty ── */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
          {article.topic}
        </span>
        {article.difficulty && <DifficultyBadge level={article.difficulty} />}
      </div>

      {/* ── Title ── */}
      <a
        href={article.link}
        target="_blank"
        rel="noopener noreferrer"
        className="font-semibold text-slate-900 leading-snug hover:text-blue-600 transition-colors line-clamp-2"
      >
        {article.title}
      </a>

      {/* ── Source ── */}
      {article.source && (
        <p className="text-xs text-slate-400">{article.source}</p>
      )}

      {/* ── AI Bullets ── */}
      {bullets.length > 0 && (
        <ul className="space-y-1">
          {bullets.map((b, i) => (
            <li key={i} className="text-sm text-slate-600 leading-relaxed">
              {b}
            </li>
          ))}
        </ul>
      )}

      {/* ── Why it matters ── */}
      {article.why_it_matters && (
        <div className="bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
          <p className="text-xs text-amber-800">
            <span className="font-semibold">💡 Why it matters: </span>
            {article.why_it_matters}
          </p>
        </div>
      )}

      {/* ── Actions ── */}
      <div className="flex items-center gap-2 mt-auto pt-2 border-t border-slate-100">
        <button
          onClick={handleMarkRead}
          disabled={article.is_read || loading}
          className="flex-1 text-xs font-medium py-1.5 px-3 rounded-md bg-slate-100 hover:bg-green-100 hover:text-green-700 disabled:cursor-not-allowed transition-colors"
        >
          {article.is_read ? "✅ Read" : "Mark as read"}
        </button>
        <button
          onClick={handleBookmark}
          disabled={loading}
          title={article.is_bookmarked ? "Remove bookmark" : "Bookmark"}
          className={`text-lg px-2 py-1.5 rounded-md transition-colors ${
            article.is_bookmarked
              ? "text-yellow-500 bg-yellow-50"
              : "text-slate-400 hover:text-yellow-500 hover:bg-yellow-50"
          }`}
        >
          {article.is_bookmarked ? "🔖" : "🏷️"}
        </button>
        <a
          href={article.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-medium py-1.5 px-3 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
        >
          Read →
        </a>
      </div>
    </div>
  );
}
