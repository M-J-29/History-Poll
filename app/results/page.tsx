"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { getEraTheme } from "@/lib/eras";
import { GenieCallout } from "@/components/Genie";

type Option = { id: string; label: string; order_index: number };
type Counts = Record<string, number>;

export default function ResultsPage() {
  const [options, setOptions] = useState<Option[]>([]);
  const [counts, setCounts] = useState<Counts>({});
  const [loading, setLoading] = useState(true);
  const [votedOrderIndex, setVotedOrderIndex] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("votedOrderIndex");
      if (stored) setVotedOrderIndex(Number(stored));
    }

    let channel: ReturnType<typeof supabase.channel> | null = null;

    async function load() {
      const { data: optionsData } = await supabase
        .from("poll_options")
        .select("id, label, order_index")
        .order("order_index", { ascending: true });

      const { data: votesData } = await supabase.from("votes").select("option_id");

      const initialCounts: Counts = {};
      (optionsData ?? []).forEach((o) => (initialCounts[o.id] = 0));
      (votesData ?? []).forEach((v) => {
        initialCounts[v.option_id] = (initialCounts[v.option_id] ?? 0) + 1;
      });

      setOptions(optionsData ?? []);
      setCounts(initialCounts);
      setLoading(false);

      channel = supabase
        .channel("votes-realtime")
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "votes" },
          (payload) => {
            const optionId = payload.new.option_id as string;
            setCounts((prev) => ({
              ...prev,
              [optionId]: (prev[optionId] ?? 0) + 1,
            }));
          }
        )
        .subscribe();
    }

    load();

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, []);

  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  const theme = getEraTheme(votedOrderIndex);
  const votedLabel = options.find((o) => o.order_index === votedOrderIndex)?.label;

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0b0b16]">
        <p className="text-xl text-yellow-200/80">Reading the smoke…</p>
      </main>
    );
  }

  return (
    <main
      className={`relative flex min-h-screen flex-col items-center gap-10 overflow-hidden px-4 py-14 transition-colors duration-700 ${theme.bgGradient}`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(0,0,0,0.15),_rgba(0,0,0,0.55))]" />

      <div className="relative flex flex-col items-center gap-2 text-center">
        <p className="font-serif text-sm uppercase tracking-[0.3em] text-yellow-300/80">
          {votedLabel ?? "Live Results"}
        </p>
        <h1 className="font-serif text-3xl font-bold text-yellow-50 sm:text-5xl">
          Live Results
        </h1>
      </div>

      {votedLabel && (
        <div className="relative">
          <GenieCallout message="Get your bags ready, we're going!" />
        </div>
      )}

      <div className="relative w-full max-w-2xl space-y-4 rounded-3xl border border-white/10 bg-black/30 p-6 backdrop-blur">
        {options.map((opt) => {
          const count = counts[opt.id] ?? 0;
          const pct = total > 0 ? Math.round((count / total) * 100) : 0;
          const isMine = opt.order_index === votedOrderIndex;
          return (
            <div key={opt.id} className={isMine ? "opacity-100" : "opacity-80"}>
              <div className="mb-1 flex justify-between text-base font-semibold text-yellow-50 sm:text-lg">
                <span className="flex items-center gap-2">
                  {opt.label}
                  {isMine && (
                    <span className="rounded-full bg-yellow-400/20 px-2 py-0.5 text-xs font-medium text-yellow-300">
                      your wish
                    </span>
                  )}
                </span>
                <span>
                  {pct}% ({count})
                </span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-yellow-400 to-yellow-200 transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <p className="relative font-serif text-sm text-yellow-100/70">
        {total} vote{total === 1 ? "" : "s"} so far
      </p>
    </main>
  );
}
