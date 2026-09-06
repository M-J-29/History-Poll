"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { getEraTheme, GenieLampIcon } from "@/lib/eras";

type Option = { id: string; label: string; order_index: number };

export default function VotePage() {
  const router = useRouter();
  const [options, setOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("hasVoted")) {
      router.replace("/results");
      return;
    }

    supabase
      .from("poll_options")
      .select("id, label, order_index")
      .order("order_index", { ascending: true })
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else setOptions(data ?? []);
        setLoading(false);
      });
  }, [router]);

  async function vote(option: Option) {
    setSubmitting(true);
    const { error } = await supabase.from("votes").insert({ option_id: option.id });
    if (error) {
      setError(error.message);
      setSubmitting(false);
      return;
    }
    localStorage.setItem("hasVoted", "true");
    localStorage.setItem("votedOrderIndex", String(option.order_index));
    router.push("/results");
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0b0b16]">
        <p className="text-xl text-yellow-200/80">Summoning the genie…</p>
      </main>
    );
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center gap-10 overflow-hidden bg-[#0b0b16] px-4 py-14">
      {/* faint gold vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(234,179,8,0.12),_transparent_60%)]" />

      <div className="relative flex flex-col items-center gap-3 text-center">
        <GenieLampIcon className="h-14 w-14 text-yellow-400" />
        <p className="font-serif text-sm uppercase tracking-[0.3em] text-yellow-400/80">
          Make your wish
        </p>
        <h1 className="font-serif text-3xl font-bold leading-tight text-yellow-50 sm:text-5xl">
          If you could travel back to any time period,
        </h1>
        <p className="font-serif text-3xl font-bold leading-tight text-yellow-50 sm:text-5xl">
          which would you pick?
        </p>
      </div>

      {error && (
        <p className="relative rounded bg-red-900/60 px-4 py-2 text-red-200">{error}</p>
      )}

      <div className="relative grid w-full max-w-3xl grid-cols-1 gap-5 sm:grid-cols-2">
        {options.map((opt) => {
          const theme = getEraTheme(opt.order_index);
          const Icon = theme.Icon;
          return (
            <button
              key={opt.id}
              disabled={submitting}
              onClick={() => vote(opt)}
              className={`group flex items-center gap-4 rounded-2xl border ${theme.cardBorder} bg-white/[0.04] px-6 py-6 text-left backdrop-blur transition hover:bg-white/[0.08] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 ${theme.glow}`}
            >
              <Icon className={`h-10 w-10 shrink-0 ${theme.accentText}`} />
              <span className="font-serif text-lg font-semibold text-yellow-50 sm:text-xl">
                {opt.label}
              </span>
            </button>
          );
        })}
      </div>

      <p className="relative font-serif text-sm text-yellow-200/50">
        One wish per person — choose carefully.
      </p>
    </main>
  );
}
