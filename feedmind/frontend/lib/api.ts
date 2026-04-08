const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface Topic {
  id: number;
  name: string;
  created_at: string;
}

export interface Article {
  id: number;
  title: string;
  link: string;
  source: string | null;
  topic: string;
  summary: string | null;
  difficulty: "beginner" | "intermediate" | "advanced" | null;
  why_it_matters: string | null;
  is_read: boolean;
  is_bookmarked: boolean;
  fetched_at: string;
  published_at: string | null;
}

export interface ExplanationSection {
  heading: string;
  content: string;
}

export interface VideoResult {
  title: string;
  videoId: string;
  thumbnail: string;
  url: string;
  duration?: string;
}

export interface ArticleResult {
  title: string;
  link: string;
  source: string | null;
}

export interface ChatResponse {
  id: number;
  query: string;
  explanation: string;
  sections: ExplanationSection[];
  key_points: string[];
  difficulty: string;
  why_it_matters: string;
  videos: VideoResult[];
  articles: ArticleResult[];
  created_at: string;
  cached: boolean;
}

export interface ChatHistoryItem {
  id: number;
  query: string;
  explanation: string | null;
  sections: ExplanationSection[];
  key_points: string[];
  difficulty: string | null;
  why_it_matters: string | null;
  videos: VideoResult[];
  articles: ArticleResult[];
  created_at: string;
}

// Topics
export async function getTopics(): Promise<Topic[]> {
  const res = await fetch(`${API_URL}/topics/`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch topics");
  return res.json();
}

export async function createTopic(name: string): Promise<Topic> {
  const res = await fetch(`${API_URL}/topics/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { detail?: string }).detail || "Failed to create topic");
  }
  return res.json();
}

export async function deleteTopic(id: number): Promise<void> {
  await fetch(`${API_URL}/topics/${id}`, { method: "DELETE" });
}

// Feed
export interface FeedFilters {
  topic?: string;
  difficulty?: string;
  unread_only?: boolean;
  bookmarked?: boolean;
}

export async function getFeed(filters: FeedFilters = {}): Promise<Article[]> {
  const params = new URLSearchParams();
  if (filters.topic) params.set("topic", filters.topic);
  if (filters.difficulty) params.set("difficulty", filters.difficulty);
  if (filters.unread_only) params.set("unread_only", "true");
  if (filters.bookmarked) params.set("bookmarked", "true");
  const res = await fetch(`${API_URL}/feed/?${params.toString()}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch feed");
  return res.json();
}

export async function refreshFeed(): Promise<void> {
  await fetch(`${API_URL}/feed/refresh`, { method: "POST" });
}

export async function markRead(id: number): Promise<Article> {
  const res = await fetch(`${API_URL}/feed/${id}/read`, { method: "PATCH" });
  if (!res.ok) throw new Error("Failed to mark as read");
  return res.json();
}

export async function toggleBookmark(id: number): Promise<Article> {
  const res = await fetch(`${API_URL}/feed/${id}/bookmark`, { method: "PATCH" });
  if (!res.ok) throw new Error("Failed to toggle bookmark");
  return res.json();
}

// Chat
export async function sendChatQuery(
  query: string,
  difficulty_mode = "auto"
): Promise<ChatResponse> {
  const res = await fetch(`${API_URL}/chat/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, difficulty_mode }),
  });
  if (!res.ok) throw new Error("Chat request failed");
  return res.json();
}

// History
export async function getHistory(limit = 20): Promise<ChatHistoryItem[]> {
  const res = await fetch(`${API_URL}/history/?limit=${limit}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch history");
  return res.json();
}

export async function deleteHistoryEntry(id: number): Promise<void> {
  await fetch(`${API_URL}/history/${id}`, { method: "DELETE" });
}
