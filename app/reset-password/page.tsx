"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { resetPasswordAction } from "@/app/actions/security";

export default function ResetPasswordPage() {
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const result = await resetPasswordAction(password);

            if (!result.success) {
                throw new Error(result.message);
            }

            // Success -> Redirect to dashboard
            router.push("/dashboard");
        } catch (err: any) {
            setError(err.message ?? "Failed to reset password");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-slate-900 rounded-2xl shadow-xl border border-slate-800 p-6">
                <h1 className="text-2xl font-bold text-slate-50 mb-2 text-center">
                    Security Alert
                </h1>
                <p className="text-rose-400 text-center mb-6 text-sm bg-rose-950/30 p-3 rounded-lg border border-rose-900/50">
                    Your account has been flagged for a security update. Please set a new, secure password to continue.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-sm text-slate-300">New Password</label>
                        <input
                            type="password"
                            required
                            minLength={8}
                            className="w-full rounded-md bg-slate-950 border border-slate-700 px-3 py-2 text-sm text-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Min 8 characters"
                        />
                    </div>

                    {error && (
                        <p className="text-sm text-rose-400 bg-rose-950/40 border border-rose-900 rounded-md px-3 py-2">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-2 rounded-md bg-sky-500 hover:bg-sky-400 disabled:bg-sky-700 text-slate-950 font-semibold py-2 text-sm transition"
                    >
                        {loading ? "Updating..." : "Update Password & Continue"}
                    </button>
                </form>
            </div>
        </main>
    );
}
