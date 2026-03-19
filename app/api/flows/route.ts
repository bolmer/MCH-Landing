import { NextResponse } from "next/server";

const API_BASE = process.env.API_URL || "http://localhost:8000";

/**
 * GET /api/flows
 * Proxy centralizado para el inventario consolidado de NiFi + Redshift + SLA
 */
export async function GET() {
	try {
		const res = await fetch(`${API_BASE}/api/nifi/flows`, {
			cache: "no-store", // Ensure real-time data
		});

		if (!res.ok) {
			return NextResponse.json(
				{ error: "Backend service not available" },
				{ status: res.status }
			);
		}

		const data = await res.json();
		return NextResponse.json(data);
	} catch (error) {
		console.error("API Proxy Error:", error);
		return NextResponse.json(
			{ error: "Could not sync with Backend Service" },
			{ status: 502 }
		);
	}
}
