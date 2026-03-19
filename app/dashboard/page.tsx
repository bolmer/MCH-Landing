"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import KPICard from "@/components/cards/KPICard";
import ProcessTable from "@/components/tables/ProcessTable";
import { api } from "@/lib/api";

interface FlowData {
	metadata: {
		generated_at: string;
		total_flows: number;
		active_today: number;
		errors_today: number;
		kpis: {
			success_rate: string;
			coverage: string;
		};
	};
	flows: any[];
}

export default function DashboardHomePage() {
	const [data, setData] = useState<FlowData | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		api.nifi
			.getFlows()
			.then((response) => {
				setData(response);
			})
			.catch((requestError) => {
				setError(requestError.message);
			})
			.finally(() => setLoading(false));
	}, []);

	const flows = data?.flows || [];

	const exportToCSV = () => {
		if (!flows.length) return;

		const headers =
			"Nombre,Horario,Origen,Destino,Ultima_Ejecucion,Duracion_Sec,Estado,Error\n";
		const rows = flows
			.map(
				(flow) =>
					`"${flow.name}","${flow.schedule}","${flow.source}","${flow.destination}","${flow.last_run || ""}",${flow.duration_sec || 0},"${flow.status}","${flow.error_message || ""}"`,
			)
			.join("\n");

		const blob = new Blob([headers + rows], {
			type: "text/csv;charset=utf-8;",
		});
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.setAttribute("href", url);
		link.setAttribute(
			"download",
			`reporte_flujos_${new Date().toISOString().split("T")[0]}.csv`,
		);
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	const recentFlows = [...flows].sort((a, b) => {
		if (a.status === "FAILED" && b.status !== "FAILED") return -1;
		if (a.status !== "FAILED" && b.status === "FAILED") return 1;

		return (b.duration_sec || 0) - (a.duration_sec || 0);
	});

	return (
		<>
			<Header
				title="Panel de Control de Flujos"
				subtitle={
					loading
						? "Cargando datos..."
						: error
							? `Error: ${error}`
							: data
								? `Datos actualizados: ${new Date(data.metadata.generated_at).toLocaleString()} • ${flows.length} flujos`
								: "Sin datos"
				}
				onDownload={exportToCSV}
			/>
			<main className="flex-1 overflow-y-auto p-4 md:p-8 scrollbar-hide">
				<div className="mx-auto flex max-w-[1600px] flex-col gap-6">
					{loading && (
						<div className="flex items-center justify-center py-12">
							<div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
							<span className="ml-3 text-slate-500">Cargando flujos...</span>
						</div>
					)}

					{error && !loading && (
						<div className="rounded border-l-4 border-red-500 bg-red-50 p-4 dark:bg-red-900/20">
							<p className="font-medium text-red-700 dark:text-red-400">
								Error al cargar datos
							</p>
							<p className="text-sm text-red-600 dark:text-red-300">{error}</p>
						</div>
					)}

					{!loading && !error && (
						<div className="grid grid-cols-1 gap-4 md:grid-cols-4">
							<KPICard
								title="Total Catálogo"
								value={data?.metadata.total_flows?.toString() || "..."}
								change="Flujos Definidos"
								icon="inventory_2"
								iconColor="text-primary"
							/>
							<KPICard
								title="Activos Hoy"
								value={data?.metadata.active_today?.toString() || "..."}
								change={`${data?.metadata.kpis.coverage || "0%"} Cobertura`}
								icon="play_circle"
								iconColor="text-status-green"
							/>
							<KPICard
								title="Tasa de Exito"
								value={data?.metadata.kpis.success_rate || "..."}
								change={
									(data?.metadata.errors_today || 0) > 0
										? `${data?.metadata.errors_today} Fallos`
										: "Estable"
								}
								icon="analytics"
								iconColor={
									(data?.metadata.errors_today || 0) > 0
										? "text-status-red"
										: "text-status-green"
								}
								isCritical={(data?.metadata.errors_today || 0) > 0}
							/>
							<KPICard
								title="Seguridad"
								value="2 Alertas"
								change="Ver detalle"
								icon="security"
								iconColor="text-status-amber"
								subtitle="Credenciales hardcoded"
							/>
						</div>
					)}

					{!loading && !error && flows.length > 0 && (
						<div className="flex flex-col gap-4">
							<div className="flex items-center justify-between px-2">
								<div>
									<h3 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
										<span className="material-symbols-outlined text-primary">
											account_tree
										</span>
										Estado de Flujos ETL
									</h3>
									<p className="text-sm text-slate-500 dark:text-slate-400">
										Monitoreo basado en el inventario real y logs operativos
									</p>
								</div>
								<Link
									href="/dashboard/performance"
									className="text-sm font-medium text-primary hover:text-blue-400"
								>
									Ver Top 20 lentos
								</Link>
							</div>

							<ProcessTable flows={recentFlows} />
						</div>
					)}

					{!loading && !error && flows.length === 0 && (
						<div className="py-12 text-center text-slate-500">
							<span className="material-symbols-outlined mb-2 block text-4xl">
								inbox
							</span>
							<p>No hay flujos para mostrar. Pulsa Sync para cargar datos.</p>
						</div>
					)}
				</div>
			</main>
		</>
	);
}
