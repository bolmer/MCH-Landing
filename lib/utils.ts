import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge tailwind classes safely
 */
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
