"use client";

import React from "react";

export default function VolumetryBarChart() {
	const bars = [40, 65, 55, 80, 70, 90, 60];
	const labels = ["M", "T", "W", "T", "F", "S", "S"];

	return (
		<div className="bg-white dark:bg-[#1E293B] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 flex flex-col h-full">
			<div className="mb-6">
				<h3 className="text-lg font-bold text-slate-900 dark:text-white">
					Daily Volumetry
				</h3>
				<p className="text-sm text-slate-500 dark:text-slate-400">
					Records vs Success Rate
				</p>
			</div>

			<div className="flex-1 w-full relative min-h-[200px] flex items-end justify-between gap-2 px-2 pb-6 border-b border-slate-200 dark:border-slate-700">
				{bars.map((h, i) => (
					<div
						key={i}
						className={`flex-1 rounded-t-sm transition-all relative group cursor-pointer ${
							i === 5
								? "bg-primary"
								: "bg-blue-900/30 dark:bg-blue-500/10 hover:bg-primary/50"
						}`}
						style={{ height: `${h}%` }}
					>
						<div className="hidden group-hover:block absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded shadow-lg z-10 whitespace-nowrap">
							{Math.round(h * 0.3)}k Recs
						</div>
					</div>
				))}

				{/* Success Rate Line Overlay */}
				<svg
					className="absolute inset-0 w-full h-[90%] pointer-events-none"
					preserveAspectRatio="none"
				>
					<polyline
						fill="none"
						points="0,20 50,25 100,15 150,10 200,12 250,5 300,18"
						stroke="#10b981"
						strokeWidth="2"
					/>
				</svg>

				<div className="absolute bottom-0 left-0 right-0 flex justify-between text-[10px] text-slate-400 pt-2 translate-y-full">
					{labels.map((l, idx) => (
						<span key={idx}>{l}</span>
					))}
				</div>
			</div>
		</div>
	);
}
