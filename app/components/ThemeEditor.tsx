"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const themeColors = [
  { name: "Background (Main)", var: "--color-crumb-1", defaultHex: "#F0E6D8" },
  { name: "Background (Secondary)", var: "--color-crumb-2", defaultHex: "#E4D5C3" },
  { name: "Borders / Hover", var: "--color-crust-light", defaultHex: "#C4A88A" },
  { name: "Accent (Golden)", var: "--color-crust-golden", defaultHex: "#B07830" },
  { name: "Text (Body)", var: "--color-crust-toasted", defaultHex: "#4A3728" },
  { name: "Text (Headings)", var: "--color-crust-dark", defaultHex: "#2A1D15" },
  { name: "Text (Muted)", var: "--color-crust-muted", defaultHex: "#7A6555" },
];

const TEXT_COLORS = [
  "text-crust-dark", "text-crust-toasted", "text-crust-muted", "text-crust-golden", "text-crust-light", "text-crumb-1", "text-crumb-2", "text-white", "text-black", "text-transparent"
];

const BG_COLORS = [
  "bg-crumb-1", "bg-crumb-2", "bg-crust-dark", "bg-crust-toasted", "bg-crust-muted", "bg-crust-golden", "bg-crust-light", "bg-white", "bg-black", "bg-transparent"
];

const FONT_SIZES = [
  "text-xs", "text-sm", "text-base", "text-lg", "text-xl", "text-2xl", "text-3xl", "text-4xl", "text-5xl", "text-6xl", "text-7xl", "text-8xl", "text-9xl"
];

