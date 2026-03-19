"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface FilterChipProps {
	label: string;
	isActive?: boolean;
	onClick?: () => void;
	icon?: string;
	showToggle?: boolean;
}

export default function FilterChip({
	label,
	isActive,
	onClick,
	icon,
	showToggle,
}: FilterChipProps) {
	return (
		<button
			onClick={onClick}
			className={cn(
				"flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm font-medium",
				isActive
					? "bg-primary/10 border-primary/50 text-white"
					: "bg-[#232f48] border-transparent text-[#92a4c9] hover:border-primary/50 hover:text-white",
				"border shrink-0",
			)}
		>
			<span>{label}</span>
			{icon && (
				<span
					className="material-symbols-outlined text-[#92a4c9] group-hover:text-white"
					style={{ fontSize: "18px" }}
				>
					{icon}
				</span>
			)}
			{showToggle && (
				<span
					className={cn(
						"material-symbols-outlined",
						isActive ? "text-primary" : "text-[#92a4c9]",
					)}
					style={{ fontSize: "18px", fontVariationSettings: "'FILL' 1" }}
				>
					{isActive ? "toggle_on" : "toggle_off"}
				</span>
			)}
		</button>
	);
}
