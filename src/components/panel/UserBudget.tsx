"use client";

import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchMeThunk } from "@/store/slices/authSlice";
import { fetchMyPaymentsThunk, createPaymentThunk } from "@/store/slices/paymentsSlice";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

interface WithdrawalRequest {
  _id: string;
  amount: number;
  status: string;
  createdAt: string;
  iban?: string;
  fullName?: string;
  adminNotes?: string;
}

interface UserBudgetProps {
  onNavigateToSettings?: () => void;
}

export default function UserBudget({ onNavigateToSettings }: UserBudgetProps) {
  const dispatch = useAppDispatch();
  const { user, token } = useAppSelector((s) => s.auth);
  const { myPayments, status } = useAppSelector((s) => s.payments);
  const [showWithdrawalForm, setShowWithdrawalForm] = useState(false);
  const [withdrawalType, setWithdrawalType] = useState<"earned" | "referral">("earned");
  const [withdrawalAmount, setWithdrawalAmount] = useState<number>(50);
  const [withdrawalIban, setWithdrawalIban] = useState<string>("");
  const [withdrawalFullName, setWithdrawalFullName] = useState<string>("");
  const [showMinAmountAlert, setShowMinAmountAlert] = useState<boolean>(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [lastWithdrawalAt, setLastWithdrawalAt] = useState<number>(0);
  const [cooldownMs, setCooldownMs] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (token) {
      dispatch(fetchMyPaymentsThunk());
    }
  }, [token, dispatch]);

  // Kullanıcı verilerinden IBAN ve isim bilgilerini yükle
  useEffect(() => {
    if (user?.iban) {
      setWithdrawalIban(user.iban);
    }
    if (user?.fullName) {
      setWithdrawalFullName(user.fullName);
    }
  }, [user]);

  const handleWithdrawal = async () => {
    // Cooldown guard (10s)
    const now = Date.now();
    if (now - lastWithdrawalAt < 10_000) {
      const remain = Math.ceil((10_000 - (now - lastWithdrawalAt)) / 1000);
      setAlertMessage(`Lütfen ${remain} saniye bekleyin ve tekrar deneyin`);
      setShowMinAmountAlert(true);
      setTimeout(() => setShowMinAmountAlert(false), 2000);
      return;
    }
    if (!withdrawalAmount || !withdrawalIban || !withdrawalFullName) {
      alert("Lütfen tüm alanları doldurun");
      return;
    }

    if (withdrawalAmount < 50) {
      setShowMinAmountAlert(true);
      setTimeout(() => setShowMinAmountAlert(false), 3000);
      return;
    }

    // Bakiye kontrolü - türe göre
    let availableBalance = 0;
    if (withdrawalType === "earned") {
      availableBalance = (user?.earned_balance || 0) - (user?.reserved_earned_balance || 0);
    } else {
      availableBalance = (user?.referral_earned || 0) - (user?.reserved_referral_earned || 0);
    }

    if (availableBalance < withdrawalAmount) {
      const balanceType = withdrawalType === "earned" ? "kazanç" : "referans";
      alert(`Yetersiz kullanılabilir ${balanceType} bakiyesi`);
      return;
    }

    try {
      if (isSubmitting) return; // double-click guard
      setIsSubmitting(true);
      await dispatch(createPaymentThunk({
        amount: withdrawalAmount,
        currency: "TRY",
        method: "bank_transfer",
        description: `${withdrawalType === "earned" ? "Kazanç" : "Referans"} çekim isteği - ${withdrawalFullName}`,
        category: "withdrawal",
        audience: "user",
        iban: withdrawalIban,
        fullName: withdrawalFullName,
        withdrawalType: withdrawalType // Yeni alan
      }));

      // Start 10s cooldown
      const ts = Date.now();
      setLastWithdrawalAt(ts);
      setCooldownMs(10_000);
      const interval = setInterval(() => {
        const remain = 10_000 - (Date.now() - ts);
        setCooldownMs(remain > 0 ? remain : 0);
        if (remain <= 0) clearInterval(interval);
      }, 250);

      setAlertMessage("Çekim isteğiniz alındı. Onay bekleniyor.");
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 4000);
      setShowWithdrawalForm(false);
      setWithdrawalAmount(50);
      setWithdrawalIban("");
      setWithdrawalFullName("");
      dispatch(fetchMeThunk()); // Kullanıcı bilgilerini güncelle
    } catch (error) {
      console.error("Çekim isteği hatası:", error);
      setAlertMessage("Çekim isteği gönderilemedi");
      setShowMinAmountAlert(true);
      setTimeout(() => setShowMinAmountAlert(false), 4000);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Sadece kullanıcı çekimlerini filtrele
  const userWithdrawals = myPayments.filter(p => 
    p.category === "withdrawal" && p.audience === "user"
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "approved": return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "rejected": return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending": return "Bekliyor";
      case "approved": return "Onaylandı";
      case "rejected": return "Reddedildi";
      default: return status;
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Başarı Mesajı */}
      {showSuccessAlert && (
        <div className="fixed top-2 sm:top-4 right-2 sm:right-4 left-2 sm:left-auto bg-green-500 text-white px-3 py-1.5 rounded-lg shadow-lg z-50 text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm">✅</span>
            <span className="text-xs sm:text-sm">{alertMessage}</span>
          </div>
        </div>
      )}

      {/* Minimum Tutar Uyarısı */}
      {showMinAmountAlert && (
        <div className="fixed top-2 sm:top-4 right-2 sm:right-4 left-2 sm:left-auto bg-red-500 text-white px-3 py-1.5 rounded-lg shadow-lg z-50 text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm">⚠️</span>
            <span className="text-xs sm:text-sm">Minimum çekim tutarı 50 TL'dir. Kullanılabilir bakiyeniz: ₺{((user?.earned_balance || 0) - (user?.reserved_earned_balance || 0)).toLocaleString()}</span>
          </div>
        </div>
      )}

      {/* Bakiye Kartları */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {/* Normal Kazanç Kartı */}
        <Card className="p-3 sm:p-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <svg className="w-3 h-3 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
                </svg>
              </div>
              <h3 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">Normal Kazanç</h3>
            </div>
            <div className="space-y-1">
              <h2 className="text-base sm:text-lg lg:text-xl font-bold text-slate-900 dark:text-white">
                ₺{((user?.earned_balance || 0) - (user?.reserved_earned_balance || 0)).toLocaleString()}
              </h2>
              <p className="text-[10px] sm:text-xs text-slate-600 dark:text-slate-400">Kullanılabilir</p>
              {(user?.reserved_earned_balance || 0) > 0 && (
                <p className="text-[10px] sm:text-xs text-yellow-600 dark:text-yellow-400">
                  Rezerve: ₺{(user?.reserved_earned_balance || 0).toLocaleString()}
                </p>
              )}
              <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-500">
                Toplam: ₺{(user?.earned_balance || 0).toLocaleString()}
              </p>
            </div>
          </div>
        </Card>

        {/* Referans Kazancı Kartı */}
        <Card className="p-3 sm:p-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-green-500/10 text-green-600 dark:text-green-400 flex items-center justify-center">
                <svg className="w-3 h-3 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/>
                </svg>
              </div>
              <h3 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">Referans Kazancı</h3>
            </div>
            <div className="space-y-1">
              <h2 className="text-base sm:text-lg lg:text-xl font-bold text-green-600 dark:text-green-400">
                ₺{((user?.referral_earned || 0) - (user?.reserved_referral_earned || 0)).toLocaleString()}
              </h2>
              <p className="text-[10px] sm:text-xs text-slate-600 dark:text-slate-400">Kullanılabilir</p>
              {(user?.reserved_referral_earned || 0) > 0 && (
                <p className="text-[10px] sm:text-xs text-yellow-600 dark:text-yellow-400">
                  Rezerve: ₺{(user?.reserved_referral_earned || 0).toLocaleString()}
                </p>
              )}
              <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-500">
                Toplam: ₺{(user?.referral_earned || 0).toLocaleString()}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Çekim Butonları */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {/* Normal Kazanç Çekim Butonu */}
        <div className="space-y-1 sm:space-y-2">
          <h4 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">Normal Kazanç Çekimi</h4>
          <Button 
            onClick={() => {
              if (!user?.iban || !user?.fullName) {
                onNavigateToSettings?.();
                return;
              }
              const availableBalance = (user?.earned_balance || 0) - (user?.reserved_earned_balance || 0);
              if (availableBalance < 50) {
                setShowMinAmountAlert(true);
                setTimeout(() => setShowMinAmountAlert(false), 3000);
                return;
              }
              setWithdrawalType("earned");
              setShowWithdrawalForm(true);
            }}
            className="w-full text-xs sm:text-sm py-2 sm:py-3"
            disabled={((user?.earned_balance || 0) - (user?.reserved_earned_balance || 0)) < 50 || cooldownMs > 0}
          >
            <span className="truncate">
              {cooldownMs > 0 ? `Bekleyin (${Math.ceil(cooldownMs/1000)}s)` : `Normal Kazanç Çek (${((user?.earned_balance || 0) - (user?.reserved_earned_balance || 0)) >= 50 ? "₺" + ((user?.earned_balance || 0) - (user?.reserved_earned_balance || 0)).toLocaleString() : "Min 50 TL"})`}
            </span>
          </Button>
        </div>

        {/* Referans Kazancı Çekim Butonu */}
        <div className="space-y-1 sm:space-y-2">
          <h4 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">Referans Kazancı Çekimi</h4>
          <Button 
            onClick={() => {
              if (!user?.iban || !user?.fullName) {
                onNavigateToSettings?.();
                return;
              }
              const availableBalance = (user?.referral_earned || 0) - (user?.reserved_referral_earned || 0);
              if (availableBalance < 50) {
                setShowMinAmountAlert(true);
                setTimeout(() => setShowMinAmountAlert(false), 3000);
                return;
              }
              setWithdrawalType("referral");
              setShowWithdrawalForm(true);
            }}
            className="w-full bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm py-2 sm:py-3"
            disabled={((user?.referral_earned || 0) - (user?.reserved_referral_earned || 0)) < 50 || cooldownMs > 0}
          >
            <span className="truncate">
              {cooldownMs > 0 ? `Bekleyin (${Math.ceil(cooldownMs/1000)}s)` : `Referans Kazancı Çek (${((user?.referral_earned || 0) - (user?.reserved_referral_earned || 0)) >= 50 ? "₺" + ((user?.referral_earned || 0) - (user?.reserved_referral_earned || 0)).toLocaleString() : "Min 50 TL"})`}
            </span>
          </Button>
        </div>
      </div>

      {/* IBAN Uyarısı */}
      {(!user?.iban || !user?.fullName) && (
        <div className="mt-3 sm:mt-4 p-3 bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800/50 rounded-lg">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            <div className="flex items-start gap-2">
              <span className="text-yellow-600 dark:text-yellow-400 text-sm sm:text-base">⚠️</span>
              <p className="text-xs sm:text-sm text-yellow-800 dark:text-yellow-200 flex-1">
                Çekim yapabilmek için önce ayarlar sayfasından IBAN ve tam ad bilgilerinizi güncelleyin.
              </p>
            </div>
            <Button 
              variant="secondary"
              onClick={() => {
                onNavigateToSettings?.();
              }}
              className="w-full sm:w-auto text-xs sm:text-sm py-2"
            >
              Ayarlara Git
            </Button>
          </div>
        </div>
      )}

      {/* Çekim Formu */}
      {showWithdrawalForm && (
        <Card className="p-3 sm:p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs sm:text-sm lg:text-base font-semibold text-slate-900 dark:text-white">
              {withdrawalType === "earned" ? "Normal Kazanç" : "Referans Kazancı"} Çekim İsteği
            </h3>
            <button
              onClick={() => setShowWithdrawalForm(false)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 text-lg"
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-3">
            <div>
              <label className="block text-[10px] sm:text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Çekim Tutarı (Minimum 50 TL)
              </label>
              <input
                type="number"
                value={withdrawalAmount}
                onChange={(e) => setWithdrawalAmount(Number(e.target.value))}
                min="50"
                step="0.01"
                max={withdrawalType === "earned" 
                  ? (user?.earned_balance || 0) - (user?.reserved_earned_balance || 0)
                  : (user?.referral_earned || 0) - (user?.reserved_referral_earned || 0)
                }
                className="w-full p-2 text-xs sm:text-sm border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                placeholder="50"
              />
              <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 mt-1">
                Maksimum: ₺{withdrawalType === "earned" 
                  ? ((user?.earned_balance || 0) - (user?.reserved_earned_balance || 0)).toLocaleString()
                  : ((user?.referral_earned || 0) - (user?.reserved_referral_earned || 0)).toLocaleString()
                }
              </p>
            </div>

            <div>
              <label className="block text-[10px] sm:text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                IBAN
              </label>
              <input
                type="text"
                value={withdrawalIban}
                onChange={(e) => setWithdrawalIban(e.target.value)}
                className="w-full p-2 text-xs sm:text-sm border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                placeholder="TR00 0000 0000 0000 0000 0000 00"
                maxLength={26}
              />
            </div>

            <div>
              <label className="block text-[10px] sm:text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Ad Soyad
              </label>
              <input
                type="text"
                value={withdrawalFullName}
                onChange={(e) => setWithdrawalFullName(e.target.value)}
                className="w-full p-2 text-xs sm:text-sm border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                placeholder="Ad Soyad"
                maxLength={100}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <Button onClick={handleWithdrawal} className="flex-1 w-full sm:w-auto text-xs sm:text-sm py-2">
                Çekim İsteği Gönder
              </Button>
              <Button 
                variant="secondary" 
                onClick={() => setShowWithdrawalForm(false)}
                className="flex-1 w-full sm:w-auto text-xs sm:text-sm py-2"
              >
                İptal
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Çekim Geçmişi */}
      <div>
        <h3 className="text-xs sm:text-sm lg:text-base font-semibold text-slate-900 dark:text-white mb-2 sm:mb-3">
          Çekim Geçmişi
        </h3>
        
        {status === "loading" ? (
          <div className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm">Yükleniyor...</div>
        ) : (
          <div className="space-y-2 sm:space-y-3">
            {userWithdrawals.map((withdrawal) => (
              <Card key={withdrawal._id} className="p-2 sm:p-3">
                <div className="flex flex-col gap-2 sm:gap-3">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                    <div className="font-medium text-slate-900 dark:text-white text-sm sm:text-base">
                      ₺{withdrawal.amount.toLocaleString()}
                    </div>
                    <span className={`px-2 py-1 rounded-full text-[10px] sm:text-xs font-medium w-fit ${getStatusColor(withdrawal.status)}`}>
                      {getStatusText(withdrawal.status)}
                    </span>
                  </div>
                  
                  <div className="text-[10px] sm:text-xs text-slate-600 dark:text-slate-400 space-y-1">
                    <div className="break-all">IBAN: {withdrawal.iban || "Belirtilmemiş"}</div>
                    <div>Ad Soyad: {withdrawal.fullName || "Belirtilmemiş"}</div>
                    <div>Tarih: {new Date(withdrawal.createdAt).toLocaleString()}</div>
                    {withdrawal.adminNotes && (
                      <div className="mt-2 p-2 bg-slate-100 dark:bg-slate-800 rounded text-[10px] sm:text-xs">
                        <strong>Admin Notu:</strong> {withdrawal.adminNotes}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
            
            {userWithdrawals.length === 0 && (
              <div className="text-center py-4 sm:py-6 lg:py-8 text-slate-500 dark:text-slate-400 text-xs sm:text-sm">
                Henüz çekim isteğiniz bulunmuyor
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}