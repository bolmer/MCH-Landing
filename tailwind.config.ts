import type { Config } from "tailwindcss";

const config: Config = {
	content: [
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			colors: {
				crumb: {
					1: "rgb(var(--color-crumb-1) / <alpha-value>)", // Warm cream — main background
					2: "rgb(var(--color-crumb-2) / <alpha-value>)", // Toasted cream — secondary surfaces / cards
				},
				crust: {
					light: "rgb(var(--color-crust-light) / <alpha-value>)",  // Warm sand — borders, hover states
					golden: "rgb(var(--color-crust-golden) / <alpha-value>)", // Deep amber — accent (contrast-safe on light BG)
					toasted: "rgb(var(--color-crust-toasted) / <alpha-value>)", // Warm brown — body text
					dark: "rgb(var(--color-crust-dark) / <alpha-value>)",    // Dark coffee — primary headings (max contrast)
					muted: "rgb(var(--color-crust-muted) / <alpha-value>)",   // Dusty brown — secondary text
				},
				status: {
					green: "rgb(var(--color-status-green) / <alpha-value>)",
					red: "rgb(var(--color-status-red) / <alpha-value>)",
					amber: "rgb(var(--color-status-amber) / <alpha-value>)",
				},
			},
			fontFamily: {
				display: ["var(--font-display)", "sans-serif"],
				body: ["var(--font-body)", "sans-serif"],
				serif: ["var(--font-serif)", "serif"],
			},
			borderRadius: {
				DEFAULT: "0.5rem",
				lg: "1rem",
				xl: "1.5rem",
				"2xl": "2rem",
				full: "9999px",
			},
		},
	},
	plugins: [require("@tailwindcss/forms")],
};

export default config;
