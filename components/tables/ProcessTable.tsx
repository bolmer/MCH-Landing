"use client";

import React, { useState } from "react";
import Badge from "../ui/Badge";
import LineageVisualization from "./LineageVisualization";

interface Process {
	id: string;
	name: string;
	source: string;
	destination: string;
	schedule: string;
	last_run: string | null;
	duration_sec: number;
	status: "HEALTHY" | "FAILED" | "PENDING" | string;
	error_message?: string;
}

interface ProcessTableProps {
	flows: any[]; // Using any[] to match the raw json for now, ideally strictly typed
}

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

export default function ProcessTable({ flows }: ProcessTableProps) {
	const [expandedRow, setExpandedRow] = useState<string | null>(null);

	// Pagination state (mocked for now since we have few items)
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10;
	const totalPages = Math.ceil(flows.length / itemsPerPage);

	// Simple pagination logic
	const displayedFlows = flows.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

	return (
		<div className="bg-white dark:bg-[#1E293B] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex-1">
			<div className="overflow-x-auto">
				<table className="w-full text-left text-sm">
					<thead className="bg-slate-50 dark:bg-[#111722] text-slate-500 dark:text-slate-400 font-medium border-b border-slate-200 dark:border-slate-800">
						<tr>
							<th className="px-6 py-4">Nombre del Flujo</th>
							<th className="px-6 py-4">Horario</th>
							<th className="px-6 py-4">
								Origen <span className="text-xs">➔</span> Destino
							</th>
							<th className="px-6 py-4">Última Ejecución</th>
							<th className="px-6 py-4 text-right">Duración</th>
							<th className="px-6 py-4 text-center">Estado</th>
							<th className="px-6 py-4 text-center">Acciones</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-slate-200 dark:divide-slate-800">
						{displayedFlows.length === 0 ? (
							<tr>
								<td colSpan={7} className="p-8 text-center text-slate-500">
									No hay flujos para mostrar.
								</td>
							</tr>
						) : (
							displayedFlows.map((flow, i) => (
								<React.Fragment key={flow.id || i}>
									<tr
										className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border-l-2 border-transparent hover:border-primary ${expandedRow === flow.id
											? "bg-slate-50 dark:bg-slate-800/50"
											: ""
											}`}
									>
										<td className="px-6 py-4">
											<div className="flex flex-col">
												<span className="font-medium text-slate-900 dark:text-white capitalize">
													{flow.name?.replace(/_/g, " ")}
												</span>
												{flow.step_name && (
													<span className="text-xs text-slate-400 font-normal mt-0.5">
														Step: {flow.step_name}
													</span>
												)}
												{flow.error_message && (
													<span
														className="text-[10px] text-red-500 mt-1 max-w-[250px] truncate leading-tight italic"
														title={flow.error_message}
													>
														Error: {flow.error_message}
													</span>
												)}
											</div>
										</td>
										<td className="px-6 py-4">
											<div className="flex flex-col items-start gap-1">
												<span className="text-slate-500 font-mono text-xs">
													{flow.schedule}
												</span>
												{(flow.schedule === "Sin programar" ||
													!flow.schedule) &&
													flow.last_run && (
														<span className="text-[9px] bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
															AD-HOC Run
														</span>
													)}
											</div>
										</td>
										<td className="px-6 py-4 text-slate-600 dark:text-slate-300">
											<div className="flex items-center gap-2">
												<span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-[10px] font-medium max-w-[100px] truncate" title={flow.source}>
													{flow.source}
												</span>
												<span className="material-symbols-outlined text-[10px] text-slate-400">
													arrow_forward
												</span>
												<span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-[10px] font-medium max-w-[100px] truncate" title={flow.destination}>
													{flow.destination}
												</span>
											</div>
										</td>
										<td className="px-6 py-4 text-slate-500 text-xs">
											{flow.last_run ? (
												<div className="flex flex-col">
													<span>
														{new Date(flow.last_run).toLocaleDateString()}
													</span>
													<span className="text-[10px] opacity-70">
														{new Date(flow.last_run).toLocaleTimeString()}
													</span>
												</div>
											) : (
												"Esperando..."
											)}
										</td>
										<td className="px-6 py-4 text-right font-mono text-slate-700 dark:text-slate-300">
											{formatDuration(flow.duration_sec)}
										</td>
										<td className="px-6 py-4 text-center">
											{/* We use a direct logic here instead of Badge to keep consistency with the original page style for now, 
                                                or we could adapt the Badge component. Let's keep the pill style from page.tsx */}
											<span
												className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${flow.status === "FAILED"
													? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
													: flow.status === "HEALTHY"
														? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
														: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400"
													}`}
											>
												<span
													className={`w-1.5 h-1.5 rounded-full mr-1.5 ${flow.status === "HEALTHY" ? "bg-emerald-500" : flow.status === "FAILED" ? "bg-red-500 animate-pulse" : "bg-slate-400"}`}
												></span>
												{flow.status === "HEALTHY"
													? "EXITOSO"
													: flow.status === "FAILED"
														? "FALLIDO"
														: "PENDIENTE"}
											</span>
										</td>
										<td className="px-6 py-4 text-center">
											<button
												onClick={() => setExpandedRow(expandedRow === flow.id ? null : flow.id)}
												className="text-primary hover:text-blue-400 transition-colors"
												title="Ver Linaje"
											>
												<span className="material-symbols-outlined text-xl">
													{expandedRow === flow.id ? "expand_less" : "hub"}
												</span>
											</button>
										</td>
									</tr>
									{expandedRow === flow.id && (
										<tr className="bg-slate-50 dark:bg-[#1a2436] shadow-inner">
											<td className="p-6" colSpan={7}>
												<div className="text-center py-8">
													<p className="text-sm text-slate-500 mb-4">Visualización de Linaje (Próximamente)</p>
													{/* We can temporarily comment out LineageVisualization if it's broken or use it if ready */}
													{/* <LineageVisualization /> */}
													<div className="flex justify-center items-center gap-4 opacity-50">
														<div className="h-10 w-24 bg-slate-200 dark:bg-slate-700 rounded border border-slate-300 dark:border-slate-600 flex items-center justify-center text-xs">NiFi</div>
														<span className="material-symbols-outlined">arrow_forward</span>
														<div className="h-10 w-24 bg-slate-200 dark:bg-slate-700 rounded border border-slate-300 dark:border-slate-600 flex items-center justify-center text-xs">Postgres</div>
														<span className="material-symbols-outlined">arrow_forward</span>
														<div className="h-10 w-24 bg-slate-200 dark:bg-slate-700 rounded border border-slate-300 dark:border-slate-600 flex items-center justify-center text-xs">Tableau</div>
													</div>
												</div>
											</td>
										</tr>
									)}
								</React.Fragment>
							))
						)}
					</tbody>
				</table>
			</div>

			{/* Simple Pagination Control */}
			{totalPages > 1 && (
				<div className="bg-white dark:bg-[#1E293B] px-4 py-3 flex items-center justify-between border-t border-slate-200 dark:border-slate-800">
					<div className="flex-1 flex justify-between sm:hidden">
						<button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="relative inline-flex items-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50">
							Anterior
						</button>
						<button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="ml-3 relative inline-flex items-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50">
							Siguiente
						</button>
					</div>
					<div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
						<div>
							<p className="text-sm text-slate-700 dark:text-slate-400">
								Mostrando <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> a <span className="font-medium">{Math.min(currentPage * itemsPerPage, flows.length)}</span> de <span className="font-medium">{flows.length}</span> resultados
							</p>
						</div>
						<div>
							<nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
								<button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50">
									<span className="material-symbols-outlined">chevron_left</span>
								</button>
								<span className="relative inline-flex items-center px-4 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium text-slate-700 dark:text-slate-300">
									{currentPage} / {totalPages}
								</span>
								<button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50">
									<span className="material-symbols-outlined">chevron_right</span>
								</button>
							</nav>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
