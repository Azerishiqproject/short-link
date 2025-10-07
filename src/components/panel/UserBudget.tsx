"use client";

import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchMeThunk } from "@/store/slices/authSlice";
import { fetchMyPaymentsThunk, createPaymentThunk } from "@/store/slices/paymentsSlice";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useRouter } from "next/navigation";

interface WithdrawalRequest {
  _id: string;
  amount: number;
  status: string;
  createdAt: string;
  iban?: string;
  fullName?: string;
  adminNotes?: string;
}

export default function UserBudget() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user, token } = useAppSelector((s) => s.auth);
  const { myPayments, status } = useAppSelector((s) => s.payments);
  const [showWithdrawalForm, setShowWithdrawalForm] = useState(false);
  const [withdrawalAmount, setWithdrawalAmount] = useState<number>(50);
  const [withdrawalIban, setWithdrawalIban] = useState<string>("");
  const [withdrawalFullName, setWithdrawalFullName] = useState<string>("");
  const [showMinAmountAlert, setShowMinAmountAlert] = useState<boolean>(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>("");

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
    if (!withdrawalAmount || !withdrawalIban || !withdrawalFullName) {
      alert("Lütfen tüm alanları doldurun");
      return;
    }

    if (withdrawalAmount < 50) {
      setShowMinAmountAlert(true);
      setTimeout(() => setShowMinAmountAlert(false), 3000);
      return;
    }

    const availableBalance = (user?.earned_balance || 0) - (user?.reserved_earned_balance || 0);
    if (availableBalance < withdrawalAmount) {
      alert("Yetersiz kullanılabilir kazanç bakiyesi");
      return;
    }

    try {
      await dispatch(createPaymentThunk({
        amount: withdrawalAmount,
        currency: "TRY",
        method: "bank_transfer",
        description: `Çekim isteği - ${withdrawalFullName}`,
        category: "withdrawal",
        audience: "user",
        iban: withdrawalIban,
        fullName: withdrawalFullName
      }));

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
    <div className="space-y-6">
      {/* Başarı Mesajı */}
      {showSuccessAlert && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-3 py-1.5 rounded-lg shadow-lg z-50 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-sm">✅</span>
            <span className="text-sm">{alertMessage}</span>
          </div>
        </div>
      )}

      {/* Minimum Tutar Uyarısı */}
      {showMinAmountAlert && (
        <div className="fixed top-4 right-4 bg-red-500 text-white px-3 py-1.5 rounded-lg shadow-lg z-50 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-sm">⚠️</span>
            <span className="text-sm">Minimum çekim tutarı 50 TL'dir. Kullanılabilir bakiyeniz: ₺{((user?.earned_balance || 0) - (user?.reserved_earned_balance || 0)).toLocaleString()}</span>
          </div>
        </div>
      )}

      {/* Bakiye Kartı */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              ₺{((user?.earned_balance || 0) - (user?.reserved_earned_balance || 0)).toLocaleString()}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">Kullanılabilir Kazanç</p>
            {(user?.reserved_earned_balance || 0) > 0 && (
              <p className="text-xs text-yellow-600 dark:text-yellow-400">
                Rezerve: ₺{(user?.reserved_earned_balance || 0).toLocaleString()}
              </p>
            )}
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-600 dark:text-slate-400">
              Toplam: ₺{(user?.earned_balance || 0).toLocaleString()}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400">
              Tıklama Başına: ₺{Number(process.env.NEXT_PUBLIC_EARNING_PER_CLICK || 0.02).toFixed(2)}
            </div>
          </div>
        </div>
      </Card>

      {/* Çekim Butonu */}
      <div className="flex gap-4">
        <Button 
          onClick={() => {
            if (!user?.iban || !user?.fullName) {
              alert("Çekim yapabilmek için önce ayarlar sayfasından IBAN ve tam ad bilgilerinizi güncelleyin.");
              return;
            }
            const availableBalance = (user?.earned_balance || 0) - (user?.reserved_earned_balance || 0);
            if (availableBalance < 50) {
              setShowMinAmountAlert(true);
              setTimeout(() => setShowMinAmountAlert(false), 3000);
              return;
            }
            setShowWithdrawalForm(true);
          }}
        >
          Para Çek
        </Button>
        
        {(!user?.iban || !user?.fullName) && (
          <Button 
            variant="secondary"
            onClick={() => {
              // URL'de tab parametresi ile ayarlar sayfasına git
              const url = new URL(window.location.href);
              url.searchParams.set('tab', 'settings');
              router.push(url.pathname + url.search);
            }}
          >
            Ayarlara Git
          </Button>
        )}
      </div>

      {/* Çekim Formu */}
      {showWithdrawalForm && (
        <Card className="p-4">
          <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-3">
            Çekim İsteği
          </h3>
          
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Çekim Tutarı (Minimum 50 TL)
              </label>
              <input
                type="number"
                value={withdrawalAmount}
                onChange={(e) => setWithdrawalAmount(Number(e.target.value))}
                min="50"
                step="0.01"
                className="w-full p-2 text-sm border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                placeholder="50"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                IBAN
              </label>
              <input
                type="text"
                value={withdrawalIban}
                onChange={(e) => setWithdrawalIban(e.target.value)}
                className="w-full p-2 text-sm border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                placeholder="TR00 0000 0000 0000 0000 0000 00"
                maxLength={26}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Ad Soyad
              </label>
              <input
                type="text"
                value={withdrawalFullName}
                onChange={(e) => setWithdrawalFullName(e.target.value)}
                className="w-full p-2 text-sm border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                placeholder="Ad Soyad"
                maxLength={100}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleWithdrawal} className="flex-1">
                Çekim İsteği Gönder
              </Button>
              <Button 
                variant="secondary" 
                onClick={() => setShowWithdrawalForm(false)}
                className="flex-1"
              >
                İptal
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Çekim Geçmişi */}
      <div>
        <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-3">
          Çekim Geçmişi
        </h3>
        
        {status === "loading" ? (
          <div className="text-slate-600 dark:text-slate-400">Yükleniyor...</div>
        ) : (
          <div className="space-y-3">
            {userWithdrawals.map((withdrawal) => (
              <Card key={withdrawal._id} className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="font-medium text-slate-900 dark:text-white">
                        ₺{withdrawal.amount.toLocaleString()}
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(withdrawal.status)}`}>
                        {getStatusText(withdrawal.status)}
                      </span>
                    </div>
                    
                    <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                      <div>IBAN: {withdrawal.iban || "Belirtilmemiş"}</div>
                      <div>Ad Soyad: {withdrawal.fullName || "Belirtilmemiş"}</div>
                      <div>Tarih: {new Date(withdrawal.createdAt).toLocaleString()}</div>
                      {withdrawal.adminNotes && (
                        <div className="mt-2 p-2 bg-slate-100 dark:bg-slate-800 rounded text-xs">
                          <strong>Admin Notu:</strong> {withdrawal.adminNotes}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
            
            {userWithdrawals.length === 0 && (
              <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                Henüz çekim isteğiniz bulunmuyor
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}