const FONT_FAMILIES = [
  "font-sans", "font-serif", "font-display", "font-mono"
];

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)} ${parseInt(result[2], 16)} ${parseInt(result[3], 16)}`
    : null;
}

export function ThemeEditor() {
  const [isOpen, setIsOpen] = useState(false);
  const [colors, setColors] = useState<Record<string, string>>({});
  const [isEditMode, setIsEditMode] = useState(false);
  
  const editorRef = useRef<HTMLDivElement>(null);
  const selectedElRef = useRef<HTMLElement | null>(null);
  const [selectedEl, setSelectedEl] = useState<HTMLElement | null>(null);

  useEffect(() => {
    // Initialize colors from defaults
    const initialColors: Record<string, string> = {};
    themeColors.forEach((c) => {
      initialColors[c.var] = c.defaultHex;
    });
    setColors(initialColors);
  }, []);

  useEffect(() => {
    // Disable links when edit mode is on to avoid navigating while clicking
    const styleId = "theme-editor-styles";
    let styleEl = document.getElementById(styleId);

    if (isEditMode) {
      if (!styleEl) {
        styleEl = document.createElement("style");
        styleEl.id = styleId;
        styleEl.innerHTML = `a { pointer-events: none !important; }`;
        document.head.appendChild(styleEl);
      }
    } else {
      if (styleEl) {
        styleEl.remove();
      }
      // Clear selections when mode turns off
      if (selectedElRef.current) {
        selectedElRef.current.style.outline = "";
        selectedElRef.current.contentEditable = "false";
        selectedElRef.current = null;
        setSelectedEl(null);
      }
      return;
    }

    const handleClick = (e: MouseEvent) => {
      // Ignore clicks inside the editor panel itself
      if (editorRef.current?.contains(e.target as Node)) return;

      e.preventDefault();
      e.stopPropagation();

      const target = e.target as HTMLElement;
      
      // Track elements that are interacted with
      if (!target.hasAttribute("data-theme-id")) {
        target.setAttribute("data-theme-id", Math.random().toString(36).substring(2, 9));
      }

      // Clear previous outline
      if (selectedElRef.current && selectedElRef.current !== target) {
        selectedElRef.current.style.outline = "";
        selectedElRef.current.contentEditable = "false";
      }

      // Add outline to new target
      target.style.outline = "2px dashed #B07830";
      target.style.outlineOffset = "2px";
      target.contentEditable = "true";
      target.focus();
      
      selectedElRef.current = target;
      setSelectedEl(target);
    };

    document.addEventListener("click", handleClick, { capture: true });
    return () => {
      document.removeEventListener("click", handleClick, { capture: true });
    };
  }, [isEditMode]);

  const handleColorChange = (cssVar: string, hex: string) => {
    setColors((prev) => ({ ...prev, [cssVar]: hex }));
    const rgb = hexToRgb(hex);
    if (rgb) {
      document.documentElement.style.setProperty(cssVar, rgb);
    }
  };

  const copyConfig = () => {
    const configString = JSON.stringify(colors, null, 2);
    navigator.clipboard.writeText(configString);
    alert("Colors copied to clipboard!");
  };

  const exportEdits = () => {
    const editedNodes = document.querySelectorAll("[data-theme-id]");
    if (editedNodes.length === 0) {
      alert("No has hecho cambios en modo inspector.");
      return;
    }
    const report = Array.from(editedNodes).map((node) => {
      const el = node as HTMLElement;
      // Remove the inline outline injected by the inspector
      el.style.outline = "";
      el.style.outlineOffset = "";
      el.contentEditable = "false";
      
      return {
        tag: el.tagName.toLowerCase(),
        text: el.innerText.trim().substring(0, 150),
        className: el.className
      };
    });
    navigator.clipboard.writeText(JSON.stringify(report, null, 2));
    alert(`${report.length} elementos copiados al portapapeles. ¡Mándaselos al AI!`);
  };

  const updateSelectedClass = (category: string[], newClass: string) => {
    if (!selectedElRef.current) return;
    const el = selectedElRef.current;
    
    // Remove all classes from this category
    category.forEach(c => el.classList.remove(c));
    // Add the new one
    if (newClass) el.classList.add(newClass);
    
    // Force re-render to update the dropdowns
    setSelectedEl(null);
    setTimeout(() => setSelectedEl(el), 0);
  };

  const activeTextColor = TEXT_COLORS.find(c => selectedEl?.classList.contains(c)) || "";
  const activeBgColor = BG_COLORS.find(c => selectedEl?.classList.contains(c)) || "";
  const activeFontSize = FONT_SIZES.find(c => selectedEl?.classList.contains(c)) || "";
  const activeFontFamily = FONT_FAMILIES.find(c => selectedEl?.classList.contains(c)) || "";

  return (
    <div className="fixed bottom-4 right-4 z-[9999] font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={editorRef}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="mb-4 w-80 rounded-2xl border border-crust-light/30 bg-crumb-1/95 p-5 shadow-2xl backdrop-blur-md"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-base font-bold text-crust-dark">Visual Editor</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-crust-muted hover:text-crust-dark"
              >
                ✕
              </button>
            </div>

            <div className="mb-4 space-y-3 max-h-[30vh] overflow-y-auto pr-2 custom-scrollbar">
              {themeColors.map((c) => (
                <div key={c.var} className="flex items-center justify-between">
                  <span className="text-xs font-medium text-crust-toasted">{c.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-crust-muted font-mono">{colors[c.var]}</span>
                    <input
                      type="color"
                      value={colors[c.var] || c.defaultHex}
                      onChange={(e) => handleColorChange(c.var, e.target.value)}
                      className="h-6 w-6 cursor-pointer rounded border border-crust-light/30 bg-transparent p-0"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3 border-t border-crust-light/20 pt-4 pb-4">
              <label className="flex cursor-pointer items-center justify-between mb-2">
                <span className="text-sm font-medium text-crust-toasted">Inspector Mode</span>
                <div
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                    isEditMode ? "bg-status-green" : "bg-crust-light/50"
                  }`}
                  onClick={() => setIsEditMode(!isEditMode)}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-crumb-1 transition-transform ${
                      isEditMode ? "translate-x-4" : "translate-x-1"
                    }`}
                  />
                </div>
              </label>
              
              {isEditMode && selectedEl && (
                <div className="rounded-lg bg-crumb-2/50 p-3 space-y-3 border border-crust-light/10">
                  <p className="text-xs font-bold text-crust-dark mb-1">Element Properties:</p>
                  
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase text-crust-muted font-bold">Text Color</label>
                    <select 
                      value={activeTextColor} 
                      onChange={(e) => updateSelectedClass(TEXT_COLORS, e.target.value)}
                      className="w-full text-xs p-1.5 rounded bg-crumb-1 border border-crust-light/30 text-crust-dark"
                    >
                      <option value="">Default (Inherit)</option>
                      {TEXT_COLORS.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase text-crust-muted font-bold">Background Color</label>
                    <select 
                      value={activeBgColor} 
                      onChange={(e) => updateSelectedClass(BG_COLORS, e.target.value)}
                      className="w-full text-xs p-1.5 rounded bg-crumb-1 border border-crust-light/30 text-crust-dark"
                    >
                      <option value="">Default (Inherit)</option>
                      {BG_COLORS.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase text-crust-muted font-bold">Font Size</label>
                    <select 
                      value={activeFontSize} 
                      onChange={(e) => updateSelectedClass(FONT_SIZES, e.target.value)}
                      className="w-full text-xs p-1.5 rounded bg-crumb-1 border border-crust-light/30 text-crust-dark"
                    >
                      <option value="">Default (Inherit)</option>
                      {FONT_SIZES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase text-crust-muted font-bold">Font Family</label>
                    <select 
                      value={activeFontFamily} 
                      onChange={(e) => updateSelectedClass(FONT_FAMILIES, e.target.value)}
                      className="w-full text-xs p-1.5 rounded bg-crumb-1 border border-crust-light/30 text-crust-dark"
                    >
                      <option value="">Default (Inherit)</option>
                      {FONT_FAMILIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
              )}
              {isEditMode && !selectedEl && (
                <p className="text-xs text-crust-muted text-center italic py-2">
                  Click on any text or block on the page to inspect and edit it.
                </p>
              )}
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={copyConfig}
                className="w-full rounded-lg bg-crust-dark py-2 text-xs font-bold text-crumb-1 transition-colors hover:bg-crust-golden"
              >
                Copy Colors
              </button>
              <button
                onClick={exportEdits}
                className="w-full rounded-lg bg-crust-golden py-2 text-xs font-bold text-crumb-1 transition-colors hover:bg-crust-dark"
              >
                Export Edits
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-crust-dark text-crumb-1 shadow-lg transition-transform hover:scale-105 active:scale-95"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        </button>
      )}
    </div>
  );
}
