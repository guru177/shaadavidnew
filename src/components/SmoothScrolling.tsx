"use client";

import { useEffect, ReactNode } from "react";
import Lenis from "lenis";
import { usePathname } from "next/navigation";

export default function SmoothScrolling({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    // Disable global smooth scrolling on admin routes as they use nested scrollable containers
    if (pathname?.startsWith('/admin')) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, [pathname]);

  return <>{children}</>;
}
