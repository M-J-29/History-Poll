"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

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

  async function vote(optionId: string) {
    setSubmitting(true);
    const { error } = await supabase.from("votes").insert({ option_id: optionId });
    if (error) {
      setError(error.message);
      setSubmitting(false);
      return;
    }
    localStorage.setItem("hasVoted", "true");
    router.push("/results");
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-xl">Loading…</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 px-4 py-12">
      <div className="text-center">
        <h1 className="text-3xl sm:text-5xl font-extrabold drop-shadow-sm">
          If you could travel back to any time period,
        </h1>
        <p className="mt-2 text-3xl sm:text-5xl font-extrabold drop-shadow-sm">
          which would you pick?
        </p>
      </div>

      {error && (
        <p className="rounded bg-red-500/80 px-4 py-2">{error}</p>
      )}

      <div className="grid w-full max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2">
        {options.map((opt) => (
          <button
            key={opt.id}
            disabled={submitting}
            onClick={() => vote(opt.id)}
            className="rounded-2xl bg-white/95 px-6 py-6 text-xl font-bold text-indigo-700 shadow-lg transition hover:scale-105 hover:bg-white active:scale-95 disabled:opacity-50"
          >
            {opt.label}
          </button>
        ))}
      </div>
    </main>
  );
}
