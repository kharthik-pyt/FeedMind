import { VideoResult } from "@/lib/api";

interface Props {
  video: VideoResult;
}

export default function VideoCard({ video }: Props) {
  const isEmbed = Boolean(video.videoId);

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
      {isEmbed ? (
        <div className="relative aspect-video bg-slate-100">
          <iframe
            src={`https://www.youtube.com/embed/${video.videoId}`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        </div>
      ) : (
        /* Fallback — no API key — show thumbnail/search link */
        <a
          href={video.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block relative aspect-video bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center group"
        >
          <div className="text-center text-white">
            <div className="text-5xl mb-2 group-hover:scale-110 transition-transform">▶</div>
            <p className="text-xs font-medium opacity-80">Search on YouTube</p>
          </div>
        </a>
      )}

      <div className="p-3">
        <a
          href={video.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-slate-800 hover:text-blue-600 line-clamp-2 transition-colors"
        >
          {video.title}
        </a>
        {video.duration && (
          <span className="mt-1 inline-block text-xs text-slate-400">⏱ {video.duration}</span>
        )}
      </div>
    </div>
  );
}
