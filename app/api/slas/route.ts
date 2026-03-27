import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

/**
 * GET /api/slas
 * Retorna el catálogo de SLAs desde reports/sla_catalog.json
 */

export async function GET() {
	try {
		const slaPath = path.join(
			process.cwd(),
			"..",
			"reports",
			"sla_catalog.json",
		);

		if (!fs.existsSync(slaPath)) {
			return NextResponse.json(
				{ error: "SLA catalog not found. Run learn_behavior.py first." },
				{ status: 404 },
			);
		}

		const data = fs.readFileSync(slaPath, "utf-8");
		const slaCatalog = JSON.parse(data);

		return NextResponse.json(slaCatalog);
	} catch (error) {
		console.error("Error reading SLA catalog:", error);
		return NextResponse.json(
			{ error: "Failed to load SLA catalog" },
			{ status: 500 },
		);
	}
}
