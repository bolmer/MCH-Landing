"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface KPICardProps {
	title: string;
	value: string;
	change?: string;
	icon: string;
	iconColor: string;
	progress?: number;
	progressBarColor?: string;
	subtitle?: string;
	isCritical?: boolean;
}

export default function KPICard({
	title,
	value,
	change,
	icon,
	iconColor,
	progress,
	progressBarColor,
	subtitle,
	isCritical,
}: KPICardProps) {
	return (
		<div
			className={cn(
				"flex flex-col gap-1 rounded-xl p-5 bg-[#232f48] border shadow-sm relative overflow-hidden group transition-all",
				isCritical
					? "border-red-100 dark:border-red-900/30"
					: "border-slate-200 dark:border-transparent",
			)}
		>
			{isCritical && (
				<div className="absolute right-0 top-0 w-24 h-24 bg-status-red/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
			)}

			<div className="flex justify-between items-start relative z-10">
				<p className="text-[#92a4c9] text-sm font-medium uppercase tracking-wider">
					{title}
				</p>
				<span
					className={cn(
						"material-symbols-outlined",
						iconColor,
						isCritical && "animate-pulse",
					)}
				>
					{icon}
				</span>
			</div>

			<div className="flex items-end gap-3 mt-1 relative z-10">
				<p className="text-slate-900 dark:text-white text-3xl font-bold leading-tight">
					{value}
				</p>
				{change && (
					<div
						className={cn(
							"flex items-center text-sm font-medium mb-1 px-2 py-0.5 rounded",
							change.includes("+")
								? "text-status-green bg-status-green/10"
								: "text-status-amber bg-status-amber/10",
							isCritical &&
								"text-status-red bg-red-100 dark:bg-red-900/30 font-bold",
						)}
					>
						{!isCritical && (
							<span className="material-symbols-outlined text-sm">
								trending_up
							</span>
						)}
						<span>{change}</span>
					</div>
				)}
			</div>

			{progress !== undefined && (
				<div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full mt-3 overflow-hidden relative z-10">
					<div
						className={cn(
							"h-full rounded-full transition-all duration-500",
							progressBarColor || "bg-primary",
						)}
						style={{ width: `${progress}%` }}
					/>
				</div>
			)}

			{subtitle && (
				<p className="text-xs text-slate-400 mt-3 relative z-10">{subtitle}</p>
			)}
		</div>
	);
}
