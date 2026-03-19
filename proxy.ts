import { type NextRequest, NextResponse } from "next/server";

const LOCALE_COOKIE = "locale";
const SUPPORTED_LOCALES = ["es", "en"] as const;
type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

function parseAcceptLanguage(header: string | null): SupportedLocale {
	if (!header) return "en";
	const preferred = header
		.split(",")
		.map((part) => part.trim().split(";")[0]?.trim().toLowerCase() ?? "")
		.find((lang) => lang.startsWith("es") || lang.startsWith("en"));
	if (preferred?.startsWith("es")) return "es";
	return "en";
}

export function proxy(request: NextRequest) {
	const existing = request.cookies.get(LOCALE_COOKIE)?.value;

	// If cookie exists and is valid, do nothing
	if (
		existing &&
		SUPPORTED_LOCALES.includes(existing as SupportedLocale)
	) {
		return NextResponse.next();
	}

	// First visit: detect from Accept-Language header, set cookie
	const detected = parseAcceptLanguage(
		request.headers.get("accept-language"),
	);
	const response = NextResponse.next();
	response.cookies.set(LOCALE_COOKIE, detected, {
		path: "/",
		maxAge: 60 * 60 * 24 * 365, // 1 year
		sameSite: "lax",
	});
	return response;
}

export const config = {
	matcher: [
		// Run on landing page and dashboard, skip static assets and API
		"/((?!api|_next/static|_next/image|favicon.ico).*)",
	],
};
