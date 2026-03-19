"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";

const formatDuration = (seconds: number) => {
	if (!seconds || seconds === 0) return "--";
	const h = Math.floor(seconds / 3600);
	const m = Math.floor((seconds % 3600) / 60);
	const s = seconds % 60;

	let res = "";
	if (h > 0) res += `${h}h `;
	if (m > 0) res += `${m}m `;
	if (s > 0 || res === "") res += `${s}s`;
	return res.trim();
};

export default function BottleneckTable() {
	const [flows, setFlows] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetch("/api/flows")
			.then(res => res.json())
			.then((data) => {
				const sorted = (data.flows || [])
					.sort((a: any, b: any) => {
						return (b.duration_sec || 0) - (a.duration_sec || 0);
					})
					.slice(0, 20);
				setFlows(sorted);
			})
			.catch((err) => console.error(err))
			.finally(() => setLoading(false));
	}, []);

	return (
		<div className="bg-white dark:bg-[#1E293B] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex-1">
			<div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
				<div>
					<h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
						<span className="material-symbols-outlined text-amber-500">
							timer
						</span>
						Flujos Más Lentos (Top 20)
					</h3>
					<p className="text-sm text-slate-500 dark:text-slate-400">
						Procesos con mayor duración promedio hoy
					</p>
				</div>
			</div>
			<div className="overflow-x-auto">
				<table className="w-full text-left text-sm">
					<thead className="bg-slate-50 dark:bg-[#111722] text-slate-500 dark:text-slate-400 font-medium border-b border-slate-200 dark:border-slate-800">
						<tr>
							<th className="px-6 py-4">Nombre del Flujo</th>
							<th className="px-6 py-4">Origen ➔ Destino</th>
							<th className="px-6 py-4">Horario</th>
							<th className="px-6 py-4 text-right">Duración</th>
							<th className="px-6 py-4 text-center">Estado</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-slate-200 dark:divide-slate-800">
						{flows.map((row, i) => (
							<tr
								key={i}
								className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group cursor-pointer"
							>
								<td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
									{row.name}
									{row.step_name && (
										<span className="block text-xs text-slate-400 font-normal mt-0.5">
											Step: {row.step_name}
										</span>
									)}
								</td>
								<td className="px-6 py-4 text-slate-500 dark:text-slate-300 text-xs">
									<div className="flex items-center gap-2">
										<span className="truncate max-w-[120px] font-mono" title={row.source}>{row.source || "--"}</span>
										<span className="material-symbols-outlined text-[10px] text-slate-400">arrow_forward</span>
										<span className="truncate max-w-[120px] font-mono" title={row.destination}>{row.destination || "--"}</span>
									</div>
								</td>
								<td className="px-6 py-4 text-slate-500 dark:text-slate-400 font-mono text-xs">
									{row.schedule}
								</td>
								<td className="px-6 py-4 text-right font-mono text-slate-900 dark:text-white">
									{(row.duration_sec || 0) > 0 ? formatDuration(row.duration_sec) : "--"}
								</td>
								<td className="px-6 py-4 text-center">
									<span
										className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${row.status === "FAILED"
											? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
											: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
											}`}
									>
										{row.status === "FAILED" ? "LENTO" : "NORMAL"}
									</span>
								</td>
							</tr>
						))}
						{flows.length === 0 && (
							<tr>
								<td colSpan={5} className="p-4 text-center text-slate-500">
									<p>No se encontraron flujos.</p>
									<p className="text-xs mt-1">Sincroniza el inventario para ver datos.</p>
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
}
