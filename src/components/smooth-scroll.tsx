import { useEffect } from "react";
import { detectLowEnd, isTouch } from "@/lib/perf";

export function SmoothScroll() {
  useEffect(() => {
    // Native scrolling is smoother on touch screens and weak hardware.
    if (detectLowEnd() || isTouch()) return;
    let raf = 0;
    let lenis: { raf: (t: number) => void; destroy: () => void } | null = null;
    import("lenis").then(({ default: Lenis }) => {
      lenis = new Lenis({ duration: 1.15, easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), prevent: (node: HTMLElement) => !!node.closest("[role=dialog],[data-radix-scroll-area-viewport],[data-lenis-prevent]") });
      (window as unknown as { __lenis?: unknown }).__lenis = lenis;
      const loop = (t: number) => { lenis?.raf(t); raf = requestAnimationFrame(loop); };
      raf = requestAnimationFrame(loop);
    });
    return () => { cancelAnimationFrame(raf); lenis?.destroy(); (window as unknown as { __lenis?: unknown }).__lenis = undefined; };
  }, []);
  return null;
}
