export const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface FlowProcessor {
    path: string;
    name: string;
    processor_name: string;
    type: string;
    action?: string;
    detail?: string;
    tables?: string;
    schedule?: string;
}

export interface NiFiFlowsResponse {
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

export async function fetchBackups(): Promise<string[]> {
    const res = await fetch(`${API_BASE}/api/nifi/backups`);
    if (!res.ok) throw new Error("Failed to fetch backups");
    return res.json();
}

export async function fetchFlowsSummary(): Promise<NiFiFlowsResponse> {
    const res = await fetch(`${API_BASE}/api/nifi/flows`);
    if (!res.ok) throw new Error("Failed to fetch flows summary");
    return res.json();
}

export async function fetchFlowDetails(filename: string) {
    const res = await fetch(`${API_BASE}/api/nifi/flow/${filename}`);
    if (!res.ok) throw new Error("Failed to fetch flow details");
    return res.json();
}

export async function triggerBackup() {
    const res = await fetch(`${API_BASE}/api/nifi/backup`, { method: "POST" });
    if (!res.ok) throw new Error("Failed to trigger backup");
    return res.json();
}

export async function fetchCurrentAlerts() {
    const res = await fetch(`${API_BASE}/api/alerts/current`);
    if (!res.ok) throw new Error("Failed to fetch alerts");
    return res.json();
}

export async function fetchLineage(filename: string) {
    const res = await fetch(`${API_BASE}/api/metadata/lineage/${filename}`);
    if (!res.ok) throw new Error("Failed to fetch lineage");
    return res.json();
}

export async function sendChatQuery(message: string, context_filename?: string) {
    const res = await fetch(`${API_BASE}/api/chat/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, context_filename }),
    });
    if (!res.ok) throw new Error("Failed to communicate with AI Chat");
    return res.json();
}

export const api = {
    nifi: {
        getBackups: fetchBackups,
        getFlows: fetchFlowsSummary,
        getFlowDetails: fetchFlowDetails,
        triggerBackup: triggerBackup,
    },
    alerts: {
        getCurrent: fetchCurrentAlerts,
    },
    metadata: {
        getLineage: fetchLineage,
    },
    chat: {
        sendQuery: sendChatQuery,
    }
};
