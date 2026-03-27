"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
}

export function SplitText({ text, className = "", delay = 0 }: SplitTextProps) {
  const words = text.split(" ");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: delay },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
    },
    hidden: {
      opacity: 0,
      y: 40,
      rotateX: -45,
    },
  };

  return (
    <motion.span
      ref={ref}
      style={{ overflow: "hidden", display: "inline-flex", flexWrap: "wrap" }}
      variants={container}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className={className}
    >
      {words.map((word, index) => (
        <span style={{ overflow: "hidden", display: "inline-block", marginRight: "0.25em" }} key={index}>
          <motion.span 
            variants={child} 
            transition={{ type: "spring", damping: 18, stiffness: 70 }}
            style={{ display: "inline-block" }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
