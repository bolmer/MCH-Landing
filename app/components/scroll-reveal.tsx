"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

interface ScrollRevealProps {
	children: ReactNode;
	className?: string;
	delay?: number;
}

export function ScrollReveal({
	children,
	className = "",
	delay = 0,
}: ScrollRevealProps) {
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;

		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						el.classList.add("is-visible");
						observer.unobserve(el);
					}
				}
			},
			{ threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
		);

		observer.observe(el);

		return () => {
			observer.disconnect();
		};
	}, []);

	return (
		<div
			ref={ref}
			className={`scroll-reveal ${className}`}
			style={{ "--reveal-delay": `${delay}ms` } as React.CSSProperties}
		>
			{children}
		</div>
	);
}
