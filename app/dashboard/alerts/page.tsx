"use client";

import React from "react";
import Header from "@/components/layout/Header";

export default function AlertsPage() {
	return (
		<>
			<Header
				title="Alertas y Auditoria"
				subtitle="Informe de validacion de entrega"
			/>
			<main className="flex-1 overflow-y-auto bg-slate-50 p-4 scrollbar-hide dark:bg-[#0f141e] md:p-8">
				<div className="mx-auto flex max-w-4xl flex-col gap-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-[#1E293B]">
					<div className="border-b border-slate-200 pb-6 text-center dark:border-slate-800">
						<h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
							Informe de Auditoria y Validacion de Entrega
						</h1>
						<p className="mt-2 text-slate-500 dark:text-[#92a4c9]">
							Proyecto NiFi Governance & Monitoring • 2026
						</p>
					</div>

					<section className="space-y-4 text-slate-700 dark:text-slate-300">
						<div className="flex items-start gap-4 rounded-xl border border-primary/10 bg-primary/5 p-4">
							<span className="material-symbols-outlined mt-1 text-primary">
								info
							</span>
							<p className="text-sm leading-relaxed">
								El presente informe detalla el estado actual del ecosistema
								tecnologico tras la refactorizacion de la suite de gobernanza.
								El objetivo es proporcionar visibilidad clara sobre la
								funcionalidad del software y asegurar el control de activos
								criticos.
							</p>
						</div>
					</section>

					<section className="space-y-6">
						<h2 className="flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white">
							<span className="material-symbols-outlined text-primary">
								inventory_2
							</span>
							Inventario de Activos
						</h2>
						<div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
							<table className="w-full text-left text-sm">
								<thead className="bg-slate-50 text-slate-500 dark:bg-[#111722]">
									<tr>
										<th className="px-4 py-3">Componente</th>
										<th className="px-4 py-3">Tecnologia</th>
										<th className="px-4 py-3 text-center">Estado</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-slate-100 dark:divide-slate-800">
									<tr>
										<td className="px-4 py-3 font-medium text-slate-900 dark:text-white">
											Suite de Gobernanza
										</td>
										<td className="px-4 py-3 text-slate-500">
											Python / Redshift
										</td>
										<td className="px-4 py-3 text-center">
											<span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-800">
												Recibido
											</span>
										</td>
									</tr>
									<tr>
										<td className="px-4 py-3 font-medium text-slate-900 dark:text-white">
											Dashboard Monitor
										</td>
										<td className="px-4 py-3 text-slate-500">
											Next.js 16 / React 19
										</td>
										<td className="px-4 py-3 text-center">
											<span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-800">
												Funcional
											</span>
										</td>
									</tr>
									<tr>
										<td className="px-4 py-3 font-medium text-slate-900 dark:text-white">
											Backups NiFi
										</td>
										<td className="px-4 py-3 text-slate-500">JSON Archive</td>
										<td className="px-4 py-3 text-center">
											<span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-800">
												Validado
											</span>
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</section>

					<section className="space-y-6">
						<h2 className="flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white">
							<span className="material-symbols-outlined text-amber-500">
								warning
							</span>
							Riesgos y Alertas Criticas
						</h2>
						<div className="space-y-4">
							<div className="space-y-2 rounded-xl border-l-4 border-status-red bg-status-red/5 p-4">
								<h3 className="font-bold italic text-slate-900 dark:text-white">
									Logging de errores incompleto
								</h3>
								<p className="text-sm text-slate-600 dark:text-slate-400">
									Se detectaron procesadores PutSQL que no registran el mensaje
									de error. Se requiere intervencion manual usando el reporte
									generado en `reports/nifi_sql_fixes.md`.
								</p>
							</div>
							<div className="space-y-2 rounded-xl border-l-4 border-status-amber bg-status-amber/5 p-4">
								<h3 className="font-bold italic text-slate-900 dark:text-white">
									Dependencia de VPN
								</h3>
								<p className="text-sm text-slate-600 dark:text-slate-400">
									La extraccion de baselines y SLAs requiere conexion activa a
									la red interna para consultar Redshift. Sin VPN, los datos del
									dashboard podrian estar desactualizados.
								</p>
							</div>
						</div>
					</section>

					<section className="space-y-6">
						<h2 className="flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white">
							<span className="material-symbols-outlined text-primary">
								task_alt
							</span>
							Plan de Accion Inmediato
						</h2>
						<ul className="list-inside list-disc space-y-3 text-sm text-slate-600 dark:text-slate-400">
							<li>Aplicar correcciones SQL en la interfaz de NiFi.</li>
							<li>
								Ejecutar `calculate_baselines.py` con VPN para actualizar
								historico de 180 dias.
							</li>
							<li>Validar la descarga correcta de informes desde el dashboard.</li>
						</ul>
					</section>
				</div>
			</main>
		</>
	);
}
