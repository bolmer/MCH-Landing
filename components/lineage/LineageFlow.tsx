"use client";

import React, { useCallback, useEffect, useState, useMemo } from "react";
import {
	ReactFlow,
	useNodesState,
	useEdgesState,
	addEdge,
	Background,
	BackgroundVariant,
	type Connection,
	Controls,
	type Edge,
	Handle,
	MarkerType,
	MiniMap,
	type Node,
	Panel,
	Position,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import dagre from "dagre";
import { Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 260;
const nodeHeight = 90;

interface LineageNodeData {
	type: string;
	label: string;
}

const getLayoutedElements = (
	nodes: Node[],
	edges: Edge[],
	direction = "TB",
) => {
	const isHorizontal = direction === "LR";
	dagreGraph.setGraph({ rankdir: direction, nodesep: 40, ranksep: 120 });

	nodes.forEach((node) => {
		dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
	});

	edges.forEach((edge) => {
		dagreGraph.setEdge(edge.source, edge.target);
	});

	dagre.layout(dagreGraph);

	const newNodes = nodes.map((node) => {
		const nodeWithPosition = dagreGraph.node(node.id);
		return {
			...node,
			targetPosition: isHorizontal ? Position.Left : Position.Top,
			sourcePosition: isHorizontal ? Position.Right : Position.Bottom,
			position: {
				x: nodeWithPosition.x - nodeWidth / 2,
				y: nodeWithPosition.y - nodeHeight / 2,
			},
		};
	});

	return { nodes: newNodes, edges };
};

const getIconForType = (type: string) => {
	switch (type) {
		case "nifiGroup":
			return "hub";
		case "storedProcedure":
			return "functions";
		case "databaseSource":
		case "databaseTarget":
			return "database";
		case "s3Object":
			return "cloud_download";
		default:
			return "data_object";
	}
};

const CustomNode = ({ data }: { data: LineageNodeData }) => {
	const icon = getIconForType(data.type);
	const isDB = data.type === "databaseSource" || data.type === "databaseTarget";
	const isSP = data.type === "storedProcedure";
	const isNiFi = data.type === "nifiGroup";

	const brandColor = isDB ? "#004b96" : isSP ? "#702082" : "#6366f1";
	const brandBg = isDB ? "bg-[#004b96]/10" : isSP ? "bg-[#702082]/10" : "bg-indigo-500/10";
	const brandText = isDB ? "text-[#004b96]" : isSP ? "text-[#702082]" : "text-indigo-500";

	return (
		<div className="relative group">
			<Handle
				type="target"
				position={Position.Top}
				style={{ background: brandColor }}
				className="w-3.5 h-3.5 border-2 border-white dark:border-slate-800 !shadow-sm transition-transform group-hover:scale-125"
			/>
			<div className="px-5 py-3.5 shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] rounded-2xl bg-white dark:bg-[#1e293b] border-2 border-slate-100 dark:border-slate-700 min-w-[260px] group-hover:border-slate-300 dark:group-hover:border-slate-500 transition-all duration-300">
				<div className="flex items-center gap-4">
					<div className={`flex items-center justify-center w-11 h-11 rounded-xl ${brandBg} ${brandText} group-hover:scale-105 transition-all duration-300`}>
						<span className="material-symbols-outlined text-2xl">{icon}</span>
					</div>
					<div className="overflow-hidden flex-1">
						<div className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 border-b border-slate-50 dark:border-slate-700/50 pb-1 mb-1">
							{isNiFi ? (
								<span className="flex items-center gap-1">
									<div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
									NiFi Flow
								</span>
							) : isSP ? (
								<span className="flex items-center gap-1">
									<div className="w-2 h-2 rounded-full bg-[#702082] shadow-[0_0_8px_rgba(112,32,130,0.5)]" />
									Redshift SP
								</span>
							) : (
								<span className="flex items-center gap-1">
									<div className="w-2 h-2 rounded-full bg-[#004b96] shadow-[0_0_8px_rgba(0,75,150,0.5)]" />
									Data Object
								</span>
							)}
						</div>
						<div
							className="text-[13px] font-extrabold text-[#111827] dark:text-white truncate leading-tight"
							title={data.label}
						>
							{data.label}
						</div>
					</div>
				</div>
			</div>
			<Handle
				type="source"
				position={Position.Bottom}
				style={{ background: brandColor }}
				className="w-3.5 h-3.5 border-2 border-white dark:border-slate-800 !shadow-sm transition-transform group-hover:scale-125"
			/>
		</div>
	);
};

const nodeTypes = {
	custom: CustomNode,
	nifiGroup: CustomNode,
	storedProcedure: CustomNode,
	databaseSource: CustomNode,
	databaseTarget: CustomNode,
	s3Object: CustomNode,
};

export default function LineageFlow() {
	const [allNodes, setAllNodes] = useState<Node[]>([]);
	const [allEdges, setAllEdges] = useState<Edge[]>([]);
	const [schemas, setSchemas] = useState<string[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	// FILTROS
	const [selectedObjectType, setSelectedObjectType] = useState<string>("todos");
	const [selectedSchema, setSelectedSchema] = useState<string>("todos");
	const [selectedNodeId, setSelectedNodeId] = useState<string>("");

	const [nodes, setNodes, onNodesChange] = useNodesState([]);
	const [edges, setEdges, onEdgesChange] = useEdgesState([]);

	useEffect(() => {
		const fetchData = async () => {
			setIsLoading(true);
			try {
				const response = await fetch("/data/lineage_nodes.json");
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				const data = await response.json();
				setAllNodes(data.nodes || []);
				setAllEdges(data.edges || []);

				// Extraer esquemas únicos solo de objetos de BD o flujos, ignorando archivos S3
				const extractedSchemas = new Set<string>();
				data.nodes.forEach((node: Node) => {
					const nodeData = node.data as unknown as LineageNodeData;
					if (
						node.type !== "s3Object" &&
						nodeData.label &&
						nodeData.label.includes(".")
					) {
						extractedSchemas.add(nodeData.label.split(".")[0]);
					}
				});
				setSchemas(Array.from(extractedSchemas).sort());
			} catch (error) {
				console.error("Error loading lineage data:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
	}, []);

	const processOptions = useMemo(() => {
		let filtered = allNodes;

		// Filtro por Tipo
		if (selectedObjectType === "nifiGroup") {
			filtered = filtered.filter((n) => n.type === "nifiGroup");
		} else if (selectedObjectType === "storedProcedure") {
			filtered = filtered.filter((n) => n.type === "storedProcedure");
		} else if (selectedObjectType === "databaseTarget") {
			filtered = filtered.filter(
				(n) => n.type === "databaseTarget" || n.type === "databaseSource",
			);
		} else {
			// Por defecto, ocultamos S3 files para no saturar si no hay búsqueda
			if (!selectedNodeId) {
				filtered = filtered.filter((n) => n.type !== "s3Object");
			}
		}

		// Filtro por Esquema
		if (selectedSchema !== "todos") {
			filtered = filtered.filter((n) => {
				const nodeData = n.data as unknown as LineageNodeData;
				return (
					nodeData.label && nodeData.label.startsWith(`${selectedSchema}.`)
				);
			});
		}

		return filtered.sort((a, b) => {
			const dataA = a.data as unknown as LineageNodeData;
			const dataB = b.data as unknown as LineageNodeData;
			return (dataA.label || "").localeCompare(dataB.label || "");
		});
	}, [allNodes, selectedObjectType, selectedSchema, selectedNodeId]);

	// Lógica de filtrado del grafo (Linaje)
	useEffect(() => {
		if (!selectedNodeId) {
			setNodes([]);
			setEdges([]);
			return;
		}

		const connectedNodeIds = new Set<string>();
		const connectedEdges = new Set<Edge>();

		const findConnections = (
			startId: string,
			direction: "upstream" | "downstream",
		) => {
			const queue = [startId];
			while (queue.length > 0) {
				const currentId = queue.shift();
				if (!currentId) continue;
				connectedNodeIds.add(currentId);

				allEdges.forEach((edge) => {
					if (direction === "downstream" && edge.source === currentId) {
						connectedEdges.add(edge);
						if (!connectedNodeIds.has(edge.target)) queue.push(edge.target);
					}
					if (direction === "upstream" && edge.target === currentId) {
						connectedEdges.add(edge);
						if (!connectedNodeIds.has(edge.source)) queue.push(edge.source);
					}
				});
			}
		};

		findConnections(selectedNodeId, "upstream");
		findConnections(selectedNodeId, "downstream");

		const filteredNodes = allNodes.filter((n) => connectedNodeIds.has(n.id));
		const filteredEdges = Array.from(connectedEdges).map(edge => ({
			...edge,
			animated: true, // Efecto de flujo en las flechas
		}));

		const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
			filteredNodes,
			filteredEdges,
		);

		setNodes(layoutedNodes);
		setEdges(layoutedEdges);
	}, [selectedNodeId, allNodes, allEdges, setNodes, setEdges]);

	const onConnect = useCallback(
		(params: Connection) => setEdges((eds) => addEdge(params, eds)),
		[setEdges],
	);

	const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setSelectedObjectType(e.target.value);
		setSelectedNodeId("");
	};

	const handleSchemaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setSelectedSchema(e.target.value);
		setSelectedNodeId("");
	};

	return (
		<div className="w-full h-full bg-slate-50 dark:bg-[#0f172a] relative overflow-hidden font-sans">
			<ReactFlow
				nodes={nodes}
				edges={edges}
				onNodesChange={onNodesChange}
				onEdgesChange={onEdgesChange}
				onConnect={onConnect}
				nodeTypes={nodeTypes}
				defaultEdgeOptions={{
					type: "smoothstep",
					markerEnd: { 
						type: MarkerType.ArrowClosed, 
						color: "#004b96", 
						width: 20,
						height: 20
					},
					style: { strokeWidth: 2, stroke: "#004b96", opacity: 0.4 },
				}}
				fitView
				minZoom={0.05}
				maxZoom={1.5}
			>
				<Background variant={BackgroundVariant.Dots} gap={24} size={1} color="#cbd5e1" className="dark:opacity-20" />
				<Controls className="!bg-white dark:!bg-slate-900 !border-slate-200 dark:!border-slate-800 !shadow-xl !rounded-xl overflow-hidden" />
				<MiniMap
					nodeColor={(n) => {
						if (n.type === "storedProcedure") return "#702082";
						if (n.type === "nifiGroup") return "#6366f1";
						return "#004b96";
					}}
					maskColor="rgba(15, 23, 42, 0.4)"
					className="!bg-white/50 dark:!bg-slate-900/50 !backdrop-blur-md !border-slate-200 dark:!border-slate-800 !shadow-xl !rounded-2xl !overflow-hidden !m-4"
				/>
				
				<Panel position="top-left" className="w-[440px] m-6">
					<motion.div 
						initial={{ x: -20, opacity: 0 }}
						animate={{ x: 0, opacity: 1 }}
						className="bg-white/95 dark:bg-[#1e293b]/95 backdrop-blur-2xl p-8 rounded-[2rem] border border-slate-200 dark:border-slate-700/50 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] flex flex-col gap-8"
					>
						<div className="flex flex-col gap-2">
							<div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#004b96] to-[#702082] text-white mb-2 shadow-lg shadow-[#004b96]/20">
								<span className="material-symbols-outlined text-3xl">
									clinical_notes
								</span>
							</div>
							<h1 className="text-3xl font-black text-[#111827] dark:text-white tracking-tight -mb-1">
								Lineage Architect
							</h1>
							<p className="text-[13px] text-slate-500 dark:text-slate-400 font-bold tracking-tight leading-relaxed flex items-center gap-2">
								<span className="w-2 h-2 rounded-full bg-[#004b96]" />
								GOBERNANZA DE DATOS UC CHRISTUS
							</p>
						</div>

						<div className="space-y-6">
							<div className="grid grid-cols-2 gap-4">
								<div className="flex flex-col gap-2.5">
									<label htmlFor="type-filter" className="text-[11px] font-black uppercase tracking-[0.2em] text-[#004b96] ml-1">
										Categoría
									</label>
									<select
										id="type-filter"
										className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-[1.25rem] p-4 text-sm font-bold text-slate-900 dark:text-white focus:ring-4 focus:ring-[#004b96]/10 transition-all cursor-pointer appearance-none shadow-sm hover:border-[#004b96]/30"
										value={selectedObjectType}
										onChange={handleTypeChange}
									>
										<option value="todos">Todos los Tipos</option>
										<option value="nifiGroup">Flujo NiFi</option>
										<option value="storedProcedure">Procedimiento SP</option>
										<option value="databaseTarget">Tablas / DWH</option>
									</select>
								</div>

								<div className="flex flex-col gap-2.5">
									<label htmlFor="schema-filter" className="text-[11px] font-black uppercase tracking-[0.2em] text-[#702082] ml-1">
										Esquema DB
									</label>
									<select
										id="schema-filter"
										className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-[1.25rem] p-4 text-sm font-bold text-slate-900 dark:text-white focus:ring-4 focus:ring-[#702082]/10 transition-all cursor-pointer appearance-none shadow-sm hover:border-[#702082]/30"
										value={selectedSchema}
										onChange={handleSchemaChange}
									>
										<option value="todos">Cualquier Esquema</option>
										{schemas.map((s) => (
											<option key={s} value={s}>{s}</option>
										))}
									</select>
								</div>
							</div>

							<div className="flex flex-col gap-2.5">
								<label htmlFor="node-inspector" className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-600 dark:text-slate-400 ml-1">
									Elemento de Inspección
								</label>
								<select
									id="node-inspector"
									className="w-full bg-white dark:bg-slate-800 border-2 border-[#004b96]/20 dark:border-[#004b96]/30 rounded-[1.25rem] p-4 text-sm text-[#004b96] dark:text-[#a5c9ff] focus:ring-4 focus:ring-[#004b96]/10 transition-all cursor-pointer appearance-none shadow-md font-black"
									value={selectedNodeId}
									onChange={(e) => setSelectedNodeId(e.target.value)}
								>
									<option value="">Selecciona un objeto para trazar...</option>
									{processOptions.map((opt) => {
										const optData = opt.data as unknown as LineageNodeData;
										return (
											<option key={opt.id} value={opt.id}>
												{optData.label}
											</option>
										);
									})}
								</select>
							</div>
						</div>

						{selectedNodeId && nodes.length > 0 ? (
							<motion.div 
								initial={{ scale: 0.9, opacity: 0 }}
								animate={{ scale: 1, opacity: 1 }}
								className="bg-gradient-to-r from-[#004b96] to-[#006bd6] text-white p-5 rounded-[1.5rem] flex items-center gap-4 shadow-[0_10px_25px_-5px_rgba(0,75,150,0.4)]"
							>
								<div className="flex-shrink-0 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
									<span className="material-symbols-outlined animate-pulse">verified</span>
								</div>
								<div>
									<div className="text-[11px] font-black uppercase tracking-wider opacity-90">Rastreo Completo</div>
									<div className="text-sm font-black">{nodes.length} Nodos identificados</div>
								</div>
							</motion.div>
						) : (
							<div className="bg-slate-50 dark:bg-slate-800/80 p-6 rounded-[1.5rem] text-center border-2 border-dashed border-slate-200 dark:border-slate-700">
								<span className="material-symbols-outlined text-slate-300 dark:text-slate-600 text-3xl mb-1">query_stats</span>
								<p className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest whitespace-nowrap">Trazo de Dependencias</p>
							</div>
						)}
					</motion.div>
				</Panel>
			</ReactFlow>

			<AnimatePresence>
				{isLoading && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-slate-50/80 dark:bg-[#0f172a]/80 backdrop-blur-xl"
					>
						<div className="flex flex-col items-center gap-6 p-12 rounded-[3.5rem] bg-white dark:bg-[#1e293b] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] border border-slate-200/50 dark:border-slate-700/50">
							<div className="relative">
								<motion.div
									animate={{ rotate: 360 }}
									transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
									className="w-20 h-20 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full"
								/>
								<div className="absolute inset-0 flex items-center justify-center">
									<span className="material-symbols-outlined text-4xl text-indigo-500 animate-pulse">hub</span>
								</div>
							</div>
							<div className="text-center space-y-2">
								<h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
									Arquitecto de Linaje
								</h3>
								<p className="text-sm text-slate-500 dark:text-slate-400 font-bold uppercase tracking-[0.2em]">
									Procesando Grafo...
								</p>
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
