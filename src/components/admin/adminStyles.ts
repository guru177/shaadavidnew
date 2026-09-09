/** Shared admin UI tokens aligned with the public site brand. */

export const brand = {
  deep: "#0c1622",
  mid: "#29425e",
  light: "#395c80",
  canvas: "#F7F9FB",
  card: "#ffffff",
} as const;

export const adminShimmer =
  "bg-[linear-gradient(110deg,#29425e_0%,#395c80_30%,#0c1622_50%,#395c80_70%,#29425e_100%)] bg-[length:200%_auto] animate-shimmer";

export const adminBtnPrimary =
  "inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold text-white bg-[linear-gradient(110deg,#29425e_0%,#395c80_30%,#0c1622_50%,#395c80_70%,#29425e_100%)] bg-[length:200%_auto] animate-shimmer shadow-[0_10px_30px_rgba(41,66,94,0.25)] hover:brightness-110 transition-all disabled:opacity-70";

export const adminBtnSecondary =
  "inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold text-[#29425e] bg-white border border-[#29425e]/15 hover:bg-[#29425e]/5 shadow-sm transition-colors";

export const adminBtnGhost =
  "inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold text-gray-700 border border-[#29425e]/12 bg-white hover:bg-[#F7F9FB] transition-colors";

export const adminCard =
  "bg-white rounded-[24px] border border-[#29425e]/08 shadow-[0_8px_30px_rgba(12,22,34,0.04)]";

export const adminCardPad = `${adminCard} p-4 sm:p-5`;

export const adminStatChip =
  "bg-white rounded-[20px] border border-[#29425e]/08 shadow-[0_4px_16px_rgba(12,22,34,0.04)] px-4 py-3.5";

export const adminInput =
  "w-full px-3.5 py-2.5 rounded-xl border border-[#29425e]/12 bg-white text-sm outline-none focus:ring-2 focus:ring-[#395c80]/20 focus:border-[#395c80] transition-shadow";

export const adminSearchInput =
  "w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#29425e]/12 bg-[#F7F9FB] text-sm outline-none focus:bg-white focus:ring-2 focus:ring-[#395c80]/20 focus:border-[#395c80]";

export const adminSelect =
  "px-3.5 py-2.5 rounded-xl border border-[#29425e]/12 bg-white text-sm font-semibold text-[#29425e] outline-none focus:ring-2 focus:ring-[#395c80]/20 focus:border-[#395c80]";

export const adminLink = "font-semibold text-[#395c80] hover:text-[#29425e] transition-colors";

export const adminPageWrap = "max-w-[1400px] mx-auto space-y-5";

export const adminPageTitle =
  "text-[24px] sm:text-[28px] md:text-[32px] font-bold tracking-tight text-[#0c1622] font-malayalam-display";

export const adminPageEyebrow =
  "text-[10px] font-bold uppercase tracking-[0.2em] text-[#395c80]";

/** Public-site style section pill (dot + shimmer navy). */
export const adminPillBadge =
  "inline-flex max-w-full items-center gap-2 rounded-full px-3.5 sm:px-5 py-1.5 sm:py-2 text-[10px] md:text-xs font-black text-white shadow-md bg-[linear-gradient(110deg,#29425e_0%,#395c80_30%,#0c1622_50%,#395c80_70%,#29425e_100%)] bg-[length:200%_auto] animate-shimmer font-malayalam tracking-widest sm:uppercase sm:tracking-[0.2em]";

export const adminPageSubtitle = "text-sm text-gray-500 mt-1.5";

export const adminLabel =
  "block text-xs font-bold text-[#395c80]/80 uppercase tracking-wider mb-1.5";

export const adminTabActive =
  "bg-[#0c1622] text-white border-[#0c1622] rounded-full";

export const adminTabIdle =
  "bg-white text-[#29425e] border-[#29425e]/15 hover:bg-[#29425e]/5 rounded-full";

export const adminEmpty =
  "rounded-[24px] border border-dashed border-[#29425e]/15 bg-[#F7F9FB] py-16 px-6 text-center";

export const adminModal =
  "relative bg-white rounded-[24px] border border-[#29425e]/10 shadow-[0_24px_60px_rgba(12,22,34,0.18)] overflow-hidden";

export const adminBulkBar =
  "flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-[linear-gradient(110deg,#29425e_0%,#0c1622_100%)] text-white";

export const CHART_NAVY = ["#0c1622", "#29425e", "#395c80", "#5a7a9a", "#8aa0b8"] as const;

export const STATUS_CHART_COLORS: Record<string, string> = {
  Pending: "#c4a35a",
  Confirmed: "#3d7a5f",
  Shipped: "#395c80",
  Delivered: "#0c1622",
  Cancelled: "#b45a5a",
  Refunded: "#6b5b7a",
};
