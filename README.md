# Refactorización Landing Page: Portfolio → SaaS Studio

Este documento detalla la transformación técnica y de negocio realizada en `bolmer.dev`, migrando de un portfolio personal de desarrollador freelance a una plataforma institucional de **SaaS Studio** multi-producto.

## 🚀 Resumen del Cambio
- **Voz Institucional:** Transición del "Yo" al "Nosotros", proyectando una empresa escalable.
- **Enfoque B2B:** Copywriting orientado a la entrega de valor de negocio (ROI) sin perder el rigor técnico ("Ingeniería antes que magia").
- **Catálogo de Productos:** Presentación de una suite de herramientas independientes en lugar de proyectos individuales.
- **Arquitectura Next.js 16:** Optimización técnica extrema eliminando dependencias pesadas de cliente y priorizando el Server-Side Rendering (SSR).

---

## 💻 Ejecución en Local

Para iniciar el servidor de desarrollo y ver la landing page en tu máquina:

1.  Navegar a la carpeta del dashboard:
    ```powershell
    cd c:\Proyectos\nifi_backup\dashboard
    ```
2.  Iniciar el entorno con **Bun**:
    ```powershell
    bun run dev
    ```
3.  Abrir el navegador en: [http://localhost:3000](http://localhost:3000)

---

## 🛠️ Arquitectura Técnica

### 1. Sistema i18n de Alto Rendimiento
Se implementó un sistema de internacionalización (ES/EN) que no depende de la hidratación del cliente para mostrar el contenido correcto:
- **`proxy.ts`:** Reemplaza a `middleware.ts` (convención Next.js 16). Detecta el encabezado `Accept-Language` en la primera visita y gestiona la cookie `locale`.
- **Acceso Server-Side:** Las traducciones se obtienen directamente en el Server Component (`page.tsx`) leyendo la cookie, lo que elimina el "flash" de cambio de idioma.
- **Language Toggle:** Componente de cliente ligero que actualiza la cookie y ejecuta `router.refresh()` para re-renderizar la página en el servidor.

### 2. Capa de Interactividad Avanzada
- **Re-introducción de `framer-motion`:** Se configuró una versión optimizada de la librería para permitir micro-interacciones premium sin penalizar el Core Web Vitals.
- **`DecryptedText` (Hacker Effect):** Sistema de revelación de texto asíncrono optimizado matemáticamente. El algoritmo escala la velocidad según el largo del texto, garantizando que el efecto "Cyber" termine siempre en <500ms independientemente de la resolución o zoom.
- **Server Components & Suspense:** La estructura principal sigue siendo Server-Side, permitiendo que el primer render sea instantáneo mientras los componentes interactivos se hidratan en paralelo.

### 3. Visual Visual Editor (Inspector Mode) - "NiFi Data Governance Studio"
Se desarrolló una herramienta interna de diseño integrada en la landing:
- **Theme Editor:** Widget flotante que permite cambiar variables de color CSS (HSL/RGB) en tiempo real.
- **Modo Inspector:** Permite seleccionar cualquier elemento del DOM, editar sus clases de Tailwind (Texto, Fondo, Fuente) y modificar el contenido textual directamente desde el navegador.
- **Export Edits:** Botón de exportación que genera un reporte JSON de los cambios visuales realizados para su implementación definitiva en el código fuente.

### 4. Estética y Refinamiento
- **Sticky Glassmorphism:** Barra de navegación y secciones clave con efectos de desenfoque y capas de color `crumb`/`crust` dinámicas para mejorar la legibilidad.
- **Cascada de Tarjetas:** Las tarjetas de producto mantienen su comportamiento `sticky`, simulando un stack físico de soluciones.
- **Optimización de Gradientes:** Uso de `noise.css` para eliminar el banding, manteniendo una estética mate y profesional.

---

## 📦 Suite de Productos (SaaS Studio)
El catálogo destaca herramientas de impacto real:
1. **Data Governance Chat Bot:** Asistente conversacional especializado en estructuras de datos internas.
2. **Tableau → Power BI Migrator:** Conversión automática de dashboards manteniendo layouts y campos calculados.
3. **Word OCR for Translations:** Extracción y mantenimiento de formato original en documentos complejos.
4. **Audio CC for Meetings:** Subtitulado dinámico para videollamadas con contexto temporal.
5. **Mindsight:** Dashboard de bienestar de salud fisica y mental, enfocada en el sueño. Gamify.
6. **Antigravity Extension:** Workflows asistidos por IA nativa en el IDE.

---

## 📝 Decisiones de Copywriting
- **Headline:** *"Inteligencia antes que IA"* - Enfoque en soluciones deterministas antes que generativas.
- **Flujo de Valor:** De consultoría pesada a activación de SaaS: *Identificar → Activar → Escalar*.
- **Anti-Slop:** Posicionamiento crítico contra el contenido generado por IA sin supervisión técnica.

---

## 📁 Estructura de Archivos Clave
- `dashboard/app/page.tsx`: Landing principal con hidratación selectiva.
- `dashboard/app/components/ThemeEditor.tsx`: Herramienta de diseño en vivo e inspector.
- `dashboard/app/components/DecryptedText.tsx`: Animación de texto optimizada.
- `dashboard/app/i18n/translations.ts`: Diccionario multilingüe.
- `dashboard/app/globals.css`: Tokens de diseño y utilitarios.
