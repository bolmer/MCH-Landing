
"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface FreshnessContextType {
    isFresh: boolean;
    lastRun: Date | null;
    status: string;
    initialLoading: boolean;
    refreshFreshness: () => void;
}

const FreshnessContext = createContext<FreshnessContextType>({} as any);

export function FreshnessProvider({ children, initialStatus }: any) {
    const [status, setStatus] = useState(initialStatus || { isFresh: false, status: 'UNKNOWN' });
    const [loading, setLoading] = useState(false);

    const refreshFreshness = async () => {
        setLoading(true);
        try {
            // Disparar ciclo
            await fetch('/api/governance/trigger', { method: 'POST' });
            // Aquí podríamos hacer polling, por ahora asumimos éxito y recargamos la página entera
            window.location.reload();
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <FreshnessContext.Provider value={{ ...status, initialLoading: loading, refreshFreshness }}>
            {children}
        </FreshnessContext.Provider>
    );
}

export const useFreshness = () => useContext(FreshnessContext);
