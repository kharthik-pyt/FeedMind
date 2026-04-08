"use client";

import { useEffect, useState, useCallback } from "react";
import { getFeed, getTopics, refreshFeed, Article, Topic, FeedFilters } from "@/lib/api";
import ArticleCard from "@/components/ArticleCard";
import FilterBar from "@/components/FilterBar";

export default function FeedPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [filters, setFilters] = useState<FeedFilters>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadFeed = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getFeed(filters);
      setArticles(data);
    } catch {
      setError("Could not reach the backend. Is it running on :8000?");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadFeed();
  }, [loadFeed]);

  useEffect(() => {
    getTopics().then(setTopics).catch(() => {});
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshFeed();
      setTimeout(loadFeed, 1500); // Give backend time to process
    } catch {
      setError("Refresh failed.");
    } finally {
      setRefreshing(false);
    }
  };

  const updateArticle = (updated: Article) => {
    setArticles((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
  };

  return (
    <div>
      {/* ── Header row ── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Your Learning Feed</h1>
          <p className="text-slate-500 text-sm mt-1">
            {articles.length} article{articles.length !== 1 ? "s" : ""} · AI-summarized · updated daily
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-60 transition-colors"
        >
          {refreshing ? "⏳ Refreshing…" : "🔄 Refresh Feed"}
        </button>
      </div>

      {/* ── Filters ── */}
      <FilterBar topics={topics} filters={filters} onChange={setFilters} />

      {/* ── States ── */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-6 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <SkeletonGrid />
      ) : articles.length === 0 ? (
        <EmptyState onRefresh={handleRefresh} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
          {articles.map((a) => (
            <ArticleCard key={a.id} article={a} onUpdate={updateArticle} />
          ))}
        </div>
      )}
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl border border-slate-200 p-5 animate-pulse">
          <div className="h-4 bg-slate-200 rounded w-1/3 mb-3" />
          <div className="h-5 bg-slate-200 rounded w-full mb-2" />
          <div className="h-4 bg-slate-200 rounded w-5/6 mb-4" />
          <div className="space-y-2">
            <div className="h-3 bg-slate-100 rounded w-full" />
            <div className="h-3 bg-slate-100 rounded w-5/6" />
            <div className="h-3 bg-slate-100 rounded w-4/6" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ onRefresh }: { onRefresh: () => void }) {
  return (
    <div className="text-center py-20">
      <div className="text-5xl mb-4">📭</div>
      <h2 className="text-lg font-semibold text-slate-700 mb-2">No articles yet</h2>
      <p className="text-slate-500 text-sm mb-6">
        Add topics first, then click Refresh Feed to fetch articles.
      </p>
      <button
        onClick={onRefresh}
        className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
      >
        Refresh Now
      </button>
    </div>
  );
}
