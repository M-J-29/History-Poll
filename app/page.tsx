"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
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
    <main className="relative min-h-screen overflow-hidden bg-[#0b0b16]">
      {/* Historical collage — fixed, fills viewport, sits behind everything */}
      <div className="pointer-events-none fixed inset-0 -z-30" aria-hidden="true">
        <Image
          src="/history-collage.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      {/* Central dark mask so the poll always stays readable — soft radial, not a box */}
      <div
        className="pointer-events-none fixed inset-0 -z-20"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 60% 65% at 50% 50%, rgba(8,8,17,0.94) 0%, rgba(8,8,17,0.86) 25%, rgba(8,8,17,0.55) 48%, rgba(8,8,17,0.18) 70%, rgba(8,8,17,0.02) 100%)",
        }}
      />

      {/* Edge vignette to integrate the art into the dark page */}
      <div
        className="pointer-events-none fixed inset-0 -z-10 shadow-[inset_0_0_160px_45px_rgba(3,3,9,0.55)]"
        aria-hidden="true"
      />

      <div className="relative z-10 flex min-h-screen flex-col items-center gap-10 px-4 py-14">
        <div className="flex flex-col items-center gap-3 text-center">
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
          <p className="rounded bg-red-900/60 px-4 py-2 text-red-200">{error}</p>
        )}

        <div className="grid w-full max-w-3xl grid-cols-1 gap-5 sm:grid-cols-2">
          {options.map((opt) => {
            const theme = getEraTheme(opt.order_index);
            const Icon = theme.Icon;
            return (
              <button
                key={opt.id}
                disabled={submitting}
                onClick={() => vote(opt)}
                className={`group flex items-center gap-4 rounded-2xl border ${theme.cardBorder} bg-black/70 px-6 py-6 text-left backdrop-blur-sm transition hover:bg-black/60 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 ${theme.glow}`}
              >
                <Icon className={`h-10 w-10 shrink-0 ${theme.accentText}`} />
                <span className="font-serif text-lg font-semibold text-yellow-50 sm:text-xl">
                  {opt.label}
                </span>
              </button>
            );
          })}
        </div>

        <p className="font-serif text-sm text-yellow-200/60">
          One wish per person — choose carefully.
        </p>
      </div>
    </main>
  );
}
