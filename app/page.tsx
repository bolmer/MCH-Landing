import { cookies } from "next/headers";
import Link from "next/link";
import { getTranslations, normalizeLocale } from "@/app/i18n";
import { LanguageToggle } from "@/app/components/language-toggle";
import { ScrollReveal } from "@/app/components/scroll-reveal";
import { SplitText } from "@/app/components/SplitText";
import { DecryptedText } from "@/app/components/DecryptedText";
import type { Locale, Translations } from "@/app/i18n";
import "./noise.css";

function stageClass(stage: string): string {
	const s = stage.toLowerCase();
	if (s === "live") return "stage-live";
	if (s.includes("beta")) return "stage-private-beta";
	return "stage-early-access";
}

import { Suspense } from "react";

export default function Page() {
	return (
		<Suspense fallback={null}>
			<LandingPageContent />
		</Suspense>
	);
}

async function LandingPageContent() {
	const cookieStore = await cookies();
	const locale = normalizeLocale(cookieStore.get("locale")?.value) as Locale;
	const t = getTranslations(locale);

	const trustIcons = ["cloud_download", "code"];

	return (
		<div className="relative min-h-[100dvh] bg-crumb-1 selection:bg-crust-light/30">
			{/* ─── Navbar ─── */}
			<nav className="sticky top-0 z-50 border-b border-crust-light/30 bg-crumb-2/95 backdrop-blur-sm">
				<div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-4">
					<span className="font-display text-lg font-bold tracking-tight text-crust-dark">
						<DecryptedText text="mchicao.dev" speed={120} maxIterations={12} />
					</span>
					<div className="flex items-center gap-3 md:gap-6">
						<a
							href="#products"
							className="hidden text-sm font-medium text-crust-toasted transition-colors hover:text-crust-dark md:block"
						>
							{t.nav.products}
						</a>
						<a
							href="#method"
							className="hidden text-sm font-medium text-crust-toasted transition-colors hover:text-crust-dark md:block"
						>
							{t.nav.method}
						</a>
						<LanguageToggle current={locale} />
						<Link
							href="/dashboard"
							className="whitespace-nowrap rounded-full border border-crust-golden/40 bg-crust-golden/10 px-4 py-2 text-sm font-medium text-crust-toasted transition-all hover:bg-crust-golden/20 hover:text-crust-dark md:px-5"
						>
							{t.nav.dashboard}
						</Link>
					</div>
				</div>
			</nav>

			{/* ─── Hero: Asymmetric — text left, code right ─── */}
			<section className="mx-auto grid max-w-[1400px] gap-12 px-6 pb-24 pt-20 md:grid-cols-2 md:items-center md:pt-32">
				<div>
					<span
						className="animate-fade-up mb-6 inline-flex items-center gap-2 rounded-full border border-crust-light/50 bg-crumb-2/80 px-4 py-1.5 text-xs font-semibold text-crust-toasted"
						style={{ "--delay": "0ms" } as React.CSSProperties}
					>
						<span className="inline-block h-2.5 w-2.5 rounded-full bg-crust-golden" />
						{t.hero.badge}
					</span>

					<div className="hero-glow">
						<h1
							className="animate-fade-up font-display text-5xl font-bold leading-[1.05] tracking-[-0.02em] text-crust-dark md:text-[4rem]"
							style={{ "--delay": "80ms" } as React.CSSProperties}
						>
							<SplitText text={t.hero.headline1} delay={0.1} />
							<br />
							<SplitText text={t.hero.headline2} delay={0.3} />{" "}
							<em className="font-serif not-italic font-medium text-crust-golden">
								{t.hero.headlineAccent}
							</em>
							.
						</h1>
					</div>

					<p
						className="animate-fade-up mt-6 max-w-lg text-lg leading-relaxed text-crust-toasted"
						style={{ "--delay": "160ms" } as React.CSSProperties}
					>
						{t.hero.sub}
					</p>

					<p
						className="animate-fade-up mt-3 max-w-lg text-sm font-medium leading-relaxed text-crust-muted"
						style={{ "--delay": "220ms" } as React.CSSProperties}
					>
						{t.hero.antiSlop}
					</p>

					<div
						className="animate-fade-up mt-10 flex flex-wrap gap-4"
						style={{ "--delay": "300ms" } as React.CSSProperties}
					>
						<a
							href="#products"
							className="rounded-full bg-crust-golden px-8 py-3.5 text-sm font-bold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md active:translate-y-0"
						>
							{t.hero.cta1}
						</a>
						<a
							href="mailto:matiaschicao@hotmail.com?subject=Demo%20Request"
							className="rounded-full border border-crust-light bg-crumb-2 px-8 py-3.5 text-sm font-semibold text-crust-toasted transition-all hover:border-crust-golden hover:text-crust-dark active:bg-crumb-1"
						>
							{t.hero.cta2} &rarr;
						</a>
					</div>
				</div>

				{/* Deployment sovereignty visual — right column */}
				<div
					className="animate-fade-up hidden md:flex flex-col items-center justify-center gap-8"
					style={{ "--delay": "200ms" } as React.CSSProperties}
				>
					<div className="grid grid-cols-3 gap-6">
						{[
							{ icon: "laptop_mac", label: t.heroDeployment.local },
							{ icon: "dns", label: t.heroDeployment.managed },
							{ icon: "cloud", label: t.heroDeployment.cloud },
						].map((opt) => (
							<div
								key={opt.icon}
								className="flex flex-col items-center gap-3 rounded-2xl border border-crust-light/40 bg-crumb-2 px-6 py-8 shadow-sm transition-all hover:border-crust-golden/60 hover:shadow-md"
							>
								<span className="material-icon-inline !text-4xl">
									{opt.icon}
								</span>
								<span className="text-sm font-semibold text-crust-toasted">
									{opt.label}
								</span>
							</div>
						))}
					</div>
					<p className="font-display text-2xl font-bold text-crust-golden tracking-tight">
						{t.heroDeployment.tagline}
					</p>
				</div>
			</section>

			{/* ─── Trust / Security ─── */}
			<section className="border-t border-crust-light/20 bg-crumb-2/30">
				<ScrollReveal>
					<div className="mx-auto max-w-[1400px] px-6 py-24">
						<span className="text-xs font-bold uppercase tracking-[0.2em] text-crust-golden">
							{t.trust.label}
						</span>
						<h2 className="mt-4 font-display text-4xl font-bold tracking-[-0.02em] text-crust-dark md:text-5xl">
							{t.trust.headline}
						</h2>
						<p className="mt-5 max-w-xl text-lg text-crust-toasted">
							{t.trust.sub}
						</p>

						<div className="mt-14 grid gap-6 md:grid-cols-2">
							{t.trust.cards.map((card, i) => (
								<div
									key={card.title}
									className="card-lift rounded-3xl border border-crust-light/30 bg-white/60 p-10 shadow-sm transition-all hover:border-crust-golden/40 hover:shadow-md"
								>
									<span className="material-icon-inline mb-6 block !text-crust-golden text-3xl">
										{trustIcons[i]}
									</span>
									<h3 className="font-display text-xl font-bold text-crust-dark">
										{card.title}
									</h3>
									<p className="mt-4 text-base leading-relaxed text-crust-toasted">
										{card.text}
									</p>
								</div>
							))}
						</div>
					</div>
				</ScrollReveal>
			</section>

			{/* ─── How it works: SaaS adoption flow ─── */}
			<section className="border-t border-crust-light/20">
				<ScrollReveal>
					<div className="mx-auto max-w-[1400px] px-6 py-24">
						<span className="text-xs font-bold uppercase tracking-[0.2em] text-crust-golden">
							{t.howItWorks.label}
						</span>
						<h2 className="mt-4 font-display text-4xl font-bold tracking-[-0.02em] text-crust-dark md:text-5xl">
							{t.howItWorks.headline}
						</h2>

						<div className="mt-20 grid gap-16 md:grid-cols-3 md:gap-10">
							{t.howItWorks.steps.map((step) => (
								<div key={step.num} className="step-connector">
									<span className="font-serif text-6xl font-bold text-crust-muted/70">
										{step.num}
									</span>
									<h3 className="mt-6 font-display text-xl font-bold text-crust-dark">
										{step.title}
									</h3>
									<p className="mt-4 text-base leading-relaxed text-crust-toasted">
										{step.description}
									</p>
								</div>
							))}
						</div>
					</div>
				</ScrollReveal>
			</section>

			{/* ─── Product suite ─── */}
			<section id="products" className="border-t border-crust-light/20 bg-crumb-2/20">
				<ScrollReveal>
					<div className="mx-auto max-w-[1400px] px-6 py-24">
						<span className="text-xs font-bold uppercase tracking-[0.2em] text-crust-golden">
							{t.products.label}
						</span>
						<h2 className="mt-4 font-display text-4xl font-bold tracking-[-0.02em] text-crust-dark md:text-5xl">
							{t.products.headline1}{" "}
							<em className="font-serif not-italic font-medium text-crust-golden">
								{t.products.headlineAccent}
							</em>
							{t.products.headline2}
						</h2>
						<p className="mt-5 max-w-xl text-lg text-crust-toasted">
							{t.products.sub}
						</p>

						{/* Featured products: Sticky Stacking Cards */}
						<div className="mt-16 pb-32">
							{t.products.items.map((product, i) => (
								<div
									key={product.name}
									className="sticky mb-10 md:mb-16"
									style={{ top: `calc(130px + ${i * 70}px)` }}
								>
									<ProductCard
										product={product}
										isFeatured={i < 2}
									/>
								</div>
							))}
						</div>
					</div>
				</ScrollReveal>
			</section>

			{/* ─── Method ─── */}
			<section id="method" className="border-t border-crust-light/20 bg-crumb-2">
				<ScrollReveal>
					<div className="mx-auto max-w-[1400px] px-6 py-24">
						<span className="text-xs font-bold uppercase tracking-[0.2em] text-crust-golden">
							{t.method.label}
						</span>
						<h2 className="mt-4 font-display text-4xl font-bold tracking-[-0.02em] text-crust-dark md:text-5xl">
							{t.method.headline1}{" "}
							<em className="font-serif not-italic font-medium text-crust-golden">
								{t.method.headlineAccent}
							</em>
							.
						</h2>
						<p className="mt-5 max-w-xl text-lg text-crust-toasted">
							{t.method.sub}
						</p>

						<div className="mt-14 grid gap-8 md:grid-cols-2">
							<div className="card-lift rounded-3xl border border-crust-light/30 bg-white/60 p-10 shadow-sm">
								<span className="material-icon-inline mb-6 block text-3xl">
									build
								</span>
								<h3 className="font-display text-xl font-bold text-crust-dark">
									{t.method.card1Title}
								</h3>
								<p className="mt-4 text-base leading-relaxed text-crust-toasted">
									{t.method.card1Text}
								</p>
							</div>
							<div className="card-lift rounded-3xl border border-status-red/10 bg-status-red/5 p-10">
								<span className="material-icon-inline mb-6 block !text-status-red/60 text-3xl">
									block
								</span>
								<h3 className="font-display text-xl font-bold text-status-red/90">
									{t.method.card2Title}
								</h3>
								<p className="mt-4 text-base leading-relaxed text-crust-toasted">
									{t.method.card2Text}
								</p>
							</div>
						</div>
					</div>
				</ScrollReveal>
			</section>

			{/* ─── Under the Hood ─── */}
			<section className="border-t border-crust-light/20 bg-crumb-2/20">
				<ScrollReveal>
					<div className="mx-auto max-w-[1400px] px-6 py-24">
						<span className="text-xs font-bold uppercase tracking-[0.2em] text-crust-golden">
							{t.underTheHood.label}
						</span>
						<h2 className="mt-4 font-display text-4xl font-bold tracking-[-0.02em] text-crust-dark md:text-5xl">
							{t.underTheHood.headline}
						</h2>
						<p className="mt-5 max-w-xl text-lg text-crust-toasted">
							{t.underTheHood.sub}
						</p>

						<div className="mt-14 grid gap-8 md:grid-cols-[1fr_auto] md:items-start">
							{/* Code block */}
							<div className="overflow-hidden rounded-3xl border border-[#3D261A]/20 bg-[#2A1D15] shadow-lg font-mono text-[13px] leading-relaxed text-[#C4A88A]">
								<div className="flex items-center gap-2 border-b border-[#C4A88A]/15 px-5 py-4 bg-[#382920]">
									<span className="h-3 w-3 rounded-full bg-[#C4A88A]/40" />
									<span className="h-3 w-3 rounded-full bg-[#C4A88A]/40" />
									<span className="h-3 w-3 rounded-full bg-[#C4A88A]/40" />
									<span className="ml-4 text-xs font-semibold text-[#B8A08A]">
										governance/audit.py
									</span>
								</div>
								<pre className="overflow-x-auto p-6">
									<code>
										<span className="text-[#B8A08A] italic">{t.codeComment}</span>
										{"\n\n"}
										<span className="font-semibold text-[#D4A373]">def </span>
										<span className="font-bold text-[#F2E4D4]">audit_data_asset</span>
										<span className="text-[#C4A88A]">
											(asset_id: str, config: AuditConfig) -&gt; AuditReport:
										</span>
										{"\n"}
										<span className="text-[#E8C899]">
											{"    "}{t.codeDocstring1}
										</span>
										{"\n"}
										<span className="text-[#E8C899]">
											{"    "}{t.codeDocstring2}
										</span>
										{"\n"}
										<span className="text-[#E8C899]">{"    "}"""</span>
										{"\n\n"}
										<span className="text-[#C4A88A]">
											{"    "}asset = catalog.get(asset_id)
										</span>
										{"\n"}
										<span className="text-[#C4A88A]">{"    "}checks = [</span>
										{"\n"}
										<span className="text-[#C4A88A]">
											{"        "}validate_schema(asset, config.expected_schema),
										</span>
										<span className="code-annotation ml-4">{t.codeAnnotation1}</span>
										{"\n"}
										<span className="text-[#C4A88A]">
											{"        "}check_freshness(asset, max_staleness_hours=config.sla_hours),
										</span>
										<span className="code-annotation ml-4">{t.codeAnnotation2}</span>
										{"\n"}
										<span className="text-[#C4A88A]">{"    "}]</span>
										{"\n\n"}
										<span className="text-[#C4A88A]">
											{"    "}findings = [c{" "}
											<span className="font-semibold text-[#D4A373]">for</span> c{" "}
											<span className="font-semibold text-[#D4A373]">in</span> checks{" "}
											<span className="font-semibold text-[#D4A373]">if</span> c.severity != Severity.OK]
										</span>
										<span className="code-annotation ml-4">{t.codeAnnotation3}</span>
										{"\n"}
										<span className="text-[#C4A88A]">
											{"    "}
											<span className="font-semibold text-[#D4A373]">return</span>{" "}
											AuditReport(asset=asset, findings=findings)
										</span>
									</code>
								</pre>
							</div>
						</div>
					</div>
				</ScrollReveal>
			</section>

			{/* ─── Final CTA ─── */}
			<div className="gradient-separator" />
			<section className="relative overflow-hidden bg-crumb-2/60">
				<ScrollReveal>
					<div className="mx-auto max-w-[1400px] px-6 py-32 text-center">
						<h2 className="font-display text-4xl font-bold tracking-[-0.02em] text-crust-dark md:text-6xl">
							{t.cta.headline1}{" "}
							<em className="font-serif not-italic font-medium text-crust-golden">
								{t.cta.headlineAccent}
							</em>
							.
						</h2>
						<p className="mx-auto mt-6 max-w-xl text-lg text-crust-toasted">
							{t.cta.sub}
						</p>
						<div className="mt-10 flex flex-wrap justify-center gap-5">
							<a
								href="mailto:matiaschicao@hotmail.com?subject=Demo%20Request"
								className="rounded-full bg-crust-golden px-10 py-4 text-base font-bold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md active:translate-y-0"
							>
								{t.cta.ctaPrimary}
							</a>
							<a
								href="mailto:matiaschicao@hotmail.com?subject=Waitlist"
								className="rounded-full border-2 border-crust-light/40 bg-crumb-1 px-10 py-4 text-base font-bold text-crust-toasted transition-all hover:border-crust-golden hover:text-crust-dark active:bg-crumb-2"
							>
								{t.cta.ctaSecondary}
							</a>
						</div>
					</div>
				</ScrollReveal>
			</section>

			{/* ─── Footer ─── */}
			<footer className="border-t border-crust-light/20 bg-crumb-1">
				<div className="mx-auto flex max-w-[1400px] flex-col items-center justify-between gap-4 px-6 py-10 text-sm text-crust-toasted md:flex-row">
					<div>
						<span className="font-display font-bold text-crust-dark">
							<DecryptedText text="mchicao.dev" speed={120} maxIterations={12} />
						</span>
						<span className="ml-3 font-medium">{t.footer.line1}</span>
					</div>
					<span className="text-xs font-semibold text-crust-muted">{t.footer.line2}</span>
				</div>
			</footer>
		</div>
	);
}

/* ─── Product Card ─── */
function ProductCard({
	product,
	isFeatured = false,
}: {
	product: Translations["products"]["items"][number];
	isFeatured?: boolean;
}) {
	return (
		<div
			className={`stacked-card group p-8 md:p-10 ${isFeatured ? "product-featured" : ""}`}
		>
			<div className="mb-6 flex items-center justify-between border-b border-crust-light/20 pb-5">
				<span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-crust-muted">
					{product.techContext}
				</span>
				<span
					className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${stageClass(product.stage)}`}
				>
					{product.stage}
				</span>
			</div>

			<div className="flex flex-col gap-2">
				<h3 className="font-display text-2xl font-bold text-crust-dark">
					{product.name}
				</h3>
				<p className="text-sm font-semibold text-crust-golden">
					{product.objective}
				</p>
			</div>

			<p className="mt-5 max-w-2xl text-base leading-relaxed text-crust-toasted">
				{product.summary}
			</p>

			<ul className="mt-8 flex flex-wrap gap-2.5">
				{product.capabilities.map((cap) => (
					<li
						key={cap}
						className="rounded-xl border border-crust-light/30 bg-crumb-2/50 px-3 py-1.5 text-xs font-medium text-crust-toasted transition-colors group-hover:border-crust-light group-hover:text-crust-dark"
					>
						{cap}
					</li>
				))}
			</ul>
		</div>
	);
}
