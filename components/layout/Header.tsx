"use client";

import React from "react";

export default function Header({
	title,
	subtitle,
	onDownload,
}: {
	title: string;
	subtitle?: string;
	onDownload?: () => void;
}) {
	const handleGenerateReport = () => {
		if (onDownload) {
			onDownload();
		} else {
			alert(
				"Generando reporte consolidado... El archivo se descargará en unos momentos.",
			);
			window.open("/reports/daily_report_2026-01-22.html", "_blank");
		}
	};

	return (
		<header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-[#232f48] bg-white dark:bg-[#111722] px-6 py-3 shrink-0 z-10 sticky top-0">
			<div className="flex items-center gap-4 dark:text-white text-slate-900">
				<div className="size-8 flex items-center justify-center bg-primary/10 rounded-lg text-primary">
					<span className="material-symbols-outlined text-[20px]">
						monitor_heart
					</span>
				</div>
				<div className="flex flex-col">
					<h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">
						{title}
					</h2>
					{subtitle && (
						<p className="text-[#92a4c9] text-xs mt-0.5">{subtitle}</p>
					)}
				</div>
			</div>

			<div className="flex items-center justify-end gap-3">
				<div className="hidden sm:flex items-center gap-2 px-3 h-10 rounded-lg bg-slate-100 dark:bg-[#232f48] text-slate-600 dark:text-white text-sm font-medium cursor-pointer">
					<span className="material-symbols-outlined text-[20px]">
						calendar_today
					</span>
					<span>Últimos 180 días</span>
					<span className="material-symbols-outlined text-[16px]">
						expand_more
					</span>
				</div>

				<button
					onClick={async () => {
						try {
							const res = await fetch("/api/nifi/sync", { method: "POST" });
							if (res.ok) alert("Sincronización iniciada en segundo plano.");
							else alert("Error al iniciar sincronización.");
						} catch (e) {
							console.error(e);
							alert("Error de conexión.");
						}
					}}
					className="flex min-w-[40px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-slate-100 dark:bg-[#232f48] hover:bg-slate-200 dark:hover:bg-[#2d3b55] text-slate-900 dark:text-white text-sm font-bold leading-normal tracking-[0.015em] transition-colors"
					title="Forzar Sincronización Manual"
				>
					<span className="material-symbols-outlined text-[18px]">sync</span>
				</button>
				<button
					onClick={handleGenerateReport}
					className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary hover:bg-blue-600 text-white text-sm font-bold leading-normal tracking-[0.015em] transition-colors shadow-lg shadow-blue-500/20"
				>
					<span className="truncate flex items-center gap-2">
						<span className="material-symbols-outlined text-[18px]">
							download
						</span>
						Generar Informe
					</span>
				</button>
			</div>
		</header>
	);
}
