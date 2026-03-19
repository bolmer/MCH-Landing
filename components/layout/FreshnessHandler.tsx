import { checkDataFreshness } from "../../lib/freshness";
import { FreshnessProvider } from "../../lib/FreshnessContext";
import { ChatWidget } from "../ChatWidget";
import { connection } from "next/server";

export default async function FreshnessHandler({ children }: { children: React.ReactNode }) {
    // 1. "Envenenar el pozo": Al acceder a connection(), Next.js sabe que este componente es dinámico
    // y permite el uso de APIs no-deterministas como new Date().
    await connection();

    // 2. Ahora el uso de new Date() es legal
    const freshness = await checkDataFreshness(new Date());

    if (!freshness.isFresh) {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        fetch(`${baseUrl}/api/governance/trigger`, { method: 'POST' }).catch(e => console.error("Auto-trigger failed:", e));
    }

    return (
        <FreshnessProvider initialStatus={freshness}>
            {children}
            <ChatWidget />
        </FreshnessProvider>
    );
}
