import Sidebar from "@/components/layout/Sidebar";
import { ChatWidget } from "@/components/ChatWidget";
import { checkDataFreshness } from "@/lib/freshness";
import { FreshnessProvider } from "@/lib/FreshnessContext";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const freshness = await checkDataFreshness(new Date());

	if (process.env.NODE_ENV === "development" && !freshness.isFresh) {
		const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
		fetch(`${baseUrl}/api/governance/trigger`, { method: "POST" }).catch(
			(error) => console.error("Auto-trigger failed:", error),
		);
	}

	return (
		<div className="dark flex h-screen w-full overflow-hidden bg-background-dark text-white">
			<FreshnessProvider initialStatus={freshness}>
				<Sidebar />
				<div className="relative flex h-full flex-1 flex-col overflow-hidden">
					{children}
					<ChatWidget />
				</div>
			</FreshnessProvider>
		</div>
	);
}
