"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";

type TryForm = {
  business_type: string;
  main_platform: string;
  goal: string;
};

export default function TryPage() {
  const { t } = useI18n();
  const [form, setForm] = useState<TryForm>({
    business_type: "",
    main_platform: "",
    goal: "",
  });
  const [freeCount, setFreeCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState<string | null>(null);

  // どれくらい無料で使ったか localStorage から読む
  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = window.localStorage.getItem("cb_free_generations");
    if (raw) {
      setFreeCount(parseInt(raw, 10) || 0);
    }
  }, []);

  const maxFree = 2;
  const remaining = Math.max(0, maxFree - freeCount);
  const reachedLimit = freeCount >= maxFree;

  function updateField<K extends keyof TryForm>(key: K, value: string) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  async function handleGenerate() {
    setError(null);
    setResult("");

    if (reachedLimit) {
      setError(`${t("try_free_used_prefix")} ${maxFree} ${t("try_free_used_suffix")}`);
      return;
    }

    if (!form.business_type || !form.main_platform) {
      setError(t("try_fill_business_platform"));
      return;
    }

    setLoading(true);

    try {
      // ゲスト用の簡易プロフィールを作る
      const profile = {
        business_name: "Guest brand",
        business_type: form.business_type,
        main_platform: form.main_platform,
        target_audience: "",
        tone: "",
        main_language: "EN",
        monthly_goal: form.goal,
      };

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile }),
      });

      const textBody = await res.text();
      let data: any;

      try {
        data = JSON.parse(textBody);
      } catch {
        throw new Error("Invalid JSON from API: " + textBody);
      }

      if (!res.ok) {
        throw new Error(data.error || "API error");
      }

      setResult(data.text || "");

      // カウントを1増やす
      const nextCount = freeCount + 1;
      setFreeCount(nextCount);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(
          "cb_free_generations",
          String(nextCount)
        );
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.message ?? "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="text-2xl font-bold mb-2">{t("try_title")}</h1>
        <p className="text-sm text-slate-300 mb-4">{t("try_desc")}</p>

        <div className="mb-4 text-sm text-slate-400">
          {t("try_free_label")} {" "}
          <span className="font-semibold text-slate-100">
            {freeCount} / {maxFree}
          </span>{" "}
          {remaining > 0 ? `( ${remaining} left )` : t("try_free_used_suffix")}
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-base mb-1 text-slate-200">
              {t("try_label_business")}
            </label>
            <input
              className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-base"
              placeholder={t("try_business_placeholder")}
              value={form.business_type}
              onChange={e => updateField("business_type", e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="main_platform" className="block text-base mb-1 text-slate-200">
              {t("try_main_platform_label")}
            </label>
            <select
              id="main_platform"
              name="main_platform"
              className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-base"
              value={form.main_platform}
              onChange={(e) => updateField("main_platform", e.target.value)}
            >

              <option value="">{t("try_select_one")}</option>
              <option value="instagram">Instagram</option>
              <option value="tiktok">TikTok</option>
              <option value="youtube">YouTube / Shorts</option>
              <option value="facebook">Facebook</option>
              <option value="x">X (Twitter)</option>
              <option value="multi">Multiple platforms</option>
            </select>
          </div>

          <div>
            <label className="block text-base mb-1 text-slate-200">
              {t("try_goal_label")}
            </label>
            <input
              className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-base"
              placeholder={t("try_goal_placeholder")}
              value={form.goal}
              onChange={e => updateField("goal", e.target.value)}
            />
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-md border border-rose-900 bg-rose-950/40 px-3 py-2 text-xs text-rose-200">
            {error}
          </div>
        )}

        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={handleGenerate}
            disabled={loading || reachedLimit}
            className="inline-flex items-center justify-center rounded-lg bg-sky-500 px-4 py-2 text-base font-semibold text-slate-950 disabled:bg-slate-700 disabled:text-slate-300"
          >
            {reachedLimit
              ? t("try_generate_limit")
              : loading
                ? t("try_generating")
                : t("try_generate_btn")}
          </button>

          <a
            href="/login?mode=signup"
            className="inline-flex items-center justify-center rounded-lg border border-slate-700 bg-slate-900/70 px-4 py-2 text-base text-slate-100 hover:border-slate-500 hover:bg-slate-800/80"
          >
            {t("try_create_account")}
          </a>

          <a
            href="/plans"
            className="inline-flex items-center justify-center rounded-lg border border-slate-700 bg-slate-900/70 px-4 py-2 text-base text-slate-100 hover:border-slate-500 hover:bg-slate-800/80"
          >
            {t("try_view_plans")}
          </a>
        </div>

        {result && (
          <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-4 text-base whitespace-pre-wrap">
            {result}
          </div>
        )}
      </div>
    </main>
  );
}
