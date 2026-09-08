/** Shared homepage section heading / eyebrow styles */

export const sectionEyebrowClass =
  "inline-flex items-center gap-2 rounded-full px-5 py-2 text-[10px] md:text-xs font-black text-white mb-4 md:mb-6 shadow-md hover:shadow-lg transition-all cursor-default bg-[linear-gradient(110deg,#29425e_0%,#395c80_30%,#0c1622_50%,#395c80_70%,#29425e_100%)] bg-[length:200%_auto] animate-shimmer font-malayalam uppercase tracking-[0.2em]";

export const sectionEyebrowDotClass = "w-1.5 h-1.5 rounded-full bg-white animate-pulse";

/** Base size / weight / leading for section H2s */
export const sectionHeadingBaseClass =
  "text-3xl sm:text-4xl xl:text-5xl 2xl:text-5xl font-malayalam-display font-bold leading-[1.6] tracking-normal overflow-visible py-1";

export const sectionHeadingGradientClass = `${sectionHeadingBaseClass} text-transparent bg-clip-text bg-[linear-gradient(110deg,#29425e_0%,#395c80_30%,#0c1622_50%,#395c80_70%,#29425e_100%)] bg-[length:200%_auto] animate-shimmer`;

export const sectionHeadingSolidClass = `${sectionHeadingBaseClass} text-[#0c1622]`;

export const sectionHeadingOnDarkClass = `${sectionHeadingBaseClass} text-white drop-shadow-md`;

export const sectionHeadingAccentSpanClass =
  "inline text-transparent bg-clip-text bg-[linear-gradient(110deg,#29425e_0%,#395c80_30%,#0c1622_50%,#395c80_70%,#29425e_100%)] bg-[length:200%_auto] animate-shimmer";
