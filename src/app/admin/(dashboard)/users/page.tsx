"use client";

import React, { useState, useEffect } from 'react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users", error);
    }
    setIsLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#0c1622]">Registered Users</h1>
          <p className="text-gray-500 mt-1">View all customers who have purchased the Companion.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-[#0c1622]">All Users ({users.length})</h2>
        </div>
        
        {isLoading ? (
          <div className="text-center py-12 text-gray-500">Loading users...</div>
        ) : users.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No users registered yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">User ID</th>
                  <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">Customer Info</th>
                  <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">Location</th>
                  <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">Registered On</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="py-4 px-6">
                      <span className="text-sm font-bold text-[#395c80]">{user.id}</span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-100 to-gray-200 border border-gray-300 flex items-center justify-center text-gray-500 font-bold text-sm shrink-0 uppercase">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-[#0c1622]">{user.name}</div>
                          <div className="text-xs text-gray-500">{user.mobile}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm font-medium text-gray-700">{user.location}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm text-gray-600 font-medium">{user.registeredDate}</div>
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
