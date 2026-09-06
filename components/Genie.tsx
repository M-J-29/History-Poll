export function GenieCallout({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-end sm:gap-6">
      <svg
        viewBox="0 0 120 160"
        className="h-32 w-auto drop-shadow-[0_0_25px_rgba(250,204,21,0.35)] sm:h-40"
      >
        <defs>
          <linearGradient id="genieBody" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#1d4ed8" />
          </linearGradient>
        </defs>
        {/* smoke trail / body */}
        <path
          d="M60 150 C30 150 20 130 30 112 C15 108 12 90 24 78 C14 70 16 50 34 44 C30 28 46 12 62 18 C74 6 96 12 96 30 C108 30 114 46 104 58 C112 68 108 84 96 88 C100 100 92 112 80 112 C82 128 76 150 60 150 Z"
          fill="url(#genieBody)"
        />
        {/* face */}
        <circle cx="63" cy="34" r="3" fill="#0b1e3d" />
        <circle cx="78" cy="34" r="3" fill="#0b1e3d" />
        <path d="M62 44 Q70 50 79 44" stroke="#0b1e3d" strokeWidth="3" fill="none" strokeLinecap="round" />
        {/* arms crossed */}
        <path d="M40 90 Q55 78 70 88" stroke="#1d4ed8" strokeWidth="6" fill="none" strokeLinecap="round" />
        <path d="M90 90 Q75 78 60 88" stroke="#1d4ed8" strokeWidth="6" fill="none" strokeLinecap="round" />
        {/* gold cuffs */}
        <circle cx="40" cy="90" r="5" fill="#facc15" />
        <circle cx="90" cy="90" r="5" fill="#facc15" />
      </svg>

      <div className="relative max-w-xs rounded-2xl border border-yellow-400/40 bg-slate-950/80 px-5 py-4 text-center shadow-xl sm:text-left">
        <p className="font-serif text-lg font-semibold text-yellow-200 sm:text-xl">
          &ldquo;{message}&rdquo;
        </p>
        <div className="absolute -bottom-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 border-b border-r border-yellow-400/40 bg-slate-950/80 sm:hidden" />
      </div>
    </div>
  );
}
