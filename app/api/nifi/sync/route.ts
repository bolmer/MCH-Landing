import { NextResponse } from "next/server";

const API_BASE = process.env.API_URL || "http://localhost:8000";

export async function POST() {
    try {
        const res = await fetch(`${API_BASE}/api/nifi/backup/async`, {
            method: "POST",
        });

        if (!res.ok) {
            const error = await res.json();
            return NextResponse.json(error, { status: res.status });
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Sync Error:", error);
        return NextResponse.json(
            { error: "Could not contact backend" },
            { status: 502 }
        );
    }
}
