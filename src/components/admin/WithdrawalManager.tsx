"use client";

import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import Pagination from "../common/Pagination";
import { 
  fetchUserWithdrawalsThunk, 
  updatePaymentStatusThunk, 
  updateAdminNotesThunk 
} from "@/store/slices/paymentsSlice";

interface WithdrawalRequest {
  _id: string;
  amount: number;
  status: string;
  createdAt: string;
  iban?: string;
  fullName?: string;
  adminNotes?: string;
  ownerId?: {
    _id: string;
    email: string;
    name?: string;
    fullName?: string;
    iban?: string;
  };
}

export default function WithdrawalManager() {
  const dispatch = useAppDispatch();
  const { userWithdrawals, status, withdrawalsPagination } = useAppSelector((s) => s.payments);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<WithdrawalRequest | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [activeTab, setActiveTab] = useState<"pending" | "approved" | "rejected">("pending");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Fetch data when page, pageSize, or activeTab changes
  useEffect(() => {
    dispatch(fetchUserWithdrawalsThunk({ page: currentPage, limit: pageSize, status: activeTab }));
  }, [currentPage, pageSize, activeTab, dispatch]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1);
  };

  const handleTabChange = (newTab: "pending" | "approved" | "rejected") => {
    setActiveTab(newTab);
    setCurrentPage(1); // Reset pagination when tab changes
  };

  const updateWithdrawalStatus = async (id: string, status: string) => {
    try {
      await dispatch(updatePaymentStatusThunk({ paymentId: id, status }));
      setSelectedWithdrawal(null);
    } catch (error) {
      console.error("Durum güncellenemedi:", error);
    }
  };

  const updateAdminNotes = async (id: string) => {
    try {
      await dispatch(updateAdminNotesThunk({ paymentId: id, adminNotes }));
      setAdminNotes("");
    } catch (error) {
      console.error("Not güncellenemedi:", error);
    }
  };

  // Use backend filtered data - no client-side filtering needed
  const currentWithdrawals = userWithdrawals;
  const pagination = withdrawalsPagination;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "approved": return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "rejected": return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Çekim Yönetimi</h2>
        <Button 
          variant="secondary" 
          onClick={() => dispatch(fetchUserWithdrawalsThunk({ page: currentPage, limit: pageSize, status: activeTab }))}
        >
          Yenile
        </Button>
      </div>

      {/* Özet Kartları - Tıklanabilir */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card 
          className={`p-3 cursor-pointer transition-all hover:shadow-md ${
            activeTab === "pending" 
              ? "ring-2 ring-yellow-500 dark:ring-yellow-400 bg-yellow-50 dark:bg-yellow-900/10" 
              : "hover:bg-slate-50 dark:hover:bg-slate-800"
          }`}
          onClick={() => handleTabChange("pending")}
        >
          <div className="text-xs text-slate-600 dark:text-slate-400">Bekleyen Çekimler</div>
          <div className="text-xl font-bold text-yellow-600 dark:text-yellow-400">
            {activeTab === "pending" ? (pagination?.total || 0) : 0}
          </div>
          <div className="text-xs text-slate-500">
            ₺{activeTab === "pending" ? currentWithdrawals.reduce((sum, w) => sum + w.amount, 0).toLocaleString() : 0}
          </div>
        </Card>
        
        <Card 
          className={`p-3 cursor-pointer transition-all hover:shadow-md ${
            activeTab === "approved" 
              ? "ring-2 ring-green-500 dark:ring-green-400 bg-green-50 dark:bg-green-900/10" 
              : "hover:bg-slate-50 dark:hover:bg-slate-800"
          }`}
          onClick={() => handleTabChange("approved")}
        >
          <div className="text-xs text-slate-600 dark:text-slate-400">Onaylanan Çekimler</div>
          <div className="text-xl font-bold text-green-600 dark:text-green-400">
            {activeTab === "approved" ? (pagination?.total || 0) : 0}
          </div>
          <div className="text-xs text-slate-500">
            ₺{activeTab === "approved" ? currentWithdrawals.reduce((sum, w) => sum + w.amount, 0).toLocaleString() : 0}
          </div>
        </Card>
        
        <Card 
          className={`p-3 cursor-pointer transition-all hover:shadow-md ${
            activeTab === "rejected" 
              ? "ring-2 ring-red-500 dark:ring-red-400 bg-red-50 dark:bg-red-900/10" 
              : "hover:bg-slate-50 dark:hover:bg-slate-800"
          }`}
          onClick={() => handleTabChange("rejected")}
        >
          <div className="text-xs text-slate-600 dark:text-slate-400">Reddedilen Çekimler</div>
          <div className="text-xl font-bold text-red-600 dark:text-red-400">
            {activeTab === "rejected" ? (pagination?.total || 0) : 0}
          </div>
          <div className="text-xs text-slate-500">
            ₺{activeTab === "rejected" ? currentWithdrawals.reduce((sum, w) => sum + w.amount, 0).toLocaleString() : 0}
          </div>
        </Card>
      </div>

      {/* Çekim Listesi - Dinamik Tab */}
      <div className="flex flex-col h-full">
        <h3 className="text-base font-medium text-slate-900 dark:text-white mb-3">
          {activeTab === "pending" && `Bekleyen Çekimler (${pagination?.total || 0})`}
          {activeTab === "approved" && `Onaylanan Çekimler (${pagination?.total || 0})`}
          {activeTab === "rejected" && `Reddedilen Çekimler (${pagination?.total || 0})`}
        </h3>
        
        {status === "loading" ? (
          <div className="text-slate-600 dark:text-slate-400">Yükleniyor...</div>
        ) : (
          <div className="flex-1 flex flex-col">
            <div className="flex-1">
              <div className="space-y-3">
                {currentWithdrawals.map((withdrawal) => (
                <Card key={withdrawal._id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <div className="font-medium text-slate-900 dark:text-white">
                          {withdrawal.ownerId?.name || withdrawal.ownerId?.email}
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(withdrawal.status)}`}>
                          {withdrawal.status}
                        </span>
                      </div>
                      
                      <div className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                        <div>Miktar: ₺{withdrawal.amount.toLocaleString()}</div>
                        <div>IBAN: {withdrawal.iban || withdrawal.ownerId?.iban || "Belirtilmemiş"}</div>
                        <div>Ad Soyad: {withdrawal.fullName || withdrawal.ownerId?.fullName || "Belirtilmemiş"}</div>
                        <div>Tarih: {new Date(withdrawal.createdAt).toLocaleString()}</div>
                        {withdrawal.adminNotes && (
                          <div className="mt-2 p-2 bg-slate-100 dark:bg-slate-800 rounded text-xs">
                            <strong>Admin Notu:</strong> {withdrawal.adminNotes}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setSelectedWithdrawal(withdrawal)}
                      >
                        Detay
                      </Button>
                      {activeTab === "pending" && (
                        <>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => updateWithdrawalStatus(withdrawal._id, "approved")}
                          >
                            Onayla
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => updateWithdrawalStatus(withdrawal._id, "rejected")}
                          >
                            Reddet
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </Card>
                ))}
                
                {currentWithdrawals.length === 0 && (
                  <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                    {activeTab === "pending" && "Bekleyen çekim isteği bulunmuyor"}
                    {activeTab === "approved" && "Onaylanan çekim bulunmuyor"}
                    {activeTab === "rejected" && "Reddedilen çekim bulunmuyor"}
                  </div>
                )}
              </div>
            </div>
            
            {pagination && pagination.totalPages > 1 && (
              <div className="mt-4">
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  totalItems={pagination.total}
                  pageSize={pagination.limit}
                  onPageChange={handlePageChange}
                  onPageSizeChange={handlePageSizeChange}
                  pageSizeOptions={[5, 10, 20, 50]}
                  showPageSizeSelector={true}
                  showItemCount={true}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Detay Modal */}
      {selectedWithdrawal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-2xl border border-black/10 dark:border-white/10 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Çekim Detayı
            </h3>
            
            <div className="space-y-3 mb-4">
              <div>
                <label className="text-sm text-slate-600 dark:text-slate-400">Kullanıcı</label>
                <div className="font-medium">{selectedWithdrawal.ownerId?.name || selectedWithdrawal.ownerId?.email}</div>
              </div>
              <div>
                <label className="text-sm text-slate-600 dark:text-slate-400">Miktar</label>
                <div className="font-medium">₺{selectedWithdrawal.amount.toLocaleString()}</div>
              </div>
              <div>
                <label className="text-sm text-slate-600 dark:text-slate-400">IBAN</label>
                <div className="font-medium">{selectedWithdrawal.iban || selectedWithdrawal.ownerId?.iban || "Belirtilmemiş"}</div>
              </div>
              <div>
                <label className="text-sm text-slate-600 dark:text-slate-400">Ad Soyad</label>
                <div className="font-medium">{selectedWithdrawal.fullName || selectedWithdrawal.ownerId?.fullName || "Belirtilmemiş"}</div>
              </div>
              <div>
                <label className="text-sm text-slate-600 dark:text-slate-400">Tarih</label>
                <div className="font-medium">{new Date(selectedWithdrawal.createdAt).toLocaleString()}</div>
              </div>
            </div>

            <div className="mb-4">
              <label className="text-sm text-slate-600 dark:text-slate-400 mb-2 block">
                Admin Notu
              </label>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                rows={3}
                placeholder="Admin notu ekleyin..."
              />
            </div>

            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={() => {
                  setSelectedWithdrawal(null);
                  setAdminNotes("");
                }}
                className="flex-1"
              >
                Kapat
              </Button>
              <Button
                variant="primary"
                onClick={() => updateAdminNotes(selectedWithdrawal._id)}
                className="flex-1"
              >
                Not Kaydet
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}