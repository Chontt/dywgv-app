import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import Translated from '@/app/components/Translated';
import { redirect } from "next/navigation";

export default async function AdminSecurityPage() {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // In a real app, you'd check for specific admin role/claims here.
    // For now, we assume this page is protected by obscurity or only accessible to authorized users (like yourself).
    // const isAdmin = user.app_metadata?.role === 'admin';
    // if (!isAdmin) redirect("/dashboard");

    const { data: logs, error } = await supabase
        .from("auth_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);

    return (
            <main className="min-h-screen bg-slate-950 text-slate-50 p-6">
                <h1 className="text-2xl font-bold mb-4"><Translated k="admin_security_logs_title">Security Logs (Admin)</Translated></h1>
                <p className="text-sm text-slate-400 mb-6"><Translated k="admin_security_logs_subtitle">Recent security events and flagged activities.</Translated></p>

            <div className="overflow-x-auto rounded-lg border border-slate-800">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-900 border-b border-slate-800 text-slate-300">
                        <tr>
                            <th className="p-3"><Translated k="table_time">Time</Translated></th>
                            <th className="p-3"><Translated k="table_event">Event</Translated></th>
                            <th className="p-3"><Translated k="table_user_id">User ID</Translated></th>
                            <th className="p-3"><Translated k="table_details">Details</Translated></th>
                            <th className="p-3"><Translated k="table_ip">IP</Translated></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {error && (
                            <tr>
                                <td colSpan={5} className="p-4 text-rose-400 text-center">
                                    <Translated k="admin_failed_load_logs">Failed to load logs: {error.message} (Is RLS configured?)</Translated>
                                </td>
                            </tr>
                        )}
                        {!error && logs?.length === 0 && (
                            <tr>
                                <td colSpan={5} className="p-4 text-slate-500 text-center">
                                    <Translated k="admin_no_logs">No logs found.</Translated>
                                </td>
                            </tr>
                        )}
                        {logs?.map((log) => (
                            <tr key={log.id} className="hover:bg-slate-900/50">
                                <td className="p-3 whitespace-nowrap text-slate-400">
                                    {new Date(log.created_at).toLocaleString()}
                                </td>
                                <td className="p-3 font-mono text-emerald-400 font-semibold">{log.event}</td>
                                <td className="p-3 font-mono text-xs text-slate-500">{log.user_id || "-"}</td>
                                <td className="p-3 max-w-xs truncate text-slate-400" title={JSON.stringify(log.detail)}>
                                    {JSON.stringify(log.detail)}
                                </td>
                                <td className="p-3 text-xs text-slate-500">{log.ip || "-"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </main>
    );
}
