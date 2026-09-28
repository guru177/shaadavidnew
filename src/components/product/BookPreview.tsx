"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import type { ProductPreviewPage as Page } from "@/types/product";

/** Page width / height of the source PDF (524.4 × 694.5 pt). */
const PAGE_RATIO = 0.755;
const FLIP_MS = 900;

type Leaf = { front: Page | null; back: Page | null };

/** Spread mode: each leaf carries two pages. Single mode: one page per leaf, blank back. */
function buildLeaves(pages: Page[], spread: boolean): Leaf[] {
  if (!spread) return pages.map((p) => ({ front: p, back: null }));
  const leaves: Leaf[] = [];
  for (let i = 0; i < pages.length; i += 2) {
    leaves.push({ front: pages[i], back: pages[i + 1] ?? null });
  }
  return leaves;
}

const WIDE_QUERY = "(min-width: 768px)";

/** The modal only mounts after a click, so the media query can be read on first render. */
function useIsWide() {
  const [wide, setWide] = useState(() => window.matchMedia(WIDE_QUERY).matches);
  useEffect(() => {
    const mq = window.matchMedia(WIDE_QUERY);
    const update = () => setWide(mq.matches);
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return wide;
}

function PageFace({ page, side }: { page: Page | null; side: "front" | "back" }) {
  // Soft shadow along the spine: fronts sit on the right half, backs on the left.
  const spine =
    side === "front"
      ? "linear-gradient(to right, rgba(0,0,0,0.18), rgba(0,0,0,0) 8%)"
      : "linear-gradient(to left, rgba(0,0,0,0.18), rgba(0,0,0,0) 8%)";
  return (
    <div
      className="absolute inset-0 overflow-hidden bg-[#fbf8f1]"
      style={{
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
        // Lift each face off the leaf plane so front and back never z-fight mid-turn.
        transform: side === "back" ? "rotateY(180deg) translateZ(0.5px)" : "translateZ(0.5px)",
      }}
    >
      {page !== null ? (
        <img
          src={page.src}
          alt={page.label || "Book page"}
          draggable={false}
          decoding="async"
          className="w-full h-full object-contain select-none"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-[#395c80]/40 text-sm tracking-widest uppercase">
          Shaa David&apos;s
        </div>
      )}
      <div className="pointer-events-none absolute inset-0" style={{ background: spine }} />
    </div>
  );
}

function BookModal({ pages, onClose }: { pages: Page[]; onClose: () => void }) {
  const wide = useIsWide();
  const leaves = buildLeaves(pages, wide);
  const [flipped, setFlipped] = useState(0);
  const [shown, setShown] = useState(false);
  const [turning, setTurning] = useState<number | null>(null);
  const busyUntil = useRef(0);
  const touchX = useRef<number | null>(null);

  // Keep the same reading position when switching between spread and single mode.
  const [layoutWide, setLayoutWide] = useState(wide);
  if (layoutWide !== wide) {
    setLayoutWide(wide);
    setTurning(null);
    setFlipped((f) => (wide ? Math.ceil(f / 2) : Math.min(f * 2, pages.length - 1)));
  }

  const maxFlipped = wide ? leaves.length : leaves.length - 1;

  useEffect(() => {
    if (turning === null) return;
    const t = window.setTimeout(() => setTurning(null), FLIP_MS);
    return () => window.clearTimeout(t);
  }, [turning, flipped]);

  const turn = (dir: 1 | -1) => {
    const now = Date.now();
    if (now < busyUntil.current) return;
    const next = Math.max(0, Math.min(maxFlipped, flipped + dir));
    if (next === flipped) return;
    busyUntil.current = now + FLIP_MS * 0.45;
    // The moving leaf stays on top of both stacks until it lands.
    setTurning(dir === 1 ? flipped : flipped - 1);
    setFlipped(next);
  };

  const close = () => {
    setShown(false);
    window.setTimeout(onClose, 300);
  };

  // Keyboard handler reads the latest turn/close without re-binding the listener.
  const keyHandler = useRef<(e: KeyboardEvent) => void>(() => {});
  useEffect(() => {
    keyHandler.current = (e) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") turn(1);
      else if (e.key === "ArrowLeft") turn(-1);
    };
  });

  // Warm the cache so pages are decoded before they are turned to.
  useEffect(() => {
    pages.forEach((p) => {
      const img = new Image();
      img.src = p.src;
    });
  }, [pages]);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setShown(true));
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => keyHandler.current(e);
    window.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  // Closed book (cover only, or back cover only) sits centred instead of on the right half.
  const closedFront = wide && flipped === 0;
  const closedBack = wide && flipped === leaves.length;
  const bookShift = closedFront ? "-25%" : closedBack ? "25%" : "0%";

  const pageW = wide
    ? `min(calc(78vh * ${PAGE_RATIO}), 44vw, 460px)`
    : // svh stays fixed while the mobile address bar shows/hides, so the book doesn't resize mid-swipe.
      `min(84vw, calc(64svh * ${PAGE_RATIO}), 420px)`;
  const bookStyle: CSSProperties = {
    width: wide ? `calc(${pageW} * 2)` : pageW,
    height: `calc(${pageW} / ${PAGE_RATIO})`,
    transform: `translateX(${bookShift})`,
    transition: `transform ${FLIP_MS}ms cubic-bezier(0.645, 0.045, 0.355, 1)`,
    transformStyle: "preserve-3d",
  };

  const currentLabel = (() => {
    if (!wide) return pages[flipped]?.label ?? "";
    const left = flipped > 0 ? leaves[flipped - 1].back : null;
    const right = flipped < leaves.length ? leaves[flipped].front : null;
    return [left, right]
      .filter((p): p is Page => p !== null && Boolean(p.label))
      .map((p) => p.label)
      .join("  ·  ");
  })();

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Book preview"
      data-lenis-prevent
      className={`fixed inset-0 z-[1000] flex flex-col items-center justify-center px-4 overscroll-none touch-none select-none transition-opacity duration-300 ${shown ? "opacity-100" : "opacity-0"}`}
      style={{ background: "radial-gradient(ellipse at center, rgba(22,36,54,0.92), rgba(6,12,20,0.97))" }}
      onClick={close}
    >
      <button
        type="button"
        aria-label="Close preview"
        onClick={close}
        className="absolute top-4 right-4 md:top-6 md:right-6 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <p className="text-white/60 text-xs md:text-sm tracking-[0.2em] uppercase mb-4 md:mb-6">
        Book preview · selected pages
      </p>

      <div
        onClick={(e) => e.stopPropagation()}
        onTouchStart={(e) => {
          touchX.current = e.touches[0].clientX;
        }}
        onTouchEnd={(e) => {
          if (touchX.current === null) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          touchX.current = null;
          if (Math.abs(dx) > 40) turn(dx < 0 ? 1 : -1);
        }}
        className={`transition-[transform,opacity] duration-500 ease-out ${shown ? "opacity-100 scale-100" : "opacity-0 scale-90"}`}
        style={{ perspective: "2200px" }}
      >
        <div className="relative" style={bookStyle}>
          {/* Shadow under the open book */}
          <div
            className="absolute -bottom-6 left-[6%] right-[6%] h-8 rounded-[50%] bg-black/50 blur-xl"
            style={{ transform: "translateZ(-1px)" }}
          />
          {leaves.map((leaf, i) => {
            const isFlipped = i < flipped;
            // Unturned leaves stack first-on-top; turned leaves stack last-on-top.
            const z = i === turning ? leaves.length * 3 : isFlipped ? i + 1 : leaves.length * 2 - i;
            // On phones only the current page and its neighbours stay mounted: fewer 3D layers, no flicker.
            if (!wide && Math.abs(i - flipped) > 1) return null;
            return (
              <div
                key={`${wide ? "s" : "p"}-${i}`}
                className="absolute top-0 h-full cursor-pointer"
                onClick={() => turn(isFlipped ? -1 : 1)}
                style={{
                  width: wide ? "50%" : "100%",
                  left: wide ? "50%" : 0,
                  zIndex: z,
                  transformOrigin: "left center",
                  transformStyle: "preserve-3d",
                  transform: `rotateY(${isFlipped ? (wide ? -180 : -120) : 0}deg)`,
                  opacity: !wide && isFlipped ? 0 : 1,
                  transition: `transform ${FLIP_MS}ms cubic-bezier(0.645, 0.045, 0.355, 1), opacity ${FLIP_MS}ms ease-in`,
                  boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
                  willChange: "transform, opacity",
                  WebkitTapHighlightColor: "transparent",
                }}
              >
                <PageFace page={leaf.front} side="front" />
                {wide && <PageFace page={leaf.back} side="back" />}
              </div>
            );
          })}
        </div>
      </div>

      <div
        className="mt-8 md:mt-10 flex items-center gap-4 md:gap-6 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          aria-label="Previous page"
          onClick={() => turn(-1)}
          disabled={flipped === 0}
          className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:hover:bg-white/10 flex items-center justify-center transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="min-w-[150px] text-center text-sm md:text-base text-white/80 tabular-nums">
          {currentLabel}
        </span>
        <button
          type="button"
          aria-label="Next page"
          onClick={() => turn(1)}
          disabled={flipped === maxFlipped}
          className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:hover:bg-white/10 flex items-center justify-center transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>,
    document.body,
  );
}

