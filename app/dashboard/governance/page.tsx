"use client";

import React, { useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import KPICard from "@/components/cards/KPICard";
import SLATable from "@/components/tables/SLATable";

interface BaselineData {
	metadata: {
		generated_at: string;
		total_processes: number;
		outlier_days_excluded: number;
	};
}

export default function GovernancePage() {
	const [baselineData, setBaselineData] = useState<BaselineData | null>(null);

	useEffect(() => {
		fetch("/api/baselines")
			.then((res) => (res.ok ? res.json() : null))
			.then(setBaselineData)
			.catch(() => setBaselineData(null));
	}, []);

	return (
		<>
			<Header
				title="Gobernanza y SLAs"
				subtitle="Ecosistema NiFi • UC CHRISTUS"
			/>
			<main className="flex-1 space-y-6 overflow-y-auto p-4 scrollbar-hide md:p-8">
				<div className="mx-auto flex max-w-7xl flex-col gap-6">
					<section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
						<KPICard
							title="Procesos Monitoreados"
							value={baselineData?.metadata.total_processes?.toString() || "..."}
							icon="dataset"
							iconColor="text-primary"
							subtitle="Con baseline calculado"
						/>
						<KPICard
							title="Dias Atipicos Excluidos"
							value={
								baselineData?.metadata.outlier_days_excluded?.toString() || "0"
							}
							icon="warning"
							iconColor="text-status-amber"
							subtitle="Caidas de sistema"
						/>
						<KPICard
							title="Modo Operacion"
							value="Solo Lectura"
							icon="verified_user"
							iconColor="text-status-green"
							subtitle="Seguro para produccion"
						/>
						<KPICard
							title="Ultima Actualizacion"
							value={
								baselineData?.metadata.generated_at
									? new Date(
											baselineData.metadata.generated_at,
										).toLocaleDateString()
									: "..."
							}
							icon="update"
							iconColor="text-[#92a4c9]"
							subtitle="Baselines recalculados"
						/>
					</section>

					<SLATable />
				</div>
			</main>
		</>
	);
}
