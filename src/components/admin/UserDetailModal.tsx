"use client";

import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { updateUserThunk } from "@/store/slices/usersSlice";
import { fetchAllPaymentsThunk } from "@/store/slices/paymentsSlice";
import { fetchUserLinksThunk } from "@/store/slices/linksSlice";
import { Button } from "@/components/ui/Button";
import { createDeviceBanThunk, createIpBanThunk, createEmailBanThunk, createComprehensiveBanThunk } from "@/store/slices/usersSlice";
import Pagination from "@/components/common/Pagination";
import LinkDetailModal from "./LinkDetailModal";

interface UserDetailModalProps {
  user: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function UserDetailModal({ user, isOpen, onClose }: UserDetailModalProps) {
  const dispatch = useAppDispatch();
  const { token } = useAppSelector((s) => s.auth);
  const { allPayments } = useAppSelector((s) => s.payments);
  const { links, userLinksPagination } = useAppSelector((s) => s.links);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [linksPage, setLinksPage] = useState(1);
  const [linksPageSize, setLinksPageSize] = useState(5);
  const [paymentsPage, setPaymentsPage] = useState(1);
  const paymentsPageSize = 5;
  const [selectedLink, setSelectedLink] = useState<any>(null);
  const [banReason, setBanReason] = useState<string>("");
  const [banExpiresAt, setBanExpiresAt] = useState<string>("");
  const [showWithdrawalsModal, setShowWithdrawalsModal] = useState(false);
  const [showLinksModal, setShowLinksModal] = useState(false);
  const [showReferralsModal, setShowReferralsModal] = useState(false);
  const [showBanModal, setShowBanModal] = useState(false);

  useEffect(() => {
    if (user && isOpen) {
      setEditData({
        name: user.name || "",
        email: user.email || "",
        role: user.role || "user",
        available_balance: user.available_balance || 0,
        earned_balance: user.earned_balance || 0,
        reserved_earned_balance: user.reserved_earned_balance || 0,
        referral_earned: user.referral_earned || 0,
        reserved_referral_earned: user.reserved_referral_earned || 0,
        referralCode: user.referralCode || ""
      });
      setIsEditing(false);
      
      // Kullanıcının ödemelerini ve linklerini yükle
      if (token) {
        dispatch(fetchAllPaymentsThunk());
        dispatch(fetchUserLinksThunk({ token, userId: user._id || user.id, page: linksPage, limit: linksPageSize }));
      }
    }
  }, [user, isOpen, dispatch, token]);

  const handleSave = async () => {
    if (!user) return;
    
    try {
      setSaving(true);
      await dispatch<any>(updateUserThunk({
        userId: user._id || user.id,
        data: editData
      }));
      setIsEditing(false);
      // Parent component'e kullanıcının güncellendiğini bildir
      onClose();
    } catch (e) {
      console.error("Kullanıcı güncellenirken hata:", e);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({
      name: user?.name || "",
      email: user?.email || "",
      role: user?.role || "user",
      available_balance: user?.available_balance || 0,
      earned_balance: user?.earned_balance || 0,
      reserved_earned_balance: user?.reserved_earned_balance || 0,
      referral_earned: user?.referral_earned || 0,
      reserved_referral_earned: user?.reserved_referral_earned || 0,
      referralCode: user?.referralCode || ""
    });
  };

  const handleLinksPageChange = (newPage: number) => {
    setLinksPage(newPage);
    if (token && user) {
      dispatch(fetchUserLinksThunk({ token, userId: user._id || user.id, page: newPage, limit: linksPageSize }));
    }
  };

  const handleLinksPageSizeChange = (newSize: number) => {
    setLinksPageSize(newSize);
    setLinksPage(1);
    if (token && user) {
      dispatch(fetchUserLinksThunk({ token, userId: user._id || user.id, page: 1, limit: newSize }));
    }
  };

  const handleLinkDetail = (link: any) => {
    setSelectedLink(link);
  };

  const handleCloseLinkDetail = () => {
    setSelectedLink(null);
  };

  const handleBanUser = async () => {
    if (!token || !user) return;
    
    try {
      const reason = banReason || `Kullanıcı banlandı: ${user.email}`;
      
     
      // IP'leri topla
      const ips: string[] = [];
      if (user.registrationIp) ips.push(user.registrationIp);
      if (user.lastLoginIp && user.lastLoginIp !== user.registrationIp) {
        ips.push(user.lastLoginIp);
      }
      
      // Cihaz kimliklerini topla
      const deviceIds: string[] = [];
      if (user.registrationDeviceId) deviceIds.push(user.registrationDeviceId);
      if (user.deviceIds && user.deviceIds.length > 0) {
        deviceIds.push(...user.deviceIds);
      }
      
   
      
      // Comprehensive ban oluştur
      const banResult = await dispatch<any>(createComprehensiveBanThunk({
        token,
        email: user.email,
        ips: ips.length > 0 ? ips : undefined,
        deviceIds: deviceIds.length > 0 ? deviceIds : undefined,
        reason,
        expiresAt: banExpiresAt || undefined,
        userId: user._id || user.id
      }));
      
      
      // Başarı mesajı
      const banDetails = [];
      banDetails.push(`Email: ${user.email}`);
      if (ips.length > 0) banDetails.push(`IP'ler: ${ips.join(', ')}`);
      if (deviceIds.length > 0) banDetails.push(`Cihaz Kimlikleri: ${deviceIds.length} adet`);
      
      if (typeof window !== 'undefined') {
        alert(`Kullanıcı başarıyla banlandı!\n\nBanlanan öğeler:\n${banDetails.join('\n')}`);
        setShowBanModal(false);
        setBanReason("");
        setBanExpiresAt("");
      }
    } catch (error) {
      console.error("Comprehensive ban işlemi hatası:", error);
      if (typeof window !== 'undefined') alert("Ban işlemi başarısız: " + (error as Error).message);
    }
  };

  if (!isOpen || !user) return null;

  // Kullanıcının ödemelerini filtrele
  const userPayments = allPayments?.filter((p: any) => String(p.ownerId) === String(user._id || user.id)) || [];
  const withdrawalPayments = userPayments.filter((p: any) => p.category === "withdrawal");
  const paymentsTotalPages = Math.max(1, Math.ceil(withdrawalPayments.length / paymentsPageSize));
  const paymentsStart = (paymentsPage - 1) * paymentsPageSize;
  const paymentsEnd = paymentsStart + paymentsPageSize;
  const paginatedWithdrawals = withdrawalPayments.slice(paymentsStart, paymentsEnd);
  
  // Kullanıcının linklerini filtrele (artık backend'den filtrelenmiş geliyor)
  const userLinks = links || [];
  const activeLinks = userLinks.filter((l: any) => !l.disabled);

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center p-4 z-50" 
     
    >
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full mx-20 mt-10 max-w-6xl max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            Kullanıcı Detayları - {user.name || user.email}
          </h3>
          <div className="flex gap-2">
            {!isEditing ? (
              <>
                <Button onClick={() => setIsEditing(true)} variant="secondary">
                  Düzenle
                </Button>
                <Button onClick={() => setShowBanModal(true)} variant="secondary" className="bg-red-600 hover:bg-red-700 text-white">
                  Banla
                </Button>
              </>
            ) : (
              <>
                <Button onClick={handleCancel} variant="secondary">
                  İptal
                </Button>
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? "Kaydediliyor..." : "Kaydet"}
                </Button>
              </>
            )}
            <button 
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Temel Bilgiler */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs text-slate-600 dark:text-slate-300">Ad</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) => setEditData({...editData, name: e.target.value})}
                  className="w-full h-11 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-slate-800 px-3 text-sm text-slate-900 dark:text-white"
                />
              ) : (
                <div className="h-11 rounded-xl border border-black/10 dark:border-white/10 bg-slate-50 dark:bg-slate-800 px-3 flex items-center text-sm text-slate-900 dark:text-white">
                  {user.name || "-"}
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <label className="block text-xs text-slate-600 dark:text-slate-300">E-posta</label>
              {isEditing ? (
                <input
                  type="email"
                  value={editData.email}
                  onChange={(e) => setEditData({...editData, email: e.target.value})}
                  className="w-full h-11 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-slate-800 px-3 text-sm text-slate-900 dark:text-white"
                />
              ) : (
                <div className="h-11 rounded-xl border border-black/10 dark:border-white/10 bg-slate-50 dark:bg-slate-800 px-3 flex items-center text-sm text-slate-900 dark:text-white">
                  {user.email}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-xs text-slate-600 dark:text-slate-300">Referans Kodu</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editData.referralCode}
                  onChange={(e) => {
                    const v = (e.target.value || "").toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0,6);
                    setEditData({ ...editData, referralCode: v });
                  }}
                  placeholder="ABC123"
                  className="w-full h-11 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-slate-800 px-3 text-sm text-slate-900 dark:text-white font-mono"
                />
              ) : (
                <div className="h-11 rounded-xl border border-black/10 dark:border-white/10 bg-slate-50 dark:bg-slate-800 px-3 flex items-center text-sm text-slate-900 dark:text-white font-mono">
                  {user.referralCode || "-"}
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <label className="block text-xs text-slate-600 dark:text-slate-300">Rol</label>
              {isEditing ? (
                <select
                  value={editData.role}
                  onChange={(e) => setEditData({...editData, role: e.target.value})}
                  className="w-full h-11 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-slate-800 px-3 text-sm text-slate-900 dark:text-white"
                >
                  <option value="user">User</option>
                  <option value="advertiser">Advertiser</option>
                  <option value="admin">Admin</option>
                </select>
              ) : (
                <div className="h-11 rounded-xl border border-black/10 dark:border-white/10 bg-slate-50 dark:bg-slate-800 px-3 flex items-center text-sm text-slate-900 dark:text-white">
                  <span className="px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 capitalize">
                    {user.role}
                  </span>
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <label className="block text-xs text-slate-600 dark:text-slate-300">Oluşturulma Tarihi</label>
              <div className="h-11 rounded-xl border border-black/10 dark:border-white/10 bg-slate-50 dark:bg-slate-800 px-3 flex items-center text-sm text-slate-900 dark:text-white">
                {user.createdAt ? new Date(user.createdAt).toLocaleString() : "-"}
              </div>
            </div>
          </div>

          {/* Bakiye Bilgileri */}
          <div className="space-y-4">
            <h4 className="text-md font-semibold text-slate-900 dark:text-white">Bakiye Bilgileri</h4>
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <label className="block text-xs text-slate-600 dark:text-slate-300">Toplam Bakiye (Kullanılabilir)</label>
                {isEditing ? (
                  <input
                    type="number"
                    step="0.01"
                    value={editData.available_balance}
                    onChange={(e) => setEditData({...editData, available_balance: Number(e.target.value)})}
                    className="w-full h-11 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-slate-800 px-3 text-sm text-slate-900 dark:text-white"
                  />
                ) : (
                  <div className="h-11 rounded-xl border border-black/10 dark:border-white/10 bg-slate-50 dark:bg-slate-800 px-3 flex items-center text-sm text-slate-900 dark:text-white">
                    ₺{Number(user.available_balance || 0).toLocaleString()}
                  </div>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div className="space-y-2">
                <label className="block text-xs text-slate-600 dark:text-slate-300">Link Kazancı (Kısaltmalardan)</label>
                {isEditing ? (
                  <input
                    type="number"
                    step="0.01"
                    value={editData.earned_balance}
                    onChange={(e) => setEditData({...editData, earned_balance: Number(e.target.value)})}
                    className="w-full h-11 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-slate-800 px-3 text-sm text-slate-900 dark:text-white"
                  />
                ) : (
                  <div className="h-11 rounded-xl border border-black/10 dark:border-white/10 bg-slate-50 dark:bg-slate-800 px-3 flex items-center text-sm text-slate-900 dark:text-white">
                    ₺{Number(user.earned_balance || 0).toLocaleString()}
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <label className="block text-xs text-slate-600 dark:text-slate-300">Rezerve Link Kazancı (Reklam Tıklamaları)</label>
                {isEditing ? (
                  <input
                    type="number"
                    step="0.01"
                    value={editData.reserved_earned_balance}
                    onChange={(e) => setEditData({...editData, reserved_earned_balance: Number(e.target.value)})}
                    className="w-full h-11 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-slate-800 px-3 text-sm text-slate-900 dark:text-white"
                  />
                ) : (
                  <div className="h-11 rounded-xl border border-black/10 dark:border-white/10 bg-slate-50 dark:bg-slate-800 px-3 flex items-center text-sm text-slate-900 dark:text-white">
                    ₺{Number(user.reserved_earned_balance || 0).toLocaleString()}
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <label className="block text-xs text-slate-600 dark:text-slate-300">Referans Kazancı</label>
                {isEditing ? (
                  <input
                    type="number"
                    step="0.01"
                    value={editData.referral_earned}
                    onChange={(e) => setEditData({...editData, referral_earned: Number(e.target.value)})}
                    className="w-full h-11 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-slate-800 px-3 text-sm text-slate-900 dark:text-white"
                  />
                ) : (
                  <div className="h-11 rounded-xl border border-black/10 dark:border-white/10 bg-slate-50 dark:bg-slate-800 px-3 flex items-center text-sm text-slate-900 dark:text-white">
                    ₺{Number(user.referral_earned || 0).toLocaleString()}
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <label className="block text-xs text-slate-600 dark:text-slate-300">Rezerve Referans Kazancı</label>
                {isEditing ? (
                  <input
                    type="number"
                    step="0.01"
                    value={editData.reserved_referral_earned}
                    onChange={(e) => setEditData({...editData, reserved_referral_earned: Number(e.target.value)})}
                    className="w-full h-11 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-slate-800 px-3 text-sm text-slate-900 dark:text-white"
                  />
                ) : (
                  <div className="h-11 rounded-xl border border-black/10 dark:border-white/10 bg-slate-50 dark:bg-slate-800 px-3 flex items-center text-sm text-slate-900 dark:text-white">
                    ₺{Number(user.reserved_referral_earned || 0).toLocaleString()}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <h4 className="text-md font-semibold text-slate-900 dark:text-white">Detaylar</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                onClick={() => setShowWithdrawalsModal(true)} 
                variant="secondary"
                className="flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                Para Çekimleri ({withdrawalPayments.length})
              </Button>
              
              <Button 
                onClick={() => setShowLinksModal(true)} 
                variant="secondary"
                className="flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                Linkler ({userLinksPagination?.total || 0})
              </Button>
              
              <Button 
                onClick={() => setShowReferralsModal(true)} 
                variant="secondary"
                className="flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Referanslar
              </Button>
            </div>
          </div>

          {/* İstatistikler */}
          <div className="space-y-4">
            <h4 className="text-md font-semibold text-slate-900 dark:text-white">İstatistikler</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="rounded-xl border border-black/10 dark:border-white/10 bg-slate-50/60 dark:bg-slate-800/40 p-4">
                <div className="text-xs text-slate-600 dark:text-slate-300">Toplam Bakiye</div>
                <div className="text-lg font-semibold text-slate-900 dark:text-white">
                  ₺{Number(user.available_balance || 0).toLocaleString()}
                </div>
              </div>
              <div className="rounded-xl border border-black/10 dark:border-white/10 bg-slate-50/60 dark:bg-slate-800/40 p-4">
                <div className="text-xs text-slate-600 dark:text-slate-300">Link Kazancı</div>
                <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                  ₺{Number(user.earned_balance || 0).toLocaleString()}
                </div>
              </div>
              <div className="rounded-xl border border-black/10 dark:border-white/10 bg-slate-50/60 dark:bg-slate-800/40 p-4">
                <div className="text-xs text-slate-600 dark:text-slate-300">Referans Kazancı</div>
                <div className="text-lg font-semibold text-green-600 dark:text-green-400">
                  ₺{Number(user.referral_earned || 0).toLocaleString()}
                </div>
              </div>
              <div className="rounded-xl border border-black/10 dark:border-white/10 bg-slate-50/60 dark:bg-slate-800/40 p-4">
                <div className="text-xs text-slate-600 dark:text-slate-300">Toplam Çekim</div>
                <div className="text-lg font-semibold text-orange-600 dark:text-orange-400">
                  ₺{withdrawalPayments.reduce((sum: number, p: any) => sum + Number(p.amount || 0), 0).toLocaleString()}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
      
      <LinkDetailModal 
        link={selectedLink} 
        isOpen={!!selectedLink} 
        onClose={handleCloseLinkDetail} 
      />

      {/* Withdrawals Modal */}
      {showWithdrawalsModal && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50 bg-black/50">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-4xl max-h-[80vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Para Çekimleri ({withdrawalPayments.length})
              </h3>
              <button onClick={() => setShowWithdrawalsModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
            <div className="p-6">
              {withdrawalPayments.length > 0 ? (
                <div className="space-y-2">
                  {withdrawalPayments.map((payment: any, index: number) => (
                    <div key={index} className="rounded-xl border border-black/10 dark:border-white/10 bg-slate-50/60 dark:bg-slate-800/40 p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium text-slate-900 dark:text-white">
                            ₺{Number(payment.amount).toLocaleString()}
                          </div>
                          <div className="text-xs text-slate-600 dark:text-slate-400">
                            {payment.createdAt ? new Date(payment.createdAt).toLocaleString() : "-"}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {payment.withdrawalType && (
                            <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                              payment.withdrawalType === "referral" 
                                ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200"
                                : "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
                            }`}>
                              {payment.withdrawalType === "referral" ? "Referans" : "Normal"}
                            </span>
                          )}
                          <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                            payment.status === "approved" ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200" :
                            payment.status === "pending" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200" :
                            "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200"
                          }`}>
                            {payment.status === "approved" ? "Onaylandı" :
                             payment.status === "pending" ? "Beklemede" : "Reddedildi"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                  Henüz para çekimi yapılmamış
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Links Modal */}
      {showLinksModal && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50 bg-black/50">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-6xl max-h-[80vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Linkler ({userLinksPagination?.total || 0})
              </h3>
              <button onClick={() => setShowLinksModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
            <div className="p-6">
              {links && links.length > 0 ? (
                <>
                  <div className="space-y-2">
                    {links.map((link: any, index: number) => (
                      <div key={index} className="rounded-xl border border-black/10 dark:border-white/10 bg-slate-50/60 dark:bg-slate-800/40 p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-slate-900 dark:text-white truncate">
                              {link.targetUrl}
                            </div>
                            <div className="text-xs text-slate-600 dark:text-slate-400">
                              Slug: {link.slug} | Tıklama: {link.clicks || 0} | Kazanç: ₺{Number(link.earnings || 0).toLocaleString()}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-500">
                              Oluşturulma: {new Date(link.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              onClick={() => handleLinkDetail(link)}
                              variant="secondary"
                              size="sm"
                              className="text-xs px-2 py-1"
                            >
                              Detay
                            </Button>
                            <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                              link.disabled 
                                ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200'
                                : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200'
                            }`}>
                              {link.disabled ? 'Devre Dışı' : 'Aktif'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {userLinksPagination && userLinksPagination.totalPages > 1 && (
                    <div className="mt-4">
                      <Pagination
                        currentPage={linksPage}
                        totalPages={userLinksPagination.totalPages}
                        onPageChange={handleLinksPageChange}
                      />
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                  Henüz link yok
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Referrals Modal */}
      {showReferralsModal && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50 bg-black/50">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-4xl max-h-[80vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Referans Bilgileri
              </h3>
              <button onClick={() => setShowReferralsModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-xs text-slate-600 dark:text-slate-300">Referans Kodu</label>
                  <div className="h-11 rounded-xl border border-black/10 dark:border-white/10 bg-slate-50 dark:bg-slate-800 px-3 flex items-center text-sm text-slate-900 dark:text-white font-mono">
                    {user.referralCode || "-"}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-xs text-slate-600 dark:text-slate-300">Referans Sayısı</label>
                  <div className="h-11 rounded-xl border border-black/10 dark:border-white/10 bg-slate-50 dark:bg-slate-800 px-3 flex items-center text-sm text-slate-900 dark:text-white">
                    {user.referralCount || 0}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-xs text-slate-600 dark:text-slate-300">Referans Kazancı</label>
                  <div className="h-11 rounded-xl border border-black/10 dark:border-white/10 bg-slate-50 dark:bg-slate-800 px-3 flex items-center text-sm text-slate-900 dark:text-white">
                    ₺{Number(user.referral_earned || 0).toLocaleString()}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-xs text-slate-600 dark:text-slate-300">Rezerve Referans Kazancı</label>
                  <div className="h-11 rounded-xl border border-black/10 dark:border-white/10 bg-slate-50 dark:bg-slate-800 px-3 flex items-center text-sm text-slate-900 dark:text-white">
                    ₺{Number(user.reserved_referral_earned || 0).toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="text-center py-4 text-slate-500 dark:text-slate-400">
                Referans detayları ve istatistikleri burada gösterilecek
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ban Modal */}
      {showBanModal && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50 bg-black/50">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md shadow-2xl border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Kullanıcıyı Banla
              </h3>
              <button onClick={() => setShowBanModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="text-red-600 dark:text-red-400 text-lg">⚠️</div>
                  <div>
                    <h4 className="text-sm font-semibold text-red-800 dark:text-red-200 mb-2">
                      Dikkat: Bu işlem geri alınamaz!
                    </h4>
                    <p className="text-xs text-red-700 dark:text-red-300">
                      Kullanıcı banlandığında aşağıdaki öğeler de banlanacak:
                    </p>
                    <ul className="text-xs text-red-700 dark:text-red-300 mt-2 space-y-1">
                      <li>• Email: {user.email}</li>
                      {user.registrationIp ? (
                        <li>• Kayıt IP: {user.registrationIp}</li>
                      ) : (
                        <li>• Kayıt IP: <span className="text-yellow-600">Bulunamadı</span></li>
                      )}
                      {user.lastLoginIp ? (
                        user.lastLoginIp !== user.registrationIp ? (
                          <li>• Son Giriş IP: {user.lastLoginIp}</li>
                        ) : (
                          <li>• Son Giriş IP: {user.lastLoginIp} <span className="text-blue-600">(Kayıt IP ile aynı)</span></li>
                        )
                      ) : (
                        <li>• Son Giriş IP: <span className="text-yellow-600">Bulunamadı</span></li>
                      )}
                      {user.registrationDeviceId ? (
                        <li>• Cihaz Kimliği: {user.registrationDeviceId}</li>
                      ) : (
                        <li>• Cihaz Kimliği: <span className="text-yellow-600">Bulunamadı</span></li>
                      )}
                      {user.deviceIds && user.deviceIds.length > 0 ? (
                        <li>• {user.deviceIds.length} Ek Cihaz Kimliği</li>
                      ) : (
                        <li>• Ek Cihaz Kimliği: <span className="text-yellow-600">Bulunamadı</span></li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Ban Sebebi <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={banReason}
                    onChange={(e) => setBanReason(e.target.value)}
                    placeholder="Ban sebebini girin..."
                    className="w-full h-20 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-red-500"
                    maxLength={500}
                  />
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {banReason.length}/500 karakter
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Ban Bitiş Tarihi (Opsiyonel)
                  </label>
                  <input
                    type="datetime-local"
                    value={banExpiresAt}
                    onChange={(e) => setBanExpiresAt(e.target.value)}
                    className="w-full h-11 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Boş bırakırsanız kalıcı ban olur
                  </p>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  onClick={() => setShowBanModal(false)} 
                  variant="secondary" 
                  className="flex-1"
                >
                  İptal
                </Button>
                <Button 
                  onClick={handleBanUser} 
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                  disabled={!banReason.trim()}
                >
                  Kullanıcıyı Banla
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
