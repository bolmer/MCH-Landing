"use client";

import React from "react";
import { cn } from "@/lib/utils";

type BadgeType =
	| "SUCCESS"
	| "FAILED"
	| "WARNING"
	| "ACTIVE"
	| "HEALTHY"
	| "CRITICAL"
	| "NORMAL";

interface BadgeProps {
	type: BadgeType;
	className?: string;
}

const styles: Record<BadgeType, string> = {
	SUCCESS: "bg-status-green/10 text-status-green border-status-green/20",
	FAILED: "bg-status-red/10 text-status-red border-status-red/20",
	WARNING: "bg-status-amber/10 text-status-amber border-status-amber/20",
	ACTIVE: "bg-primary/10 text-primary border-primary/20",
	HEALTHY: "bg-status-green/20 text-status-green border-status-green/20",
	CRITICAL: "bg-red-900/30 text-red-400 border-red-900/30",
	NORMAL: "bg-emerald-900/30 text-emerald-400 border-emerald-900/30",
};

export default function Badge({ type, className }: BadgeProps) {
	return (
		<span
			className={cn(
				"inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
				styles[type],
				className,
			)}
		>
			{(type === "SUCCESS" || type === "HEALTHY") && (
				<span className="size-1.5 rounded-full bg-status-green animate-pulse" />
			)}
			{type === "FAILED" && (
				<span
					className="material-symbols-outlined text-[14px]"
					style={{ fontVariationSettings: "'FILL' 1" }}
				>
					error
				</span>
			)}
			{type === "WARNING" && (
				<span
					className="material-symbols-outlined text-[14px]"
					style={{ fontVariationSettings: "'FILL' 1" }}
				>
					warning
				</span>
			)}
			{type === "ACTIVE" && (
				<span className="material-symbols-outlined animate-spin text-[14px]">
					sync
				</span>
			)}
			{type}
		</span>
	);
}
