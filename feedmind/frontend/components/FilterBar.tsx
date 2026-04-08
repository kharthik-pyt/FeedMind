"use client";

import { Topic, FeedFilters } from "@/lib/api";

interface Props {
  topics: Topic[];
  filters: FeedFilters;
  onChange: (f: FeedFilters) => void;
}

const DIFFICULTIES = ["beginner", "intermediate", "advanced"];

export default function FilterBar({ topics, filters, onChange }: Props) {
  const set = (patch: Partial<FeedFilters>) => onChange({ ...filters, ...patch });

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {/* Topic filter */}
      <select
        value={filters.topic ?? ""}
        onChange={(e) => set({ topic: e.target.value || undefined })}
        className="text-sm border border-slate-300 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        <option value="">All topics</option>
        {topics.map((t) => (
          <option key={t.id} value={t.name}>
            {t.name}
          </option>
        ))}
      </select>

      {/* Difficulty filter */}
      <select
        value={filters.difficulty ?? ""}
        onChange={(e) => set({ difficulty: e.target.value || undefined })}
        className="text-sm border border-slate-300 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        <option value="">All levels</option>
        {DIFFICULTIES.map((d) => (
          <option key={d} value={d}>
            {d.charAt(0).toUpperCase() + d.slice(1)}
          </option>
        ))}
      </select>

      {/* Toggle: unread only */}
      <button
        onClick={() => set({ unread_only: !filters.unread_only })}
        className={`text-sm px-3 py-1.5 rounded-lg border transition-colors ${
          filters.unread_only
            ? "bg-blue-600 text-white border-blue-600"
            : "bg-white text-slate-600 border-slate-300 hover:border-blue-400"
        }`}
      >
        Unread only
      </button>

      {/* Toggle: bookmarks */}
      <button
        onClick={() => set({ bookmarked: !filters.bookmarked })}
        className={`text-sm px-3 py-1.5 rounded-lg border transition-colors ${
          filters.bookmarked
            ? "bg-yellow-400 text-white border-yellow-400"
            : "bg-white text-slate-600 border-slate-300 hover:border-yellow-400"
        }`}
      >
        🔖 Bookmarks
      </button>

      {/* Clear */}
      {(filters.topic || filters.difficulty || filters.unread_only || filters.bookmarked) && (
        <button
          onClick={() => onChange({})}
          className="text-sm px-3 py-1.5 rounded-lg border border-slate-300 text-slate-500 hover:text-red-500 hover:border-red-300 transition-colors"
        >
          ✕ Clear
        </button>
      )}
    </div>
  );
}
