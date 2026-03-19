
"use client";

import { useFreshness } from "../lib/FreshnessContext";
import { formatDistance, format } from "date-fns";
import { es } from "date-fns/locale";

export default function FreshnessIndicator() {
    const { isFresh, lastRun, status, initialLoading, refreshFreshness } = useFreshness();

    if (initialLoading) {
        return (
            <div className="flex items-center space-x-2 text-blue-500 animate-pulse bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full text-xs font-medium border border-blue-100 dark:border-blue-800">
                <span className="material-symbols-outlined text-sm animate-spin">sync</span>
                <span>Actualizando NIFI...</span>
            </div>
        );
    }

    let color = "text-gray-500 bg-gray-50 border-gray-100";
    let icon = "schedule";
    const dateStr = lastRun ? formatDistance(new Date(lastRun), new Date(), { locale: es, addSuffix: true }) : "N/A";

    if (isFresh) {
        color = "text-emerald-600 bg-emerald-50 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800";
        icon = "check_circle";
    } else if (status === 'FAILED') {
        color = "text-red-600 bg-red-50 border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800";
        icon = "error";
    } else if (!isFresh) {
        // Obsoleto
        color = "text-amber-600 bg-amber-50 border-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800";
        icon = "history";
    }

    return (
        <div
            onClick={refreshFreshness}
            className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium border cursor-pointer hover:opacity-80 transition-opacity ${color}`}
            title={`Ultima ejecución: ${lastRun ? format(new Date(lastRun), "PPpp", { locale: es }) : "Nunca"}`}
        >
            <span className="material-symbols-outlined text-sm">{icon}</span>
            <span>{isFresh ? "Datos al día" : `Obs.: ${dateStr}`}</span>
        </div>
    );
}
