"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type ProjectRow = {
  id: string;
  title: string | null;
  mode: string | null;
  content_kind: string | null;
  form_json: any | null;
  output_text: string | null;
  profile_id?: string | null;
  created_at: string | null;
};

export default function ProjectDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [project, setProject] = useState<ProjectRow | null>(null);
  const [editableText, setEditableText] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const projectId = params.id;

  useEffect(() => {
    async function load() {
      setError(null);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      const { data, error } = await supabase
        .from("content_projects")
        .select("id, title, mode, content_kind, form_json, output_text, created_at")
        .eq("id", projectId)
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Load project error:", error);
        setError(error.message);
      } else if (!data) {
        setError("Project not found or you don't have access.");
      } else {
        setProject((data as any) as ProjectRow);
        setEditableText((data as any).output_text || "");
      }

      setLoading(false);
    }

    if (projectId) {
      load();
    }
  }, [projectId, router]);

  async function handleSave() {
    if (!project) return;
    setSaving(true);
    setMessage(null);
    setError(null);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("Please log in again.");
        setSaving(false);
        return;
      }

      const { error } = await supabase
        .from("content_projects")
        // @ts-expect-error - suppress Supabase typing mismatch
        .update({
          output_text: editableText,
        } as any)
        .eq("id", project.id)
        .eq("user_id", user.id);

      if (error) {
        console.error("Update project error:", error);
        setError(error.message);
      } else {
        setMessage("Saved ✅");
      }
    } catch (err: any) {
      console.error("Update project catch:", err);
      setError(err.message ?? "Unknown error");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-600">
        Loading project...
      </main>
    );
  }

  if (!project) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-600">
        <div className="rounded-xl border border-slate-200 bg-white px-6 py-4 text-sm">
          <p className="mb-3">
            Project not found or you don&apos;t have permission to view it.
          </p>
          <Link
            href="/dashboard"
            className="rounded-md bg-sky-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-sky-400"
          >
            Back to dashboard
          </Link>
        </div>
      </main>
    );
  }

  const title =
    project.title && project.title.trim().length > 0
      ? project.title
      : "Untitled content";

  const created =
    project.created_at &&
    new Date(project.created_at).toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const kindLabel = (() => {
    switch (project.content_kind) {
      case "business_post":
        return "Business · Post";
      case "business_video":
        return "Business · Video";
      case "creator_post":
        return "Creator · Post";
      case "creator_video":
        return "Creator · Video";
      default:
        return "Content";
    }
  })();

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-4xl px-6 py-8">
        {/* Header */}
        <header className="mb-4 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs text-slate-500">{kindLabel}</p>
            <h1 className="truncate text-xl font-semibold">{title}</h1>
            {created && (
              <p className="mt-0.5 text-xs text-slate-400">Created {created}</p>
            )}
          </div>
          <div className="flex gap-2 text-xs">
            <Link
              href="/dashboard"
              className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-slate-700 hover:bg-slate-50"
            >
              ← Back to dashboard
            </Link>
            {project ? (
              <Link
                href={`/studio?profileId=${project.profile_id ?? ""}&projectId=${project.id}`}
                className="rounded-md bg-sky-500 px-3 py-1.5 font-semibold text-white hover:bg-sky-400"
              >
                Open in Studio
              </Link>
            ) : (
              <Link
                href="/studio"
                className="rounded-md bg-sky-500 px-3 py-1.5 font-semibold text-white hover:bg-sky-400"
              >
                New content
              </Link>
            )}
          </div>
        </header>

        {/* Generated content editor */}
        <section className="rounded-2xl border border-slate-200 bg-white p-4 text-sm">
          <label
            htmlFor="project-output"
            className="mb-2 block text-xs font-semibold text-slate-700"
          >
            Generated content (you can edit here, it will be saved in this
            project)
          </label>
          <textarea
            id="project-output"
            className="h-72 w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs leading-relaxed"
            value={editableText}
            onChange={(e) => setEditableText(e.target.value)}
          />

          <div className="mt-3 flex items-center justify-between gap-3">
            <div className="text-xs">
              {message && (
                <p className="text-emerald-600" aria-live="polite">
                  {message}
                </p>
              )}
              {error && (
                <p className="text-rose-600" aria-live="polite">
                  {error}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="rounded-md bg-sky-500 px-4 py-1.5 text-xs font-semibold text-white hover:bg-sky-400 disabled:bg-slate-300"
            >
              {saving ? "Saving..." : "Save changes"}
            </button>
          </div>
        </section>

        {/* Optional: show raw form_json for debug / future UI */}
        {project.form_json && (
          <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 text-xs text-slate-600">
            <p className="mb-1 font-semibold text-slate-700">
              Original form data (for future features)
            </p>
            <pre className="max-h-40 overflow-auto whitespace-pre-wrap break-words">
              {JSON.stringify(project.form_json, null, 2)}
            </pre>
          </section>
        )}
      </div>
    </main>
  );
}
