"use client";

import React from "react";

export default function DataFlowSchematic() {
	return (
		<div className="flex flex-col gap-4">
			<div className="flex items-center justify-between">
				<h2 className="text-slate-900 dark:text-white text-xl font-bold">
					Data Flow Schematic
				</h2>
				<button className="text-primary text-sm font-medium hover:underline">
					View Full Map
				</button>
			</div>
			<div className="w-full bg-white dark:bg-[#192233] rounded-xl border border-slate-200 dark:border-[#232f48] shadow-sm p-1">
				<div className="relative w-full aspect-[21/9] bg-slate-900 rounded-lg overflow-hidden group">
					{/* Background Schematic Image (Placeholder based on design) */}
					<div
						className="absolute inset-0 bg-cover bg-center opacity-80"
						style={{
							backgroundImage:
								'url("https://lh3.googleusercontent.com/aida-public/AB6AXuB6kNajs6c875tghsvDX3rPEaZCeAk-MT3GcFIV93c54PPFPxGbXF-ORpidMhmDAba3hYV3FICGPot3GmS8-FvAhvuZ1XKbiEX6ac_eV5Rp2ImEyX12RwNuSHpE7H6LFXPNsNFIdt33Z5ZNKxiFbuR00LzHMtmZUtiU1-w8FK21NpOPsYQwdE-BQbQkIrtfv8PFF7z9_Nv7n6xRvyyUoC2EH5V4iwrht_MPncDEIMzY___5du8YFt8YoQJtH5iTA1YXYJEL-k0cVrfp")',
						}}
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-[#192233] via-transparent to-transparent" />

					{/* Floating Status Nodes */}
					<div className="absolute top-1/4 left-1/4 -translate-x-1/2 flex flex-col items-center gap-2">
						<div className="size-3 rounded-full bg-status-green shadow-[0_0_10px_#10b981]" />
						<span className="text-xs font-mono text-white bg-black/50 px-2 py-0.5 rounded backdrop-blur-sm">
							SAP HANA
						</span>
					</div>

					<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
						<div className="size-6 rounded-full border-2 border-primary bg-black/50 flex items-center justify-center shadow-[0_0_15px_#135bec]">
							<div className="size-2 bg-primary rounded-full animate-ping" />
						</div>
						<span className="text-xs font-mono text-white bg-black/50 px-2 py-0.5 rounded backdrop-blur-sm">
							NiFi Core Cluster
						</span>
					</div>

					<div className="absolute bottom-1/3 right-1/4 flex flex-col items-center gap-2">
						<div className="size-3 rounded-full bg-status-amber shadow-[0_0_10px_#f59e0b]" />
						<span className="text-xs font-mono text-white bg-black/50 px-2 py-0.5 rounded backdrop-blur-sm">
							TrakCare DB
						</span>
					</div>

					{/* Overlay Info */}
					<div className="absolute bottom-4 left-4 flex gap-4">
						<div className="bg-black/60 backdrop-blur-md rounded-lg p-3 border border-white/10">
							<p className="text-xs text-slate-400 uppercase">
								Current Throughput
							</p>
							<p className="text-white font-mono font-bold">1.2 GB/s</p>
						</div>
						<div className="bg-black/60 backdrop-blur-md rounded-lg p-3 border border-white/10">
							<p className="text-xs text-slate-400 uppercase">Active Threads</p>
							<p className="text-white font-mono font-bold">842</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
