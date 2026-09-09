import React from "react";
import {
  adminPageSubtitle,
  adminPageTitle,
  adminPillBadge,
} from "@/components/admin/adminStyles";

type AdminPageHeaderProps = {
  pill: string;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
};

/** Matches the public-site section header: shimmer pill + display title. */
export default function AdminPageHeader({
  pill,
  title,
  subtitle,
  actions,
}: AdminPageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
      <div>
        <div className={`${adminPillBadge} mb-4`}>
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          {pill}
        </div>
        <h1 className={`${adminPageTitle} leading-[1.35]`}>{title}</h1>
        {subtitle ? <p className={adminPageSubtitle}>{subtitle}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2 shrink-0">{actions}</div> : null}
    </div>
  );
}
