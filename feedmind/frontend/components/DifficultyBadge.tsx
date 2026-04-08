const DIFFICULTY_CONFIG = {
  beginner: {
    label: "Beginner",
    className: "bg-green-100 text-green-700 border-green-200",
  },
  intermediate: {
    label: "Intermediate",
    className: "bg-yellow-100 text-yellow-700 border-yellow-200",
  },
  advanced: {
    label: "Advanced",
    className: "bg-red-100 text-red-700 border-red-200",
  },
};

interface Props {
  level: string;
}

export default function DifficultyBadge({ level }: Props) {
  const config =
    DIFFICULTY_CONFIG[level as keyof typeof DIFFICULTY_CONFIG] ??
    DIFFICULTY_CONFIG.intermediate;

  return (
    <span
      className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${config.className}`}
    >
      {config.label}
    </span>
  );
}
