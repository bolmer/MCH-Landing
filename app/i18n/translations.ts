export type Locale = "es" | "en";

interface TrustCard {
	title: string;
	text: string;
}

interface Step {
	num: string;
	title: string;
	description: string;
}

interface Product {
	name: string;
	stage: string;
	objective: string;
	summary: string;
	techContext: string;
	capabilities: string[];
}

export interface Translations {
	nav: { products: string; method: string; dashboard: string };
	hero: {
		badge: string;
		headline1: string;
		headline2: string;
		headlineAccent: string;
		sub: string;
		antiSlop: string;
		cta1: string;
		cta2: string;
	};
	trust: {
		label: string;
		headline: string;
		sub: string;
		cards: [TrustCard, TrustCard];
	};
	howItWorks: {
		label: string;
		headline: string;
		steps: [Step, Step, Step];
	};
	products: {
		label: string;
		headline1: string;
		headlineAccent: string;
		headline2: string;
		sub: string;
		items: Product[];
	};
	method: {
		label: string;
		headline1: string;
		headlineAccent: string;
		sub: string;
		card1Title: string;
		card1Text: string;
		card2Title: string;
		card2Text: string;
	};
	cta: {
		headline1: string;
		headlineAccent: string;
		sub: string;
		ctaPrimary: string;
		ctaSecondary: string;
	};
	footer: { line1: string; line2: string };
	codeComment: string;
	codeDocstring1: string;
	codeDocstring2: string;
	codeAnnotation1: string;
	codeAnnotation2: string;
	codeAnnotation3: string;
	underTheHood: {
		label: string;
		headline: string;
		sub: string;
	};
	heroDeployment: {
		local: string;
		managed: string;
		cloud: string;
		tagline: string;
	};
}

