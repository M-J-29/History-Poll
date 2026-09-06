"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Option = { id: string; label: string; order_index: number };
type Counts = Record<string, number>;

export default function ResultsPage() {
  const [options, setOptions] = useState<Option[]>([]);
  const [counts, setCounts] = useState<Counts>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-xl">Loading…</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center gap-8 px-4 py-12">
      <h1 className="text-center text-3xl sm:text-5xl font-extrabold drop-shadow-sm">
        Live Results
      </h1>

      <div className="w-full max-w-2xl space-y-4">
        {options.map((opt) => {
          const count = counts[opt.id] ?? 0;
          const pct = total > 0 ? Math.round((count / total) * 100) : 0;
          return (
            <div key={opt.id} className="rounded-xl bg-white/10 p-4">
              <div className="mb-1 flex justify-between text-lg font-semibold">
                <span>{opt.label}</span>
                <span>
                  {pct}% ({count})
                </span>
              </div>
              <div className="h-4 w-full overflow-hidden rounded-full bg-white/20">
                <div
                  className="h-full rounded-full bg-yellow-300 transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-white/80">
        {total} vote{total === 1 ? "" : "s"} so far
      </p>
    </main>
  );
}
