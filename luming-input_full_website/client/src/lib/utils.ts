import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Resolve a public-asset path against Vite `base` (GitHub Pages project path). */
export function assetUrl(path: string) {
  const base = import.meta.env.BASE_URL || "/";
  const clean = path.replace(/^\/+/, "");
  return `${base}${clean}`;
}

/** 仓库「如何使用」章节，用于安装引导。 */
export const INSTALL_URL =
  "https://github.com/Rayalizing/yoyo/tree/main#%E5%A6%82%E4%BD%95%E4%BD%BF%E7%94%A8";
