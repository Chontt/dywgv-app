import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
    try {
        // Select one row, but we really want the columns.
        // Supabase JS doesn't give schema directly easily.
        // But if we select * and get data, we see keys.
        const { data, error } = await supabase
            .from("brand_profiles")
            .select("*")
            .limit(1);

        return NextResponse.json({
            data,
            error,
            implied_columns: data && data.length > 0 ? Object.keys(data[0]) : "No rows found"
        });
    } catch (e: any) {
        return NextResponse.json({ error: e.message });
    }
}
