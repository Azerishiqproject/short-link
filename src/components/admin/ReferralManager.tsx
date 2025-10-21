"use client";

import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { FiUsers, FiDollarSign, FiSettings, FiCheck, FiX, FiEdit3, FiRefreshCw } from "react-icons/fi";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import {
  fetchReferralSettingsThunk,
  updateReferralSettingsThunk,
  fetchReferralTransactionsThunk,
  fetchReferralStatsThunk,
  bulkPayReferralTransactionsThunk,
  setActiveSection,
  setSelectedTransactions,
  toggleTransactionSelection,
  selectAllTransactions,
  clearSelectedTransactions,
  clearSettingsError,
  clearTransactionsError,
  clearStatsError,
} from "@/store/slices/referralSlice";


export default function ReferralManager() {
  const dispatch = useAppDispatch();
  const {
    settings,
    transactions,
    stats,
    settingsLoading,
    transactionsLoading,
    statsLoading,
    settingsError,
    transactionsError,
    statsError,
    selectedTransactions,
    activeSection,
  } = useAppSelector((state) => state.referral);
  
  const [editingSettings, setEditingSettings] = useState(false);
  const [selectedUserTransactions, setSelectedUserTransactions] = useState<any>(null);
  const [selectedRefereeUsers, setSelectedRefereeUsers] = useState<any>(null);
  const [selectedUserClicks, setSelectedUserClicks] = useState<any>(null);

  // Settings form state
  const [formData, setFormData] = useState({
    isActive: true,
    referrerPercentage: 10,
    minReferralEarning: 0.01,
    maxReferralEarning: 0,
    adminNotes: "",
    status: "active"
  });

  useEffect(() => {
    dispatch(fetchReferralSettingsThunk());
    dispatch(fetchReferralTransactionsThunk({}));
    dispatch(fetchReferralStatsThunk());
  }, [dispatch]);

  // Update form data when settings change
  useEffect(() => {
    if (settings) {
      setFormData({
        isActive: settings.isActive,
        referrerPercentage: settings.referrerPercentage,
        minReferralEarning: settings.minReferralEarning,
        maxReferralEarning: settings.maxReferralEarning,
        adminNotes: settings.adminNotes || "",
        status: settings.status
      });
    }
  }, [settings]);

  const handleSaveSettings = async () => {
    try {
      await dispatch(updateReferralSettingsThunk(formData)).unwrap();
      setEditingSettings(false);
      if (typeof window !== 'undefined') alert("Ayarlar başarıyla güncellendi!");
    } catch (error) {
      console.error("Error saving settings:", error);
      if (typeof window !== 'undefined') alert("Ayarlar güncellenirken hata oluştu!");
    }
  };

  const handleBulkPay = async () => {
    if (selectedTransactions.length === 0) {
      if (typeof window !== 'undefined') alert("Lütfen ödeme yapılacak işlemleri seçin!");
      return;
    }

    if (typeof window !== 'undefined' && !confirm(`${selectedTransactions.length} işlem için ödeme yapılacak. Emin misiniz?`)) {
      return;
    }

    try {
      const result = await dispatch(bulkPayReferralTransactionsThunk(selectedTransactions)).unwrap();
      if (typeof window !== 'undefined') alert(`${result.modifiedCount} işlem için ödeme yapıldı!`);
      dispatch(clearSelectedTransactions());
      dispatch(fetchReferralTransactionsThunk({}));
    } catch (error) {
      console.error("Error bulk paying:", error);
      if (typeof window !== 'undefined') alert("Toplu ödeme işleminde hata oluştu!");
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "text-green-600 bg-green-100";
      case "pending": return "text-yellow-600 bg-yellow-100";
      case "cancelled": return "text-red-600 bg-red-100";
      case "refunded": return "text-gray-600 bg-gray-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid": return "text-green-600 bg-green-100";
      case "pending": return "text-yellow-600 bg-yellow-100";
      case "failed": return "text-red-600 bg-red-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const loading = settingsLoading || transactionsLoading || statsLoading;
  
  if (loading && !settings) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xs font-bold text-slate-900 dark:text-white ">Referans Yönetimi</h2>
          <p className="text-slate-600 dark:text-slate-400 mt-1 text-xs">Referans sistemi ayarları ve işlemleri</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={activeSection === "settings" ? "primary" : "secondary"}
            onClick={() => dispatch(setActiveSection("settings"))}
            className="flex items-center gap-2 text-xs"
          >
            <FiSettings className="w-3 h-3 text-xs" />
            Ayarlar
          </Button>
          <Button
            variant={activeSection === "transactions" ? "primary" : "secondary"}
            onClick={() => dispatch(setActiveSection("transactions"))}
            className="flex items-center gap-2 text-xs"
          >
            <FiUsers className="w-3 h-3 text-xs" />
            İşlemler
          </Button>
          <Button
            variant={activeSection === "stats" ? "primary" : "secondary"}
            onClick={() => dispatch(setActiveSection("stats"))}
            className="flex items-center gap-2 text-xs"
          >
            <FiDollarSign className="w-3 h-3 text-xs" />
            İstatistikler
          </Button>
        </div>
      </div>

      {/* Error Messages */}
      {settingsError && (
        <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50 rounded-lg">
          <p className="text-red-600 dark:text-red-400 text-xs">{settingsError}</p>
          <button 
            onClick={() => dispatch(clearSettingsError())}
            className="mt-2 text-xs text-red-500 hover:text-red-700"
          >
            Kapat
          </button>
        </div>
      )}
      
      {transactionsError && (
        <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50 rounded-lg">
          <p className="text-red-600 dark:text-red-400 text-xs">{transactionsError}</p>
          <button 
            onClick={() => dispatch(clearTransactionsError())}
            className="mt-2 text-xs text-red-500 hover:text-red-700"
          >
            Kapat
          </button>
        </div>
      )}
      
      {statsError && (
        <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50 rounded-lg">
          <p className="text-red-600 dark:text-red-400 text-xs">{statsError}</p>
          <button 
            onClick={() => dispatch(clearStatsError())}
            className="mt-2 text-xs text-red-500 hover:text-red-700"
          >
            Kapat
          </button>
        </div>
      )}

      {/* Settings Section */}
      {activeSection === "settings" && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xs font-semibold text-slate-900 dark:text-white">Referans Ayarları</h3>
            {!editingSettings ? (
              <Button onClick={() => setEditingSettings(true)} className="flex items-center gap-2 text-xs">
                <FiEdit3 className="w-3 h-3 text-xs" />
                Düzenle
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button onClick={handleSaveSettings} disabled={loading} className="flex items-center gap-2 text-xs">
                  <FiCheck className="w-3 h-3 text-xs" />
                  Kaydet
                </Button>
                <Button variant="secondary" onClick={() => setEditingSettings(false)}>
                  <FiX className="w-3 h-3 text-xs" />
                </Button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Sistem Durumu
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  disabled={!editingSettings}
                  className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-xs"
                >
                  <option value="active">Aktif</option>
                  <option value="paused">Duraklatıldı</option>
                  <option value="maintenance">Bakım</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Sistem Aktif
                </label>
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  disabled={!editingSettings}
                  className="w-3 h-3 text-blue-600 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Referans Yüzdesi (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.referrerPercentage}
                  onChange={(e) => setFormData({ ...formData, referrerPercentage: Number(e.target.value) })}
                  disabled={!editingSettings}
                  className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-xs"
                />
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Referans eden kullanıcıya verilecek yüzde oranı
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Minimum Kazanç (₺)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.minReferralEarning}
                  onChange={(e) => setFormData({ ...formData, minReferralEarning: Number(e.target.value) })}
                  disabled={!editingSettings}
                  className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Maksimum Kazanç (₺) - 0 = Sınırsız
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.maxReferralEarning}
                  onChange={(e) => setFormData({ ...formData, maxReferralEarning: Number(e.target.value) })}
                  disabled={!editingSettings}
                  className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-xs"
                />
              </div>


              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Admin Notları
                </label>
                <textarea
                  value={formData.adminNotes}
                  onChange={(e) => setFormData({ ...formData, adminNotes: e.target.value })}
                  disabled={!editingSettings}
                  rows={3}
                  className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-xs"
                  placeholder="Admin notları..."
                />
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Transactions Section */}
      {activeSection === "transactions" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-slate-900 dark:text-white ">Referans Eden Kullanıcılar</h3>
            <div className="flex gap-2">
              <Button onClick={() => {
                dispatch(fetchReferralTransactionsThunk({}));
                dispatch(fetchReferralStatsThunk());
              }} className="flex items-center gap-2">
                <FiRefreshCw className="w-3 h-3" />
                Yenile
              </Button>
            </div>
          </div>

          <Card className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="text-left p-2 text-base">Referans Eden Kullanıcı</th>
                    <th className="text-left p-2 text-base">Toplam Referans Edilen Sayısı</th>
                    <th className="text-left p-2 text-base">Toplam Kazanç</th>
                    <th className="text-left p-2 text-base">İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    // Referans eden kullanıcıları grupla
                    const referrerGroups = transactions.reduce((acc, transaction) => {
                      const referrerId = transaction.referrer._id;
                      
                      if (!acc[referrerId]) {
                        acc[referrerId] = {
                          referrer: transaction.referrer,
                          referees: new Map(),
                          totalEarnings: 0,
                          totalTransactions: 0,
                          allTransactions: []
                        };
                      }
                      
                      const refereeId = transaction.referee._id;
                      if (!acc[referrerId].referees.has(refereeId)) {
                        acc[referrerId].referees.set(refereeId, {
                          referee: transaction.referee,
                          earnings: 0,
                          transactionCount: 0,
                          transactions: []
                        });
                      }
                      
                      const refereeData = acc[referrerId].referees.get(refereeId);
                      refereeData.earnings += transaction.amount;
                      refereeData.transactionCount += 1;
                      refereeData.transactions.push(transaction);
                      
                      acc[referrerId].totalEarnings += transaction.amount;
                      acc[referrerId].totalTransactions += 1;
                      acc[referrerId].allTransactions.push(transaction);
                      
                      return acc;
                    }, {} as Record<string, any>);

                    return Object.values(referrerGroups).map((referrerData: any) => (
                      <tr key={referrerData.referrer._id} className="border-b border-slate-100 dark:border-slate-800">
                        <td className="p-2">
                          <div>
                            <div className="font-medium text-slate-900 dark:text-white">
                              {referrerData.referrer.name || "İsimsiz"}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">
                              {referrerData.referrer.email}
                            </div>
                            <div className="text-xs text-blue-600 dark:text-blue-400 font-mono">
                              {referrerData.referrer.referralCode}
                            </div>
                          </div>
                        </td>
                        <td className="p-2">
                          <div className="text-xs text-slate-600 dark:text-slate-400">
                            {referrerData.referees.size} farklı kullanıcı
                          </div>
                        </td>
                        <td className="p-2">
                          <div className="font-medium text-slate-900 dark:text-white">
                            {formatCurrency(referrerData.totalEarnings)}
                          </div>
                        </td>
                        <td className="p-2">
                          <Button
                            onClick={() => setSelectedRefereeUsers(referrerData)}
                            className="text-xs"
                            variant="secondary"
                          >
                            Referans Edilenleri Gör
                          </Button>
                        </td>
                      </tr>
                    ));
                  })()}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* Stats Section */}
      {activeSection === "stats" && stats && (
        <div className="space-y-6">
          {/* Ana İstatistik Kartları */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <FiUsers className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="ml-4">
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Toplam Referans</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-white">{stats.totalReferrals}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <FiCheck className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div className="ml-4">
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Tamamlanan</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-white">{stats.completedReferrals}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                  <FiDollarSign className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div className="ml-4">
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Toplam Ödenen</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-white">{formatCurrency(stats.totalPaid)}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <FiRefreshCw className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="ml-4">
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Bekleyen Ödeme</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-white">{formatCurrency(stats.pendingAmount)}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Grafikler */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Referans Durumu Pasta Grafiği */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Referans Durumu</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Tamamlanan', value: stats.completedReferrals, color: '#10b981' },
                        { name: 'Bekleyen', value: stats.totalReferrals - stats.completedReferrals, color: '#f59e0b' }
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {[
                        { name: 'Tamamlanan', value: stats.completedReferrals, color: '#10b981' },
                        { name: 'Bekleyen', value: stats.totalReferrals - stats.completedReferrals, color: '#f59e0b' }
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: any) => [value, 'Referans']}
                      contentStyle={{
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        border: 'none',
                        borderRadius: '8px',
                        color: 'white'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center space-x-6 mt-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm text-slate-600 dark:text-slate-400">Tamamlanan ({stats.completedReferrals})</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                  <span className="text-sm text-slate-600 dark:text-slate-400">Bekleyen ({stats.totalReferrals - stats.completedReferrals})</span>
                </div>
              </div>
            </Card>

            {/* Ödeme Durumu Bar Grafiği */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Ödeme Durumu</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { name: 'Ödenen', amount: stats.totalPaid, color: '#10b981' },
                    { name: 'Bekleyen', amount: stats.pendingAmount, color: '#f59e0b' }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-700" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#64748b', fontSize: 12 }}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#64748b', fontSize: 12 }}
                      tickFormatter={(value) => `₺${value.toLocaleString()}`}
                    />
                    <Tooltip 
                      formatter={(value: any) => [formatCurrency(value), 'Miktar']}
                      contentStyle={{
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        border: 'none',
                        borderRadius: '8px',
                        color: 'white'
                      }}
                    />
                    <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                      {[
                        { name: 'Ödenen', amount: stats.totalPaid, color: '#10b981' },
                        { name: 'Bekleyen', amount: stats.pendingAmount, color: '#f59e0b' }
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          {/* En Başarılı Referans Edenler */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">🏆 En Başarılı Referans Edenler</h3>
            <div className="space-y-3">
              {stats.topReferrers.map((referrer, index) => (
                <div key={referrer.userId} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm text-white ${
                      index === 0 ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' :
                      index === 1 ? 'bg-gradient-to-r from-gray-300 to-gray-400' :
                      index === 2 ? 'bg-gradient-to-r from-orange-400 to-orange-500' :
                      'bg-gradient-to-r from-blue-500 to-blue-600'
                    }`}>
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                    </div>
                    <div className="ml-4">
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {referrer.name || "İsimsiz"}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {referrer.email} • {referrer.referralCode}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-slate-900 dark:text-white text-lg">
                      {referrer.count}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">referans</div>
                    <div className="text-sm font-medium text-green-600 dark:text-green-400 mt-1">
                      {formatCurrency(referrer.totalAmount)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Referans Edilen Kullanıcılar Modal */}
      {selectedRefereeUsers && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-2xl border border-black/10 dark:border-white/10 shadow-sm">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-semibold text-slate-900 dark:text-white">
                    Referans Edilen Kullanıcılar
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    <strong>Referans Eden:</strong> {selectedRefereeUsers.referrer.name || "İsimsiz"} ({selectedRefereeUsers.referrer.email}) • {selectedRefereeUsers.referrer.referralCode}
                  </p>
                </div>
                <Button
                  onClick={() => setSelectedRefereeUsers(null)}
                  variant="secondary"
                >
                  <FiX className="w-3 h-3" />
                </Button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                  <div className="text-base text-slate-600 dark:text-slate-400">Toplam Kazanç</div>
                  <div className="text-base font-bold text-slate-900 dark:text-white">
                    {formatCurrency(selectedRefereeUsers.totalEarnings)}
                  </div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                  <div className="text-base text-slate-600 dark:text-slate-400">Referans Edilen Sayısı</div>
                  <div className="text-base font-bold text-slate-900 dark:text-white">
                    {selectedRefereeUsers.referees.size}
                  </div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                  <div className="text-base text-slate-600 dark:text-slate-400">Toplam İşlem</div>
                  <div className="text-base font-bold text-slate-900 dark:text-white">
                    {selectedRefereeUsers.totalTransactions}
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-700">
                      <th className="text-left p-2">Referans Edilen Kullanıcı</th>
                      <th className="text-left p-2">Toplam Kazanç</th>
                      <th className="text-left p-2">İşlem Sayısı</th>
                      <th className="text-left p-2">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from(selectedRefereeUsers.referees.values()).map((refereeData: any) => (
                      <tr key={refereeData.referee._id} className="border-b border-slate-100 dark:border-slate-800">
                        <td className="p-2">
                          <div>
                            <div className="font-medium text-slate-900 dark:text-white">
                              {refereeData.referee.name || "İsimsiz"}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">
                              {refereeData.referee.email}
                            </div>
                          </div>
                        </td>
                        <td className="p-2">
                          <div className="font-medium text-slate-900 dark:text-white">
                            {formatCurrency(refereeData.earnings)}
                          </div>
                        </td>
                        <td className="p-2">
                          <div className="text-xs text-slate-600 dark:text-slate-400">
                            {refereeData.transactionCount} işlem
                          </div>
                        </td>
                        <td className="p-2">
                          <Button
                            onClick={() => setSelectedUserClicks(refereeData)}
                            className="text-xs"
                            variant="secondary"
                          >
                            Tıklamaları Gör
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User Transactions Detail Modal */}
      {selectedUserTransactions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-2xl border border-black/10 dark:border-white/10 shadow-sm">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-semibold text-slate-900 dark:text-white">
                    Referans Kazanç Detayları
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    <strong>Referans Edilen:</strong> {selectedUserTransactions.referee.name || "İsimsiz"} ({selectedUserTransactions.referee.email})
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    <strong>Referans Eden:</strong> {selectedUserTransactions.referrer.name || "İsimsiz"} ({selectedUserTransactions.referrer.email}) • {selectedUserTransactions.referrer.referralCode}
                  </p>
                </div>
                <Button
                  onClick={() => setSelectedUserTransactions(null)}
                  variant="secondary"
                >
                  <FiX className="w-3 h-3" />
                </Button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                  <div className="text-xs text-slate-600 dark:text-slate-400">Toplam Kazanç</div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    {formatCurrency(selectedUserTransactions.totalEarnings)}
                  </div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                  <div className="text-xs text-slate-600 dark:text-slate-400">İşlem Sayısı</div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    {selectedUserTransactions.transactionCount}
                  </div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                  <div className="text-xs text-slate-600 dark:text-slate-400">Ortalama Kazanç</div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    {formatCurrency(selectedUserTransactions.totalEarnings / selectedUserTransactions.transactionCount)}
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-700">
                      <th className="text-left p-2 text-base">İşlem Türü</th>
                      <th className="text-left p-2 text-base">Kazanç</th>
                      <th className="text-left p-2 text-base">Yüzde</th>
                      <th className="text-left p-2 text-base">Tarih</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedUserTransactions.transactions.map((transaction: any) => (
                      <tr key={transaction._id} className="border-b border-slate-100 dark:border-slate-800">
                        <td className="p-2">
                          <span className="text-xs text-slate-600 dark:text-slate-400">
                            {transaction.action === "registration" ? "Kayıt" : "Tıklama"}
                          </span>
                        </td>
                        <td className="p-2">
                          <div className="font-medium text-slate-900 dark:text-white text-base">
                            {formatCurrency(transaction.amount)}
                          </div>
                        </td>
                        <td className="p-2">
                          <div className="text-xs text-slate-600 dark:text-slate-400">
                            %{transaction.percentage}
                          </div>
                        </td>
                        <td className="p-2">
                          <div className="text-xs text-slate-600 dark:text-slate-400">
                            {formatDate(transaction.createdAt)}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tıklamalar Detay Modal */}
      {selectedUserClicks && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-2xl border border-black/10 dark:border-white/10 shadow-sm">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-semibold text-slate-900 dark:text-white">
                    Referans Tıklamaları
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    <strong>Referans Edilen:</strong> {selectedUserClicks.referee.name || "İsimsiz"} ({selectedUserClicks.referee.email})
                  </p>
                </div>
                <Button
                  onClick={() => setSelectedUserClicks(null)}
                  variant="secondary"
                >
                  <FiX className="w-3 h-3" />
                </Button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                  <div className="text-base text-slate-600 dark:text-slate-400">Toplam Kazanç</div>
                  <div className="text-base font-bold text-slate-900 dark:text-white">
                    {formatCurrency(selectedUserClicks.earnings)}
                  </div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                  <div className="text-base text-slate-600 dark:text-slate-400">İşlem Sayısı</div>
                  <div className="text-base font-bold text-slate-900 dark:text-white">
                    {selectedUserClicks.transactionCount}
                  </div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                  <div className="text-base text-slate-600 dark:text-slate-400">Ortalama Kazanç</div>
                  <div className="text-base font-bold text-slate-900 dark:text-white">
                    {formatCurrency(selectedUserClicks.earnings / selectedUserClicks.transactionCount)}
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-700">
                      <th className="text-left p-2 text-base">İşlem Türü</th>
                      <th className="text-left p-2 text-base">Kazanç</th>
                      <th className="text-left p-2 text-base">Yüzde</th>
                      <th className="text-left p-2 text-base">Tarih</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedUserClicks.transactions.map((transaction: any) => (
                      <tr key={transaction._id} className="border-b border-slate-100 dark:border-slate-800">
                        <td className="p-2">
                          <span className="text-xs text-slate-600 dark:text-slate-400">
                            {transaction.action === "registration" ? "Kayıt" : "Tıklama"}
                          </span>
                        </td>
                        <td className="p-2">
                          <div className="font-medium text-slate-900 dark:text-white text-base">
                            {formatCurrency(transaction.amount)}
                          </div>
                        </td>
                        <td className="p-2">
                          <div className="text-xs text-slate-600 dark:text-slate-400">
                            %{transaction.percentage}
                          </div>
                        </td>
                        <td className="p-2">
                          <div className="text-xs text-slate-600 dark:text-slate-400">
                            {formatDate(transaction.createdAt)}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
