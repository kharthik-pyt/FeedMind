import { ChatResponse, ExplanationSection } from "@/lib/api";
import DifficultyBadge from "./DifficultyBadge";

interface Props {
  data: ChatResponse;
}

export default function ExplanationCard({ data }: Props) {
  return (
    <div className="space-y-6">
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <DifficultyBadge difficulty={data.difficulty} />
        {data.cached && (
          <span className="text-xs bg-slate-700 text-slate-400 px-2 py-0.5 rounded-full">
            cached
          </span>
        )}
      </div>

      {/* ── Intro explanation ──────────────────────────────── */}
      {data.explanation && (
        <p className="text-slate-200 leading-relaxed text-base">{data.explanation}</p>
      )}

      {/* ── Rich sections ──────────────────────────────────── */}
      {data.sections && data.sections.length > 0 && (
        <div className="space-y-4">
          {data.sections.map((section: ExplanationSection, i: number) => (
            <SectionBlock key={i} section={section} />
          ))}
        </div>
      )}

      {/* ── Key points ─────────────────────────────────────── */}
      {data.key_points && data.key_points.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
            📌 Key Takeaways
          </h3>
          <ul className="space-y-2">
            {data.key_points.map((point, i) => (
              <li key={i} className="flex gap-3 text-slate-300 text-sm leading-relaxed">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-600/30 border border-indigo-500/50 text-indigo-300 text-xs flex items-center justify-center font-bold">
                  {i + 1}
                </span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── Why it matters ─────────────────────────────────── */}
      {data.why_it_matters && (
        <div className="flex gap-3 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
          <span className="text-xl flex-shrink-0">💡</span>
          <div>
            <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
              Why it matters
            </p>
            <p className="text-amber-100 text-sm leading-relaxed">{data.why_it_matters}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function SectionBlock({ section }: { section: ExplanationSection }) {
  const iconMap: Record<string, string> = {
    "What is it?": "🔍",
    "How does it work?": "⚙️",
    "Key features & real-world use cases": "🚀",
    "Common mistakes & things to watch out for": "⚠️",
  };
  const icon = iconMap[section.heading] ?? "📖";

  return (
    <div className="border border-slate-700/60 rounded-xl p-4 bg-slate-800/40">
      <h3 className="flex items-center gap-2 text-slate-200 font-semibold text-sm mb-2">
        <span>{icon}</span>
        {section.heading}
      </h3>
      <p className="text-slate-300 text-sm leading-relaxed">{section.content}</p>
    </div>
  );
}
