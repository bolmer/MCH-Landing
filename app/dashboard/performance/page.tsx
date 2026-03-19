"use client";

import React from "react";
import Header from "@/components/layout/Header";
import StatCard from "@/components/cards/StatCard";
import ExecutionTimeChart from "@/components/charts/ExecutionTimeChart";
import VolumetryBarChart from "@/components/charts/VolumetryBarChart";
import BottleneckTable from "@/components/tables/BottleneckTable";

export default function PerformancePage() {
	const handleDownloadCSV = async () => {
		try {
			const res = await fetch("/api/flows");
			const data = await res.json();
			const flows = data.flows || [];

			if (flows.length === 0) {
				alert("No hay datos para exportar");
				return;
			}

			const headers = [
				"Nombre",
				"Schedule",
				"Origen",
				"Destino",
				"Estado",
				"Ultima Ejecucion",
				"Duracion (s)",
				"Error",
			];
			const csvRows = flows.map((flow: any) =>
				[
					`"${flow.name}"`,
					`"${flow.schedule}"`,
					`"${flow.origin}"`,
					`"${flow.destination}"`,
					`"${flow.status}"`,
					`"${flow.last_run}"`,
					flow.duration_sec,
					`"${flow.error_message || ""}"`,
				].join(","),
			);

			const csvContent = [headers.join(","), ...csvRows].join("\n");
			const blob = new Blob([csvContent], { type: "text/csv" });
			const url = window.URL.createObjectURL(blob);
			const anchor = document.createElement("a");
			anchor.setAttribute("hidden", "");
			anchor.setAttribute("href", url);
			anchor.setAttribute(
				"download",
				`nifi_performance_report_${new Date().toISOString().split("T")[0]}.csv`,
			);
			document.body.appendChild(anchor);
			anchor.click();
			document.body.removeChild(anchor);
		} catch (error) {
			console.error("Error exporting CSV:", error);
			alert("Error al exportar reporte");
		}
	};

	return (
		<>
			<Header
				title="Metricas de Rendimiento"
				subtitle="Rendimiento en tiempo real de los canales de datos"
				onDownload={handleDownloadCSV}
			/>
			<main className="flex-1 overflow-y-auto bg-slate-50 p-4 scrollbar-hide dark:bg-[#0f141e] md:p-8">
				<div className="mx-auto flex max-w-7xl flex-col gap-6">
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
						<StatCard
							title="Latencia de Red"
							value="240ms"
							change="12%"
							changeType="down"
							icon="speed"
							iconBgColor="bg-blue-50 dark:bg-blue-900/20"
							iconTextColor="text-blue-600 dark:text-blue-400"
							subtitle="Tiempo de viaje extremo a extremo"
							description="Mide el tiempo promedio que tarda un paquete de datos en ser procesado desde que entra a NiFi hasta su destino final."
						/>
						<StatCard
							title="Registros Procesados"
							value="45.2M"
							change="5.2%"
							changeType="up"
							icon="dataset"
							iconBgColor="bg-purple-50 dark:bg-purple-900/20"
							iconTextColor="text-purple-600 dark:text-purple-400"
							subtitle="Volumen total diario"
							description="Cantidad total de filas o registros movilizados por los flujos activos en las ultimas 24 horas."
						/>
						<StatCard
							title="Tasa de Error"
							value="0.02%"
							change="Estable"
							changeType="stable"
							icon="error"
							iconBgColor="bg-red-50 dark:bg-red-900/20"
							iconTextColor="text-red-600 dark:text-red-400"
							subtitle="Fallos tecnicos vs total"
							description="Relacion porcentual entre ejecuciones fallidas y el total de ejecuciones registradas en la tabla de status."
						/>
						<StatCard
							title="Hilos Activos"
							value="1,204"
							change="Carga Alta"
							changeType="up"
							icon="memory"
							iconBgColor="bg-amber-50 dark:bg-amber-900/20"
							iconTextColor="text-amber-600 dark:text-amber-400"
							subtitle="Uso de hilos concurrentes"
							description="Muestra cuantos hilos de procesamiento estan siendo utilizados actualmente por el cluster."
						/>
					</div>

					<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
						<ExecutionTimeChart />
						<VolumetryBarChart />
					</div>

					<BottleneckTable />
				</div>
			</main>
		</>
	);
}
