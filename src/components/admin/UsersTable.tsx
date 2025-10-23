"use client";

import Pagination from "../common/Pagination";
import UserDetailModal from "./UserDetailModal";
import { useState } from "react";

type ApiUser = { 
  id?: string; 
  _id?: string; 
  email: string; 
  name?: string; 
  role: string; 
  createdAt?: string; 
  balance?: number; 
  available_balance?: number; 
  reserved_balance?: number; 
  display_available?: number; 
  display_reserved?: number; 
  earned_balance?: number; 
  reserved_earned_balance?: number;
  referral_earned?: number;
  reserved_referral_earned?: number;
};

interface UsersTableProps {
  users: ApiUser[];
  loading?: boolean;
  error?: string;
  onDetail?: (user: ApiUser) => void;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export default function UsersTable({ 
  users, 
  loading, 
  error, 
  onDetail, 
  pagination, 
  currentPage, 
  pageSize, 
  onPageChange, 
  onPageSizeChange 
}: UsersTableProps) {
  const [selectedUser, setSelectedUser] = useState<ApiUser | null>(null);

  const handleDetail = (user: ApiUser) => {
    setSelectedUser(user);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
  };

  if (loading) return <p className="text-slate-600 dark:text-slate-400">Yükleniyor...</p>;
  if (error) return <p className="text-red-600 text-sm">{error}</p>;

  return (
    <div className="space-y-4">
      {/* Users Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-slate-900 dark:text-white">
          <thead>
            <tr className="text-left border-b border-black/10 dark:border-white/10">
              <th className="py-2 pr-4">Ad</th>
              <th className="py-2 pr-4">E-posta</th>
              <th className="py-2 pr-4">Rol</th>
              <th className="py-2 pr-4">Oluşturulma</th>
              <th className="py-2 pr-4">Toplam Bakiye</th>
              <th className="py-2 pr-4">Link Kazancı</th>
              <th className="py-2 pr-4">Referans Kazancı</th>
              <th className="py-2 pr-4">Detay</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={(u._id || u.id) as string} className="border-b border-black/5 dark:border-white/5">
                <td className="py-2 pr-4">{u.name || "-"}</td>
                <td className="py-2 pr-4">{u.email}</td>
                <td className="py-2 pr-4">{u.role}</td>
                <td className="py-2 pr-4">{u.createdAt ? new Date(u.createdAt).toLocaleString() : "-"}</td>
                <td className="py-2 pr-4">
                  {(() => {
                    // Toplam bakiye = available_balance (kullanılabilir bakiye)
                    const totalBalance = Number(u.available_balance ?? u.balance ?? 0);
                    return `₺${totalBalance.toLocaleString()}`;
                  })()}
                </td>
                <td className="py-2 pr-4">
                  {(() => {
                    // Link kazancı = earned_balance (link kısaltmalardan gelen)
                    const earnedBalance = Number(u.earned_balance ?? 0);
                    return `₺${earnedBalance.toLocaleString()}`;
                  })()}
                </td>
                <td className="py-2 pr-4">
                  {(() => {
                    // Referans kazancı = referral_earned
                    const referralBalance = Number(u.referral_earned ?? 0);
                    return `₺${referralBalance.toLocaleString()}`;
                  })()}
                </td>
                <td className="py-2 pr-4">
                  <button onClick={() => handleDetail(u)} className="h-8 px-3 rounded-lg border border-black/10 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs">Detay</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {pagination && (
        <Pagination
          currentPage={currentPage}
          totalPages={pagination.totalPages}
          onPageChange={onPageChange}
        />
      )}

      {/* User Detail Modal */}
      <UserDetailModal 
        user={selectedUser} 
        isOpen={!!selectedUser} 
        onClose={handleCloseModal} 
      />
    </div>
  );
}


