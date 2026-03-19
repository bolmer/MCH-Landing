"use client";

import React from "react";

export default function ExecutionTimeChart() {
	return (
		<div className="lg:col-span-2 bg-white dark:bg-[#1E293B] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
			<div className="flex items-center justify-between mb-6">
				<div>
					<h3 className="text-lg font-bold text-slate-900 dark:text-white">
						Process Execution Times
					</h3>
					<p className="text-sm text-slate-500 dark:text-slate-400">
						Comparative latency (ms) for critical flows
					</p>
				</div>
				<div className="flex items-center gap-2">
					<span className="flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400">
						<span className="size-2 rounded-full bg-primary" /> SAP Billing
					</span>
					<span className="flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400 ml-2">
						<span className="size-2 rounded-full bg-slate-300 dark:bg-slate-600" />{" "}
						Lab Results
					</span>
				</div>
			</div>

			<div className="relative w-full h-[320px] rounded-lg bg-slate-50 dark:bg-[#111722]/50 flex items-end justify-between px-4 pb-4 pt-10 gap-2 border-b border-l border-slate-200 dark:border-slate-700">
				{/* Y-Axis Labels */}
				<div className="absolute left-0 top-4 bottom-8 w-8 flex flex-col justify-between text-[10px] text-slate-400 text-right pr-2">
					<span>800ms</span>
					<span>600ms</span>
					<span>400ms</span>
					<span>200ms</span>
					<span>0ms</span>
				</div>

				{/* SVG Drawing (Simulated Line Chart) */}
				<div className="absolute inset-0 left-10 bottom-8 right-0 top-4 overflow-hidden">
					<svg
						className="w-full h-full"
						preserveAspectRatio="none"
						viewBox="0 0 800 300"
					>
						<path
							d="M0,200 Q100,180 200,220 T400,150 T600,100 T800,180"
							fill="none"
							stroke="#135bec"
							strokeWidth="3"
						/>
						<circle
							className="animate-pulse"
							cx="400"
							cy="150"
							fill="#135bec"
							r="4"
						/>
						<path
							d="M0,250 Q120,240 240,260 T480,220 T720,240 T800,230"
							fill="none"
							stroke="#475569"
							strokeDasharray="5,5"
							strokeWidth="2"
						/>
					</svg>
				</div>

				{/* X-Axis Labels */}
				<div className="absolute bottom-0 left-10 right-0 h-6 flex justify-between text-[10px] text-slate-400 px-2">
					<span>Mon</span>
					<span>Tue</span>
					<span>Wed</span>
					<span>Thu</span>
					<span>Fri</span>
					<span>Sat</span>
					<span>Sun</span>
				</div>
			</div>
		</div>
	);
}
