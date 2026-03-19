import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

/**
 * GET /api/baselines
 * Retorna los baselines calculados desde reports/baselines.json
 */
export const revalidate = 0;

export async function GET() {
	try {
		const baselinesPath = path.join(
			process.cwd(),
			"..",
			"reports",
			"baselines.json",
		);

		if (!fs.existsSync(baselinesPath)) {
			return NextResponse.json(
				{ error: "Baselines not found. Run calculate_baselines.py first." },
				{ status: 404 },
			);
		}

		const data = fs.readFileSync(baselinesPath, "utf-8");
		const baselines = JSON.parse(data);

		return NextResponse.json(baselines);
	} catch (error) {
		console.error("Error reading baselines:", error);
		return NextResponse.json(
			{ error: "Failed to load baselines" },
			{ status: 500 },
		);
	}
}
