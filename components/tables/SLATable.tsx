"use client";

import React, { useEffect, useState } from "react";

interface SLAEntry {
	proceso: string;
	hora_inicio_esperada: string;
	hora_termino_esperada: string;
	hora_termino_sla: string;
	sla_duracion_min: number;
	avg_retries: number;
	sample_size: number;
}

interface SLACatalog {
	metadata: {
		generated_at: string;
		total_processes: number;
		sla_formula: string;
	};
	catalog: SLAEntry[];
}

type SortKey = keyof SLAEntry;
type SortOrder = "asc" | "desc";

export default function SLATable() {
	const [data, setData] = useState<SLACatalog | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [sortKey, setSortKey] = useState<SortKey>("sla_duracion_min");
	const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

	useEffect(() => {
		fetch("/api/slas")
			.then((res) => {
				if (!res.ok) throw new Error("Failed to load SLAs");
				return res.json();
			})
			.then(setData)
			.catch((err) => setError(err.message))
			.finally(() => setLoading(false));
	}, []);

	const handleSort = (key: SortKey) => {
		if (sortKey === key) {
			setSortOrder(sortOrder === "asc" ? "desc" : "asc");
		} else {
			setSortKey(key);
			setSortOrder("desc");
		}
	};

	const getSortIcon = (key: SortKey) => {
		if (sortKey !== key) return "unfold_more";
		return sortOrder === "asc" ? "expand_less" : "expand_more";
	};

	if (loading) {
		return (
			<div className="bg-[#232f48] rounded-xl p-8 flex items-center justify-center">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
				<span className="ml-3 text-[#92a4c9]">Cargando SLAs...</span>
			</div>
		);
	}

	if (error) {
		return (
			<div className="bg-[#232f48] rounded-xl p-8 border-l-4 border-status-red">
				<p className="text-status-red font-medium">Error: {error}</p>
				<p className="text-[#92a4c9] text-sm mt-2">
					Ejecuta{" "}
					<code className="bg-[#1a2436] px-2 py-1 rounded">
						uv run python scripts/learn_behavior.py
					</code>{" "}
					para generar los SLAs.
				</p>
			</div>
		);
	}

	const filteredCatalog =
		data?.catalog.filter((entry) =>
			entry.proceso.toLowerCase().includes(searchTerm.toLowerCase()),
		) || [];

	// Sort the catalog
	const sortedCatalog = [...filteredCatalog].sort((a, b) => {
		const aVal = a[sortKey];
		const bVal = b[sortKey];

		if (typeof aVal === "number" && typeof bVal === "number") {
			return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
		}

		const aStr = String(aVal || "");
		const bStr = String(bVal || "");
		return sortOrder === "asc"
			? aStr.localeCompare(bStr)
			: bStr.localeCompare(aStr);
	});

	const getStatusColor = (duracion: number) => {
		if (duracion > 120) return "text-status-red";
		if (duracion > 60) return "text-status-amber";
		return "text-status-green";
	};

	const SortableHeader = ({ label, sortKeyName, className = "" }: { label: string; sortKeyName: SortKey; className?: string }) => (
		<th
			className={`p-4 cursor-pointer hover:bg-white/5 transition-colors select-none ${className}`}
			onClick={() => handleSort(sortKeyName)}
		>
			<div className="flex items-center justify-center gap-1">
				{label}
				<span className="material-symbols-outlined text-sm opacity-60">
					{getSortIcon(sortKeyName)}
				</span>
			</div>
		</th>
	);

	return (
		<div className="bg-[#232f48] rounded-xl overflow-hidden border border-[#232f48] shadow-xl">
			{/* Header */}
			<div className="bg-[#1a2436] px-4 py-3 border-b border-white/5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
				<div>
					<h3 className="text-white font-semibold">
						Catálogo de SLAs Predictivos
					</h3>
					<p className="text-[#92a4c9] text-xs">
						{data?.metadata.total_processes || 0} procesos • Generado:{" "}
						{data?.metadata.generated_at
							? new Date(data.metadata.generated_at).toLocaleString()
							: "N/A"}
					</p>
				</div>
				<div className="relative">
					<span
						className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#92a4c9]"
						style={{ fontSize: "18px" }}
					>
						search
					</span>
					<input
						type="text"
						placeholder="Buscar proceso..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="pl-10 pr-4 py-2 bg-[#232f48] rounded-lg text-white placeholder-[#92a4c9] text-sm border border-white/10 focus:border-primary focus:outline-none"
					/>
				</div>
			</div>

			{/* Table */}
			<div className="overflow-x-auto">
				<table className="w-full text-left border-collapse">
					<thead>
						<tr className="bg-[#1a2436] border-b border-white/5 text-[#92a4c9] text-xs uppercase tracking-wider font-semibold">
							<SortableHeader label="Proceso" sortKeyName="proceso" className="text-left" />
							<SortableHeader label="Inicio Esperado" sortKeyName="hora_inicio_esperada" />
							<SortableHeader label="Término Esperado" sortKeyName="hora_termino_esperada" />
							<SortableHeader label="Término SLA" sortKeyName="hora_termino_sla" />
							<SortableHeader label="Duración SLA" sortKeyName="sla_duracion_min" />
							<SortableHeader label="Reintentos" sortKeyName="avg_retries" />
							<SortableHeader label="Muestras" sortKeyName="sample_size" />
						</tr>
					</thead>
					<tbody className="divide-y divide-white/5 text-sm">
						{sortedCatalog.slice(0, 50).map((entry, idx) => (
							<tr key={idx} className="hover:bg-[#2d3b55] transition-colors">
								<td className="p-4">
									<span className="font-medium text-white">
										{entry.proceso}
									</span>
								</td>
								<td className="p-4 text-center font-mono text-[#92a4c9]">
									{entry.hora_inicio_esperada}
								</td>
								<td className="p-4 text-center font-mono text-[#92a4c9]">
									{entry.hora_termino_esperada}
								</td>
								<td className="p-4 text-center font-mono font-bold text-primary">
									{entry.hora_termino_sla}
								</td>
								<td
									className={`p-4 text-center font-bold ${getStatusColor(entry.sla_duracion_min)}`}
								>
									{entry.sla_duracion_min} min
								</td>
								<td className="p-4 text-center text-[#92a4c9]">
									{entry.avg_retries.toFixed(1)}
								</td>
								<td className="p-4 text-center text-[#92a4c9]">
									{entry.sample_size}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{/* Footer */}
			<div className="bg-[#1a2436] px-4 py-3 border-t border-white/5 text-sm text-[#92a4c9]">
				Mostrando {Math.min(sortedCatalog.length, 50)} de{" "}
				{sortedCatalog.length} procesos
				{searchTerm && ` (filtrado por "${searchTerm}")`}
				{sortKey && ` • Ordenado por ${sortKey} (${sortOrder === "asc" ? "↑" : "↓"})`}
			</div>
		</div>
	);
}
