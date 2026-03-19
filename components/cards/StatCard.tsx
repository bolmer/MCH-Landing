"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
	title: string;
	value: string;
	change: string;
	changeType: "up" | "down" | "stable";
	icon: string;
	iconBgColor: string;
	iconTextColor: string;
	subtitle?: string;
	description?: string; // New prop for detailed tooltip
}

export default function StatCard({
	title,
	value,
	change,
	changeType,
	icon,
	iconBgColor,
	iconTextColor,
	subtitle,
	description,
}: StatCardProps) {
	return (
		<div className="bg-white dark:bg-[#1E293B] p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
			<div className="flex justify-between items-start mb-4">
				<div className={cn("p-2 rounded-lg", iconBgColor, iconTextColor)}>
					<span className="material-symbols-outlined">{icon}</span>
				</div>
				<span
					className={cn(
						"inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
						changeType === "down" &&
							(title.includes("Latency") ||
								title.includes("Latencia") ||
								title.includes("Error"))
							? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20"
							: "",
						changeType === "up" &&
							(title.includes("Records") || title.includes("Registros"))
							? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20"
							: "",
						changeType === "stable"
							? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20"
							: changeType === "up" &&
									(title.includes("Latency") ||
										title.includes("Latencia") ||
										title.includes("Error"))
								? "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20"
								: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20",
					)}
				>
					<span className="material-symbols-outlined text-[14px]">
						{changeType === "up"
							? "trending_up"
							: changeType === "down"
								? "trending_down"
								: "check"}
					</span>
					{change}
				</span>
			</div>
			<div>
				<div className="flex items-center gap-1 mb-1">
					<p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
						{title}
					</p>
					{description && (
						<div className="group/tooltip relative inline-block">
							<span className="material-symbols-outlined text-slate-400 dark:text-slate-600 text-[14px] cursor-help">
								info
							</span>
							<div className="invisible group-hover/tooltip:visible absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-900 dark:bg-slate-700 text-white text-[10px] rounded shadow-xl pointer-events-none transition-all opacity-0 group-hover/tooltip:opacity-100">
								{description}
								<div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-900 dark:border-t-slate-700"></div>
							</div>
						</div>
					)}
				</div>
				<h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
					{value}
				</h3>
				{subtitle && (
					<p className="text-[10px] text-slate-400 dark:text-slate-500 leading-tight italic">
						{subtitle}
					</p>
				)}
			</div>
		</div>
	);
}
