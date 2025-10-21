"use client";

import UsersTable from "./UsersTable";
import { useAppDispatch, useAppSelector } from "@/store";
import { useEffect, useState } from "react";
import { fetchAllUsersThunk, fetchBansThunk } from "@/store/slices/usersSlice";
import { FiSearch } from "react-icons/fi";
import { Button } from "@/components/ui/Button";

interface UsersListProps {}

export default function UsersList({}: UsersListProps) {
  const dispatch = useAppDispatch();
  const { token } = useAppSelector((s) => s.auth);
  const { users, status, error, pagination } = useAppSelector((s) => s.users);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [searchTerm, setSearchTerm] = useState("");
  const [showBans, setShowBans] = useState(false);
  const [bans, setBans] = useState<any[]>([]);
  const [roleFilter, setRoleFilter] = useState<string>("all");

  useEffect(() => {
    if (!token) return;
    dispatch<any>(fetchAllUsersThunk({ token, page: currentPage, limit: pageSize, search: searchTerm, role: roleFilter }));
  }, [token, dispatch, currentPage, pageSize, searchTerm, roleFilter]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    if (token) {
      dispatch<any>(fetchAllUsersThunk({ token, page: newPage, limit: pageSize, search: searchTerm, role: roleFilter }));
    }
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1);
    if (token) {
      dispatch<any>(fetchAllUsersThunk({ token, page: 1, limit: newSize, search: searchTerm, role: roleFilter }));
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleRoleFilter = (role: string) => {
    setRoleFilter(role);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleToggleBans = async () => {
    if (!token) return;
    if (!showBans) {
      const res = await dispatch<any>(fetchBansThunk({ token, page: 1, limit: 50 }));
      const data = res?.payload;
      setBans(data?.bans || []);
    }
    setShowBans(!showBans);
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 max-w-md">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Kullanıcı adı, email veya ID ile ara..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1 text-base rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          />
        </div>
        
        {/* Role Filter */}
        <select
          value={roleFilter}
          onChange={(e) => handleRoleFilter(e.target.value)}
          className="px-3 py-1 text-base rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
        >
          <option value="all">Tüm Roller</option>
          <option value="user">Kullanıcı</option>
          <option value="advertiser">Reklam Veren</option>
          <option value="admin">Admin</option>
        </select>

        {searchTerm && (
          <button
            onClick={() => handleSearch("")}
            className="px-3 py-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
          >
            Temizle
          </button>
        )}
        <Button onClick={handleToggleBans} variant="secondary">
          {showBans ? "Banları Gizle" : "Banlananları Göster"}
        </Button>
      </div>

      {!showBans && (
      <UsersTable 
        users={users} 
        loading={status === "loading"} 
        error={error} 
        onDetail={() => {}}
        pagination={pagination}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />)}
      {showBans && (
        <div className="space-y-2">
          <div className="text-sm font-semibold">Banlanan Kayıtlar ({bans.length})</div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-slate-900 dark:text-white">
              <thead>
                <tr className="text-left border-b border-black/10 dark:border-white/10">
                  <th className="py-2 pr-4">IP</th>
                  <th className="py-2 pr-4">Cihaz Kimliği</th>
                  <th className="py-2 pr-4">Aktif</th>
                  <th className="py-2 pr-4">Bitiş</th>
                  <th className="py-2 pr-4">Sebep</th>
                </tr>
              </thead>
              <tbody>
                {bans.map((b) => (
                  <tr key={b._id} className="border-b border-black/5 dark:border-white/5">
                    <td className="py-2 pr-4">{b.ip || '-'}</td>
                    <td className="py-2 pr-4">{b.mac || '-'}</td>
                    <td className="py-2 pr-4">{b.active ? 'Evet' : 'Hayır'}</td>
                    <td className="py-2 pr-4">{b.expiresAt ? new Date(b.expiresAt).toLocaleString() : '-'}</td>
                    <td className="py-2 pr-4">{b.reason || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}


