import { useEffect, useState } from "react";

/** True on phones/tablets with weak hardware, data-saver, or reduced-motion preference. */
export function detectLowEnd(): boolean {
  if (typeof window === "undefined") return false;
  const n = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return true;
  if (n.connection?.saveData) return true;
  if ((n.deviceMemory ?? 8) <= 4) return true;
  if ((n.hardwareConcurrency ?? 8) <= 4) return true;
  return false;
}

export function isTouch(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;
}

export function useLiteMode() {
  const [lite, setLite] = useState(false);
  useEffect(() => { setLite(detectLowEnd() || isTouch()); }, []);
  return lite;
}
