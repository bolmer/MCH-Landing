"use client";

import React from "react";

interface NodeProps {
	label: string;
	sublabel: string;
	icon: string;
	isFailed?: boolean;
	isActive?: boolean;
	isPending?: boolean;
}

const Node = ({
	label,
	sublabel,
	icon,
	isFailed,
	isActive,
	isPending,
}: NodeProps) => (
	<div
		className={`flex flex-col items-center gap-2 min-w-[100px] relative group ${isPending ? "opacity-50" : ""}`}
	>
		{isFailed && (
			<div className="absolute top-0 size-12 rounded-full bg-status-red/30 animate-ping z-0" />
		)}
		<div
			className={`size-12 rounded-full bg-[#232f48] border-2 flex items-center justify-center relative z-10 ${
				isFailed
					? "border-status-red"
					: isActive
						? "border-primary"
						: "border-[#92a4c9]"
			}`}
		>
			<span
				className={`material-symbols-outlined ${isFailed ? "text-status-red" : "text-white"}`}
			>
				{icon}
			</span>
		</div>
		<p
			className={`text-xs font-medium ${isFailed ? "text-status-red" : "text-white"}`}
		>
			{label}
		</p>
		<p
			className={`text-[10px] ${isFailed ? "text-status-red" : "text-[#92a4c9]"}`}
		>
			{sublabel}
		</p>

		{isFailed && (
			<div className="absolute bottom-16 w-48 bg-black/90 text-white text-xs p-2 rounded border border-white/10 hidden group-hover:block z-20">
				Error: Schema Mismatch. Column &apos;patient_id&apos; expected INT,
				found VARCHAR.
			</div>
		)}
	</div>
);

const Connector = ({
	isDashed,
	isActive,
}: {
	isDashed?: boolean;
	isActive?: boolean;
}) => (
	<div
		className={`h-0.5 flex-1 min-w-[40px] ${
			isActive
				? "bg-primary"
				: isDashed
					? "border-t-2 border-dashed border-[#92a4c9]"
					: "bg-[#92a4c9]"
		}`}
	/>
);

export default function LineageVisualization() {
	return (
		<div className="flex flex-col gap-6">
			<div className="flex items-center justify-between">
				<h4 className="text-white text-sm font-bold flex items-center gap-2">
					<span
						className="material-symbols-outlined text-primary"
						style={{ fontSize: "20px" }}
					>
						account_tree
					</span>
					Data Lineage Visualization
				</h4>
				<div className="flex gap-2">
					<button className="text-xs text-[#92a4c9] hover:text-white underline">
						View Full Logs
					</button>
					<span className="text-[#232f48]">|</span>
					<button className="text-xs text-status-red hover:text-red-400 font-medium">
						Retry Process
					</button>
				</div>
			</div>

			<div className="flex items-center overflow-x-auto py-4 px-2 scrollbar-hide">
				<Node
					label="Ingest"
					sublabel="Salesforce API"
					icon="cloud_download"
					isActive
				/>
				<Connector isActive />
				<Node
					label="Normalize"
					sublabel="NiFi Cluster 2"
					icon="transform"
					isActive
				/>
				<Connector isActive />
				<Node
					label="Validation"
					sublabel="Schema Mismatch"
					icon="gpp_bad"
					isFailed
				/>
				<Connector isDashed />
				<Node label="Load" sublabel="Snowflake" icon="storage" isPending />
			</div>
		</div>
	);
}
