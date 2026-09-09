"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";

type AdminNavCtx = {
  open: boolean;
  setOpen: (v: boolean) => void;
  toggle: () => void;
};

const AdminNavContext = createContext<AdminNavCtx | null>(null);

export function useAdminNav() {
  const ctx = useContext(AdminNavContext);
  if (!ctx) throw new Error("useAdminNav must be used within AdminShell");
  return ctx;
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const toggle = useCallback(() => setOpen((v) => !v), []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <AdminNavContext.Provider value={{ open, setOpen, toggle }}>
      <div className="flex h-screen overflow-hidden font-sans bg-[#F7F9FB] text-[#0c1622]">
        <div
          className="pointer-events-none fixed inset-0 opacity-[0.45]"
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 100% -10%, rgba(57,92,128,0.14), transparent 55%), radial-gradient(ellipse 60% 40% at 0% 100%, rgba(41,66,94,0.08), transparent 50%)",
          }}
        />

        {/* Mobile overlay */}
        <div
          className={`fixed inset-0 z-40 bg-[#0c1622]/40 backdrop-blur-sm transition-opacity md:hidden ${
            open ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setOpen(false)}
          aria-hidden={!open}
        />

        <AdminSidebar />
        <div className="relative flex flex-col flex-1 overflow-hidden min-w-0">
          <AdminHeader />
          <main className="flex-1 overflow-y-auto overflow-x-auto p-4 sm:p-5 md:p-8">{children}</main>
        </div>
      </div>
    </AdminNavContext.Provider>
  );
}