export const translations: Record<Locale, Translations> = {
	es: {
		nav: {
			products: "Productos",
			method: "Método",
			dashboard: "Dashboard",
		},
		hero: {
			badge: "Suite de datos · Despliega donde quieras · Sin cajas negras",
			headline1: "Inteligencia",
			headline2: "antes que",
			headlineAccent: "IA",
			sub: "Herramientas de datos especializadas con impacto real. Sin cajas negras, sin sorpresas.",
			antiSlop:
				"Otros intentan venderte IA cuando ni siquiera tiene sentido, solo para que gastes más. Nosotros construimos software que realmente funciona, sin que nadie tenga que ser experto.",
			cta1: "Explorar productos",
			cta2: "Solicitar demo",
		},
		trust: {
			label: "Privacidad y Control",
			headline: "Tus datos nunca salen de tu empresa.",
			sub: "Sabemos que la confidencialidad es crítica. Nuestras herramientas operan directamente en tus equipos o red segura, garantizando que tu información sensible jamás se comparta con terceros.",
			cards: [
				{
					title: "Funciona en tus propios equipos",
					text: "En lugar de enviar tus documentos a la nube, nuestras soluciones corren localmente en tus computadores o servidores privados. Tus datos clínicos, financieros y comerciales se mantienen 100% bajo tu control.",
				},
				{
					title: "Seguridad sin misterios",
					text: "A diferencia de plataformas que operan como cajas negras, aquí tienes certeza absoluta sobre cómo se maneja tu información. Cero fugas de datos y cumplimiento total con normativas de privacidad corporativas.",
				},
			],
		},
		howItWorks: {
			label: "Cómo funciona",
			headline: "De problema a operación en tres pasos.",
			steps: [
				{
					num: "01",
					title: "Identificar el cuello de botella",
					description:
						"¿Datos duplicados? ¿Reportes que se rompen los lunes? ¿Auditorías que toman semanas? Cada herramienta ataca un problema concreto.",
				},
				{
					num: "02",
					title: "Activar la herramienta correcta",
					description:
						"Sin implementaciones de meses. Se activa el producto para el problema, se conecta a la infraestructura existente, y empieza a funcionar.",
				},
				{
					num: "03",
					title: "Escalar las operaciones",
					description:
						"Lo que empieza resolviendo un problema puntual se convierte en la base operativa del equipo. Monitoreo, trazabilidad y documentación automática.",
				},
			],
		},
		products: {
			label: "Productos",
			headline1: "Suite de herramientas que",
			headlineAccent: "impactan",
			headline2: ".",
			sub: "Cada producto ataca un problema específico de datos. Se despliegan de forma independiente y escalan con la operación.",
			items: [
				{
					name: "Data Governance Chat Bot",
					stage: "MVP",
					objective:
						"Consultas instantáneas sobre políticas y metadatos",
					summary:
						"Asistente conversacional especializado en estructuras de datos internas, reglas de negocio y políticas de gobernanza. Encuentra definiciones sin revisar wikis desactualizadas.",
					techContext: "LLMs locales · RAG · Redshift · FastAPI",
					capabilities: [
						"Chat interactivo sobre metadatos",
						"Resolución de linaje en lenguaje natural",
						"Soporte 24/7 para equipos de analítica",
					],
				},
				{
					name: "Data Governance Auto Documentator",
					stage: "MVP",
					objective:
						"Generación automática de documentación técnica",
					summary:
						"Documentador autónomo de flujos de valor. Escanea DB, ETLs, DAX de Power BI, Schedulers, AWS y clústeres NiFi para generar diccionarios de datos y mapas de linaje precisos.",
					techContext: "Python · AST Parsing · NiFi API · AWS SDK",
					capabilities: [
						"Soporta DB, ETL, PBI DAX, Schedulers, AWS, NIFI",
						"Actualización continua del glosario técnico",
						"Mapeo de dependencias end-to-end",
					],
				},
				{
					name: "OCR to Word for Translations",
					stage: "MVP",
					objective:
						"Conversión precisa de imágenes a documentos editables",
					summary:
						"Motor OCR diseñado para traductores. Respeta el formato original y genera archivos de Word (DOCX) limpios, facilitando la integración con herramientas CAT y Memorias de Traducción.",
					techContext: "Python · Tesseract · OpenCV · docx",
					capabilities: [
						"Extracción de texto multilingüe",
						"Preservación de layouts y tablas",
						"Exportación nativa a entornos de traducción",
					],
				},
				{
					name: "Audio CC for meetings",
					stage: "MVP",
					objective:
						"Subtítulos (CC) locales en vivo para reuniones y traducciones",
					summary:
						"Generación de subtítulos (Closed Captions) en tiempo real para cualquier plataforma de videollamada. Facilita la comprensión y traducción simultánea sin latencia visible.",
					techContext: "Whisper · Local AI · WASAPI",
					capabilities: [
						"Subtítulos en tiempo real",
						"Agnóstico a la plataforma (Teams, Zoom, Meet)",
						"Privacidad total via procesamiento local",
					],
				},
				{
					name: "Tableau \u2192 Power BI Migrator",
					stage: "MVP",
					objective:
						"Migración automática de dashboards sin reconstrucción manual",
					summary:
						"Convierte workbooks de Tableau a reportes de Power BI automáticamente. Analiza campos calculados, relaciones y layouts visuales mediante análisis AST, sin necesidad de recrear manualmente.",
					techContext: "Python · AST Parsing · Tableau API · PBIR",
					capabilities: [
						"Conversión automática de campos calculados",
						"Preservación de layouts visuales",
						"Mapeo de relaciones y fuentes de datos",
					],
				},
				{
					name: "Mindsight",
					stage: "MVP",
					objective:
						"Dashboard de bienestar físico y mental con foco en el sueño",
					summary:
						"Plataforma de salud personal que mide, visualiza y gamifica hábitos de sueño y bienestar. Convierte datos de salud en métricas accionables para mejorar la calidad de vida día a día.",
					techContext: "Next.js · Health APIs · Gamification · Charts",
					capabilities: [
						"Tracking de sueño y métricas de bienestar",
						"Gamificación con sistema de logros",
						"Visualización de tendencias y patrones",
					],
				},
			],
		},
		method: {
			label: "Método",
			headline1: "Ingeniería, no",
			headlineAccent: "magia",
			sub: "La IA es una herramienta, no una religión. La usamos donde realmente reduce trabajo y la descartamos donde una solución más simple hace lo mismo. Lo que importa: que el producto funcione, se entienda y se pueda mantener.",
			card1Title: "Lo que construimos",
			card1Text:
				"Herramientas que simplifican problemas reales: organización de datos, búsqueda inteligente, auditoría automática, bienestar medible.",
			card2Title: "Lo que no hacemos",
			card2Text:
				"Venderte IA solo para inflar el precio. Demos que solo funcionan en la presentación. Agregar complejidad donde una herramienta más simple sería más rápida, barata y confiable.",
		},
		cta: {
			headline1: "El código está",
			headlineAccent: "abierto",
			sub: "Explora los productos, prueba las herramientas, o agenda una demo directamente.",
			ctaPrimary: "Solicitar demo",
			ctaSecondary: "Unirse al waitlist",
		},
		footer: {
			line1: "Suite de herramientas de datos e inteligencia aplicada.",
			line2: "Gobernanza · IA aplicada · Agentes · Automatización",
		},
		codeComment: "# governance/audit.py — Sin magia, solo ingeniería",
		codeDocstring1: '"""Auditoría técnica completa. Sin prompts,',
		codeDocstring2: "sin wrappers. Validación real sobre datos reales.",
		codeAnnotation1: "Valida que la estructura de datos no haya cambiado",
		codeAnnotation2: "Detecta datos desactualizados antes de que rompan reportes",
		codeAnnotation3: "Muestra solo lo que realmente falló",
		underTheHood: {
			label: "Bajo el capó",
			headline: "Código real. Sin trucos.",
			sub: "Así se ve una auditoría de gobernanza por dentro. Sin prompts, sin capas intermedias — lógica directa sobre datos reales.",
		},
		heroDeployment: {
			local: "Tus equipos",
			managed: "Nuestros servidores",
			cloud: "La nube",
			tagline: "Tú decides.",
		},
	},
	en: {
		nav: {
			products: "Products",
			method: "Method",
			dashboard: "Dashboard",
		},
		hero: {
			badge: "Data tools suite · Deploy anywhere · No black boxes",
			headline1: "Intelligence",
			headline2: "before",
			headlineAccent: "AI",
			sub: "Specialized data tools built for real problems. No black boxes, no surprises.",
			antiSlop:
				"Others try to sell you AI when it doesn\u2019t even make sense, just so you spend more. We build software that actually works, without anyone needing to be an expert.",
			cta1: "Explore products",
			cta2: "Book a demo",
		},
		trust: {
			label: "Security & deployment",
			headline: "Your infrastructure. Your rules.",
			sub: "Every tool runs where you decide. On your local machines, on our servers, or in your own cloud. No forced dependencies, no hidden transfers.",
			cards: [
				{
					title: "Deploy anywhere",
					text: "On your PCs, on our servers, or in the Cloud. You choose. Each tool works fully offline or connected — it\u2019s your call.",
				},
				{
					title: "Open source, auditable",
					text: "Every pipeline is inspectable. No hidden API calls, no opaque models. We don\u2019t ask for trust — we hand you the source code.",
				},
			],
		},
		howItWorks: {
			label: "How it works",
			headline: "From bottleneck to operations in three steps.",
			steps: [
				{
					num: "01",
					title: "Identify the bottleneck",
					description:
						"Duplicate data? Reports that break on Mondays? Audits that take weeks? Each tool targets a specific problem.",
				},
				{
					num: "02",
					title: "Deploy the right tool",
					description:
						"No month-long implementations. Activate the product that solves it, connect to existing infrastructure, and it starts working.",
				},
				{
					num: "03",
					title: "Scale operations",
					description:
						"What starts solving a single problem becomes the team's operational backbone. Monitoring, traceability and automatic documentation.",
				},
			],
		},
		products: {
			label: "Products",
			headline1: "A suite of tools that",
			headlineAccent: "get it done",
			headline2: ".",
			sub: "Each product targets a specific data problem. Deployed independently and scaled with operations.",
			items: [
				{
					name: "Data Governance Chat Bot",
					stage: "MVP",
					objective:
						"Instant queries about policies and metadata",
					summary:
						"Conversational assistant specialized in internal data structures, business rules, and governance policies. Find definitions without checking outdated wikis.",
					techContext: "Local LLMs · RAG · Redshift · FastAPI",
					capabilities: [
						"Interactive metadata chat",
						"Lineage resolution in natural language",
						"24/7 support for analytics teams",
					],
				},
				{
					name: "Data Governance Auto Documentator",
					stage: "MVP",
					objective:
						"Automatic technical documentation generation",
					summary:
						"Autonomous value-stream documentor. Scans DBs, ETLs, Power BI DAX, Schedulers, AWS, and NiFi clusters to generate accurate data dictionaries and lineage maps.",
					techContext: "Python · AST Parsing · NiFi API · AWS SDK",
					capabilities: [
						"Supports DB, ETL, PBI DAX, Schedulers, AWS, NIFI",
						"Continuous technical glossary updates",
						"End-to-end dependency mapping",
					],
				},
				{
					name: "OCR to Word for Translations",
					stage: "MVP",
					objective:
						"Accurate image to editable document conversion",
					summary:
						"OCR engine designed for translators. Respects original formatting and outputs clean Word (DOCX) files, ready for CAT tools and Translation Memories.",
					techContext: "Python · Tesseract · OpenCV · docx",
					capabilities: [
						"Multilingual text extraction",
						"Layout and table preservation",
						"Native export to translation pipelines",
					],
				},
				{
					name: "Audio CC for meetings",
					stage: "MVP",
					objective:
						"Local live Closed Captions for meetings and translations",
					summary:
						"Real-time CC generation for any video calling platform. Facilitates comprehension and simultaneous translation with no visible latency.",
					techContext: "Whisper · Local AI · WASAPI",
					capabilities: [
						"Real-time CC generation",
						"Platform agnostic (Teams, Zoom, Meet)",
						"Total privacy via edge processing",
					],
				},
				{
					name: "Tableau \u2192 Power BI Migrator",
					stage: "MVP",
					objective:
						"Automatic dashboard migration without manual rebuild",
					summary:
						"Converts Tableau workbooks into Power BI reports automatically. Parses calculated fields, relationships, and visual layouts via AST analysis, no manual re-creation needed.",
					techContext: "Python · AST Parsing · Tableau API · PBIR",
					capabilities: [
						"Automatic calculated field conversion",
						"Visual layout preservation",
						"Relationship and data source mapping",
					],
				},
				{
					name: "Mindsight",
					stage: "MVP",
					objective:
						"Physical and mental wellness dashboard focused on sleep",
					summary:
						"Personal health platform that measures, visualizes, and gamifies sleep and wellness habits. Turns health data into actionable metrics to improve quality of life day by day.",
					techContext: "Next.js · Health APIs · Gamification · Charts",
					capabilities: [
						"Sleep tracking and wellness metrics",
						"Gamification with achievement system",
						"Trend and pattern visualization",
					],
				},
			],
		},
		method: {
			label: "Method",
			headline1: "Engineering, not",
			headlineAccent: "magic",
			sub: "AI is a tool, not a religion. We use it where it genuinely reduces work and discard it where a simpler solution does the same job. What matters: the product works, is understandable, and is maintainable.",
			card1Title: "What we build",
			card1Text:
				"Tools that solve real problems: data organization, smart search, automated auditing, measurable wellbeing.",
			card2Title: "What we don\u2019t do",
			card2Text:
				"Sell you AI just to inflate the bill. Demos that only work in presentations. Adding complexity where a simpler tool would be faster, cheaper, and more reliable.",
		},
		cta: {
			headline1: "The code is",
			headlineAccent: "open",
			sub: "Explore the products, try the tools, or book a demo directly.",
			ctaPrimary: "Book a demo",
			ctaSecondary: "Join the waitlist",
		},
		footer: {
			line1: "Data tools and applied intelligence suite.",
			line2: "Governance · Applied AI · Agents · Automation",
		},
		codeComment: "# governance/audit.py — No magic, just engineering",
		codeDocstring1: '"""Complete technical audit. No prompts,',
		codeDocstring2: "no wrappers. Real validation on real data.",
		codeAnnotation1: "Validates that data structure hasn\u2019t changed",
		codeAnnotation2: "Detects stale data before it breaks reports",
		codeAnnotation3: "Surfaces only what actually failed",
		underTheHood: {
			label: "Under the hood",
			headline: "Real code. No tricks.",
			sub: "This is what a governance audit looks like inside. No prompts, no middleware layers — direct logic on real data.",
		},
		heroDeployment: {
			local: "Your machines",
			managed: "Our servers",
			cloud: "The cloud",
			tagline: "You choose.",
		},
	},
};
