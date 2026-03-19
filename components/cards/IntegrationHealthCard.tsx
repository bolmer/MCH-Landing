"use client";

import React from "react";
import Badge from "../ui/Badge";

interface IntegrationHealthCardProps {
	title: string;
	subtitle: string;
	icon: string;
	iconBgColor: string;
	iconTextColor: string;
	totalProcesses: string;
	successRate: string;
	status: "SALUDABLE" | "ADVERTENCIA" | "FALLO";
	lastIncident?: string;
}

export default function IntegrationHealthCard({
	title,
	subtitle,
	icon,
	iconBgColor,
	iconTextColor,
	totalProcesses,
	successRate,
	status,
	lastIncident,
}: IntegrationHealthCardProps) {
	const isHealthy = status === "SALUDABLE";

	return (
		<div className="bg-white dark:bg-[#232f48] rounded-xl border border-slate-200 dark:border-transparent p-6 flex flex-col gap-6 shadow-sm hover:shadow-md transition-shadow">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-3">
					<div
						className={`size-10 rounded-lg ${iconBgColor} flex items-center justify-center ${iconTextColor}`}
					>
						<span className="material-symbols-outlined">{icon}</span>
					</div>
					<div>
						<h3 className="text-slate-900 dark:text-white font-bold text-lg">
							{title}
						</h3>
						<p className="text-xs text-slate-500 dark:text-slate-400">
							{subtitle}
						</p>
					</div>
				</div>
				{/* Traducimos de vuelta para el componente Badge que usa inglés internamente */}
				<Badge
					type={
						status === "SALUDABLE"
							? "HEALTHY"
							: status === "ADVERTENCIA"
								? "WARNING"
								: "FAILED"
					}
				/>
			</div>

			<div className="grid grid-cols-2 gap-4">
				<div className="flex flex-col gap-1 p-3 rounded-lg bg-slate-50 dark:bg-[#111722]/50">
					<span className="text-xs text-slate-500">Procesos Totales</span>
					<span className="text-slate-900 dark:text-white text-xl font-bold">
						{totalProcesses}
					</span>
				</div>
				<div className="flex flex-col gap-1 p-3 rounded-lg bg-slate-50 dark:bg-[#111722]/50">
					<span className="text-xs text-slate-500">Tasa de Éxito</span>
					<span
						className={`text-xl font-bold ${isHealthy ? "text-status-green" : "text-status-amber"}`}
					>
						{successRate}
					</span>
				</div>
			</div>

			<div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center text-sm">
				<span
					className={`font-medium flex items-center gap-1 ${isHealthy ? "text-slate-500 dark:text-slate-400" : "text-status-amber"}`}
				>
					{!isHealthy && (
						<span className="material-symbols-outlined text-sm">warning</span>
					)}
					{lastIncident || "Sistemas operativos"}
				</span>
				<button className="text-primary font-medium hover:text-blue-400 flex items-center gap-1">
					Detalles{" "}
					<span className="material-symbols-outlined text-sm">
						arrow_forward
					</span>
				</button>
			</div>
		</div>
	);
}