/** Product-page teaser that opens an animated flip-book preview of selected pages. */
export default function BookPreview({ pages }: { pages: Page[] }) {
  const [open, setOpen] = useState(false);
  if (!pages.length) return null;

  return (
    <>
      <section className="font-malayalam relative mt-6 sm:mt-8 flex flex-col min-[400px]:flex-row items-center gap-5 sm:gap-6 rounded-2xl border border-gray-100 bg-[#f8fafc] px-4 py-6 sm:px-6 sm:py-7 overflow-hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open book preview"
          className="group relative shrink-0 w-[96px] sm:w-[112px] xl:w-[124px] mr-2.5"
          style={{ perspective: "1200px" }}
        >
          {/* Page edges peeking out behind the cover */}
          <span className="absolute inset-0 translate-x-2.5 translate-y-1.5 rounded-r-md bg-[#efe9dc] shadow-md" />
          <span className="absolute inset-0 translate-x-1 translate-y-0.5 rounded-r-md bg-[#f7f3ea] shadow" />
          <span
            className="relative block rounded-r-md overflow-hidden shadow-[0_12px_28px_rgba(12,22,34,0.2)] transition-transform duration-500 ease-out group-hover:[transform:rotateY(-22deg)]"
            style={{ transformOrigin: "left center", aspectRatio: `${PAGE_RATIO}` }}
          >
            <img src={pages[0].src} alt="Book cover" className="w-full h-full object-cover" loading="lazy" />
            <span className="absolute inset-y-0 left-0 w-2.5 bg-gradient-to-r from-black/25 to-transparent" />
          </span>
        </button>

        <div className="flex-1 text-center min-[400px]:text-left min-w-0">
          <h2 className="text-base sm:text-lg font-medium text-[#0c1622] mb-1.5">
            പുസ്തകത്തിന്റെ പ്രിവ്യൂ
          </h2>
          <p className="text-gray-600 text-[13px] sm:text-[14px] leading-relaxed mb-3.5">
            വാങ്ങുന്നതിന് മുമ്പ് പുസ്തകത്തിലെ തിരഞ്ഞെടുത്ത {pages.length} പേജുകൾ മറിച്ചു നോക്കൂ.
          </p>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 rounded-full bg-[#0c1622] hover:bg-[#395c80] text-white px-4 py-2 text-sm font-medium transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            പ്രിവ്യൂ കാണുക
          </button>
        </div>
      </section>

      {open && <BookModal pages={pages} onClose={() => setOpen(false)} />}
    </>
  );
}
