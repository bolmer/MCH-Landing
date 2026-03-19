"use client";

import { useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import type { Locale } from "@/app/i18n";

export function LanguageToggle({ current }: { current: Locale }) {
	const router = useRouter();
	const pathname = usePathname();
	const [isPending, startTransition] = useTransition();

	const toggleLanguage = () => {
		const nextLocale = current === "en" ? "es" : "en";
		
		// Set cookie
		document.cookie = `locale=${nextLocale}; path=/; max-age=31536000; SameSite=Lax`;
		
		// Refresh router to apply new translation
		startTransition(() => {
			router.refresh();
		});
	};

	return (
		<button
			onClick={toggleLanguage}
			disabled={isPending}
			className="flex items-center gap-1.5 rounded-full border border-crust-light/30 bg-crumb-2/80 px-4 py-2 text-xs font-semibold text-crust-toasted backdrop-blur transition-colors hover:border-crust-golden/40 hover:text-crust-dark disabled:opacity-50"
			aria-label="Toggle language"
		>
			<span className={current === "es" ? "text-crust-dark font-bold" : "text-crust-toasted/70"}>
				ES
			</span>
			<span className="text-crust-light/50">/</span>
			<span className={current === "en" ? "text-crust-dark font-bold" : "text-crust-toasted/70"}>
				EN
			</span>
		</button>
	);
}
