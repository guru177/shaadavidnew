"use client";

import React, { useState, useEffect } from "react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";

type UserRow = {
  id: string;
  name?: string;
  mobile?: string;
  location?: string;
  registeredDate?: string;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch users", error);
    }
    setIsLoading(false);
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-5">
      <AdminPageHeader
        pill="ഉപയോക്താക്കൾ"
        title="Registered users"
        subtitle="Customers who have purchased from Shaa David's Academy."
        actions={
          <button
            type="button"
            onClick={fetchUsers}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold text-[#29425e] bg-white border border-[#29425e]/15 hover:bg-[#29425e]/5 shadow-sm transition-colors"
          >
            Refresh
          </button>
        }
      />

      <div className="bg-white rounded-[24px] border border-[#29425e]/08 shadow-[0_8px_30px_rgba(12,22,34,0.04)] overflow-hidden">
        <div className="p-5 border-b border-[#29425e]/8 bg-[linear-gradient(180deg,#ffffff_0%,#F7F9FB_100%)]">
          <h2 className="text-base font-bold text-[#0c1622]">All users ({users.length})</h2>
        </div>

        {isLoading ? (
          <div className="text-center py-16 text-gray-500">Loading users...</div>
        ) : users.length === 0 ? (
          <div className="rounded-[24px] m-5 border border-dashed border-[#29425e]/15 bg-[#F7F9FB] py-16 px-6 text-center text-gray-500">
            No users registered yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F7F9FB]">
                  <th className="py-3.5 px-5 text-xs font-bold text-[#395c80] uppercase tracking-wider">
                    User ID
                  </th>
                  <th className="py-3.5 px-5 text-xs font-bold text-[#395c80] uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="py-3.5 px-5 text-xs font-bold text-[#395c80] uppercase tracking-wider">
                    Location
                  </th>
                  <th className="py-3.5 px-5 text-xs font-bold text-[#395c80] uppercase tracking-wider">
                    Registered
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#29425e]/6">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-[#395c80]/[0.04] transition-colors">
                    <td className="py-4 px-5">
                      <span className="text-sm font-bold text-[#395c80]">{user.id}</span>
                    </td>
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[linear-gradient(135deg,#29425e,#395c80)] text-white flex items-center justify-center font-bold text-sm shrink-0 uppercase">
                          {(user.name || "U").charAt(0)}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-[#0c1622]">{user.name || "—"}</div>
                          <div className="text-xs text-gray-500">{user.mobile}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <div className="text-sm font-medium text-gray-700">{user.location || "—"}</div>
                    </td>
                    <td className="py-4 px-5">
                      <div className="text-sm text-gray-600 font-medium">
                        {user.registeredDate || "—"}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
