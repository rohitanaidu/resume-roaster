"use client";

interface Props {
  roast: string;
  onReset: () => void;
}

export default function RoastDisplay({ roast, onReset }: Props) {
  const paragraphs = roast.split(/\n+/).filter(Boolean);

  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-2xl overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-3 bg-[#ff6b6b]/10 border-b border-[#ff6b6b]/20">
        <span className="text-lg" aria-hidden="true">🔥</span>
        <span className="font-bold text-[#ff6b6b] text-sm tracking-wide uppercase">
          Your Roast
        </span>
      </div>

      <div className="px-5 py-5 space-y-3">
        {paragraphs.map((p, i) => (
          <p key={i} className="text-zinc-200 text-sm leading-7">
            {p}
          </p>
        ))}
      </div>

      <div className="px-5 pb-5">
        <button
          onClick={onReset}
          className="w-full py-3 rounded-xl border border-zinc-600 text-zinc-400 text-sm font-medium hover:border-zinc-400 hover:text-white transition-colors"
        >
          Roast another resume
        </button>
      </div>
    </div>
  );
}
