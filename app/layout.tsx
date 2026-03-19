import type { Metadata } from "next";
import { Outfit, Lora } from "next/font/google";
import "./globals.css";
import { ThemeEditor } from "./components/ThemeEditor";

const bodyFont = Outfit({
	subsets: ["latin"],
	weight: ["300", "400", "500", "600"],
	variable: "--font-body",
});

const displayFont = Outfit({
	subsets: ["latin"],
	weight: ["500", "600", "700"],
	variable: "--font-display",
});

const serifFont = Lora({
	subsets: ["latin"],
	weight: ["400", "500", "600"],
	style: ["normal", "italic"],
	variable: "--font-serif",
});

export const metadata: Metadata = {
	title: "bolmer.dev — Inteligencia antes que IA",
	description:
		"Suite de herramientas de datos e IA que funcionan. Sin humo, sin cajas negras, sin entregar tus datos a un chatbot.",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="es" suppressHydrationWarning>
			<head>
				<link
					rel="stylesheet"
					href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=block"
				/>
			</head>
			<body
				className={`${bodyFont.variable} ${displayFont.variable} ${serifFont.variable} bg-[#2A1D15] text-[#C4A88A] antialiased selection:bg-[#D4A373]/40`}
			>
				{children}
				<ThemeEditor />
			</body>
		</html>
	);
}
