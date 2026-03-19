"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

interface DecryptedTextProps {
  text: string;
  className?: string;
  speed?: number;
  maxIterations?: number;
}

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+{}:\"<>?|[\\]./";

export function DecryptedText({
  text,
  className = "",
  speed = 30,
  maxIterations = 15,
}: DecryptedTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    let iteration = 0;
    let interval: NodeJS.Timeout | null = null;

    interval = setInterval(() => {
      setDisplayText((prev) =>
        text
          .split("")
          .map((letter, index) => {
            if (index < iteration || letter === " ") {
              return text[index];
            }
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join("")
      );

      if (iteration >= text.length) {
        clearInterval(interval!);
      }

      // Proportional to text length so longer texts don't take forever
      iteration += Math.max(text.length / maxIterations, 0.5);
    }, speed);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [text, speed, maxIterations, isInView]);

  return (
    <motion.span
      ref={ref}
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.05 }}
    >
      {displayText}
    </motion.span>
  );
}
