"use client";

import { useState, FormEvent, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { updateProfileThunk, fetchMeThunk, changePasswordThunk } from "@/store/slices/authSlice";
import { Button } from "@/components/ui/Button";
import { FiUser, FiMail, FiCheck, FiLock, FiCreditCard, FiEdit3, FiUsers, FiCopy } from "react-icons/fi";

export default function Settings() {
  const { user, token, status } = useAppSelector((s) => s.auth);
  const dispatch = useAppDispatch();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [profileMsg, setProfileMsg] = useState<string | null>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passMsg, setPassMsg] = useState<string | null>(null);

  // IBAN bilgileri için state'ler
  const [iban, setIban] = useState(user?.iban || "");
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [paymentDescription, setPaymentDescription] = useState(user?.paymentDescription || "");
  const [ibanMsg, setIbanMsg] = useState<string | null>(null);
  const [showIbanForm, setShowIbanForm] = useState(false);

  // Referans kodu için state
  const [referralCopied, setReferralCopied] = useState(false);

  // IBAN bilgilerinin mevcut olup olmadığını kontrol et
  const hasIbanInfo = !!(user?.iban && user?.fullName && user?.paymentDescription);

  // Kullanıcı verileri yoksa yükle
  useEffect(() => {
    if (token && !user) {
      dispatch<any>(fetchMeThunk());
    }
  }, [token, user, dispatch]);

  // Kullanıcı verileri değiştiğinde state'leri güncelle
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setIban(user.iban || "");
      setFullName(user.fullName || "");
      setPaymentDescription(user.paymentDescription || "");
      // IBAN bilgileri varsa formu gizle, yoksa göster
      setShowIbanForm(!hasIbanInfo);
    }
  }, [user, hasIbanInfo]);

  const saveProfile = async (e: FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setProfileMsg(null);
    try {
      await dispatch<any>(updateProfileThunk({ name, email })).unwrap();
      setProfileMsg("Profil güncellendi");
    } catch (e: any) {
      setProfileMsg(e?.message || "Bir hata oluştu");
    }
  };

  const changePassword = async (e: FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setPassMsg(null);
    try {
      await dispatch<any>(changePasswordThunk({ currentPassword, newPassword })).unwrap();
      setPassMsg("Şifre güncellendi");
      setCurrentPassword("");
      setNewPassword("");
    } catch (e: any) {
      setPassMsg(e?.message || "Bir hata oluştu");
    }
  };

  const saveIbanInfo = async (e: FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setIbanMsg(null);
    try {
      await dispatch<any>(updateProfileThunk({ 
        iban: iban.trim(),
        fullName: fullName.trim(),
        paymentDescription: paymentDescription.trim()
      })).unwrap();
      setIbanMsg(hasIbanInfo ? "IBAN bilgileri güncellendi" : "IBAN bilgileri eklendi");
      // Formu kapat
      setShowIbanForm(false);
    } catch (e: any) {
      setIbanMsg(e?.message || "Bir hata oluştu");
    }
  };

  // IBAN formatını kontrol et
  const formatIban = (value: string) => {
    const cleaned = value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    return cleaned.slice(0, 26);
  };

  const handleIbanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIban(formatIban(e.target.value));
  };

  // Referans kodu kopyalama fonksiyonu
  const copyReferralCode = async () => {
    if (user?.referralCode && typeof window !== 'undefined') {
      try {
        await navigator.clipboard.writeText(user.referralCode);
        setReferralCopied(true);
        setTimeout(() => setReferralCopied(false), 2000);
      } catch (err) {
        console.error('Referans kodu kopyalanamadı:', err);
      }
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 dark:text-white">Ayarlar</h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">Hesap bilgilerinizi güncelleyin</p>
        </div>
        <div className="flex sm:hidden items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-white flex items-center justify-center font-semibold shadow-sm text-sm">
            {(user?.name || user?.email || "?")?.slice(0,1).toUpperCase()}
          </div>
          <div className="text-left">
            <div className="text-sm font-semibold text-slate-900 dark:text-white">{user?.name || "Kullanıcı"}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">{user?.email}</div>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-white flex items-center justify-center font-semibold shadow-sm">
            {(user?.name || user?.email || "?")?.slice(0,1).toUpperCase()}
          </div>
          <div className="text-right">
            <div className="text-sm font-semibold text-slate-900 dark:text-white">{user?.name || "Kullanıcı"}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">{user?.email}</div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
        {/* Profile Card */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
          <div className="absolute inset-x-0 -top-24 h-40 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-indigo-500/10 blur-2xl pointer-events-none" />
          <div className="relative p-4 sm:p-6">
            <div className="mb-4 sm:mb-5 flex items-center gap-2 sm:gap-3">
              <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-300 flex items-center justify-center">
                <FiUser className="w-3 h-3 sm:w-4 sm:h-4" />
              </div>
              <h3 className="text-sm sm:text-lg font-semibold text-slate-900 dark:text-white">Profil</h3>
            </div>

            <form onSubmit={saveProfile} className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-[10px] sm:text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 sm:mb-2">Ad Soyad</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-300">
                    <FiUser className="w-3 h-3 sm:w-4 sm:h-4" />
                  </span>
                  <input
                    className="w-full h-9 sm:h-11 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white pl-8 sm:pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Adınız"
                  />
                </div>
                <p className="mt-1 text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">Adınız panelde görüntülenir.</p>
              </div>
              <div>
                <label className="block text-[10px] sm:text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 sm:mb-2">E-posta</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-300">
                    <FiMail className="w-3 h-3 sm:w-4 sm:h-4" />
                  </span>
                  <input
                    type="email"
                    className="w-full h-9 sm:h-11 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white pl-8 sm:pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ornek@email.com"
                  />
                </div>
                <p className="mt-1 text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">E-posta giriş ve bildirimler için kullanılır.</p>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                <Button type="submit" disabled={status === "loading"} className="inline-flex items-center gap-2 text-xs sm:text-sm py-2 sm:py-3">
                  <FiCheck className="w-3 h-3 sm:w-4 sm:h-4" />
                  {status === "loading" ? "Kaydediliyor..." : "Kaydet"}
                </Button>
                {profileMsg && <p className={`text-xs sm:text-sm ${profileMsg.includes("güncellendi") ? "text-green-600" : "text-red-600"}`}>{profileMsg}</p>}
              </div>
            </form>
          </div>
        </div>

        {/* Password Card */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
          <div className="absolute inset-x-0 -top-24 h-40 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 blur-2xl pointer-events-none" />
          <div className="relative p-4 sm:p-6">
            <div className="mb-4 sm:mb-5 flex items-center gap-2 sm:gap-3">
              <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 flex items-center justify-center">
                <FiLock className="w-3 h-3 sm:w-4 sm:h-4" />
              </div>
              <h3 className="text-sm sm:text-lg font-semibold text-slate-900 dark:text-white">Şifre Değiştir</h3>
            </div>

            <form onSubmit={changePassword} className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-[10px] sm:text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 sm:mb-2">Mevcut Şifre</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-300">
                    <FiLock className="w-3 h-3 sm:w-4 sm:h-4" />
                  </span>
                  <input
                    type="password"
                    className="w-full h-9 sm:h-11 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white pl-8 sm:pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs sm:text-sm"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] sm:text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 sm:mb-2">Yeni Şifre</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-300">
                    <FiLock className="w-3 h-3 sm:w-4 sm:h-4" />
                  </span>
                  <input
                    type="password"
                    className="w-full h-9 sm:h-11 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white pl-8 sm:pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs sm:text-sm"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>
                <p className="mt-1 text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">Güçlü bir şifre kullanın (en az 6 karakter).</p>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                <Button type="submit" disabled={status === "loading"} className="inline-flex items-center gap-2 text-xs sm:text-sm py-2 sm:py-3">
                  <FiCheck className="w-3 h-3 sm:w-4 sm:h-4" />
                  {status === "loading" ? "Kaydediliyor..." : "Şifreyi Güncelle"}
                </Button>
                {passMsg && <p className={`text-xs sm:text-sm ${passMsg.includes("güncellendi") ? "text-green-600" : "text-red-600"}`}>{passMsg}</p>}
              </div>
            </form>
          </div>
        </div>

        {/* IBAN Card */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm lg:col-span-2">
          <div className="absolute inset-x-0 -top-24 h-40 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-red-500/10 blur-2xl pointer-events-none" />
          <div className="relative p-4 sm:p-6">
            <div className="mb-4 sm:mb-5 flex items-center gap-2 sm:gap-3">
              <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-300 flex items-center justify-center">
                <FiCreditCard className="w-3 h-3 sm:w-4 sm:h-4" />
              </div>
              <h3 className="text-sm sm:text-lg font-semibold text-slate-900 dark:text-white">Ödeme Bilgileri</h3>
            </div>

            {/* Mevcut IBAN Bilgileri - Sadece göster */}
            {hasIbanInfo && !showIbanForm && (
              <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600">
                <h4 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white mb-2 sm:mb-3">Mevcut IBAN Bilgileri</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 text-xs sm:text-sm">
                  <div>
                    <span className="text-slate-500 dark:text-slate-400">IBAN:</span>
                    <p className="font-mono text-slate-900 dark:text-white mt-1 break-all">{user?.iban}</p>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400">Ad Soyad:</span>
                    <p className="text-slate-900 dark:text-white mt-1">{user?.fullName}</p>
                  </div>
                  <div className="sm:col-span-2 lg:col-span-1">
                    <span className="text-slate-500 dark:text-slate-400">Açıklama:</span>
                    <p className="text-slate-900 dark:text-white mt-1">{user?.paymentDescription}</p>
                  </div>
                </div>
                <div className="mt-3 sm:mt-4">
                  <Button 
                    onClick={() => setShowIbanForm(true)} 
                    className="inline-flex items-center gap-2 text-xs sm:text-sm py-2 sm:py-3"
                  >
                    <FiEdit3 className="w-3 h-3 sm:w-4 sm:h-4" />
                    IBAN Bilgilerini Güncelle
                  </Button>
                </div>
              </div>
            )}

            {/* IBAN Formu - Sadece showIbanForm true olduğunda göster */}
            {showIbanForm && (
              <form onSubmit={saveIbanInfo} className="space-y-3 sm:space-y-4">
              <div className="mb-3 sm:mb-4">
                <h4 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white mb-1 sm:mb-2">
                  {hasIbanInfo ? "IBAN Bilgilerini Güncelle" : "IBAN Bilgilerini Ekle"}
                </h4>
                <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">
                  {hasIbanInfo 
                    ? "Mevcut IBAN bilgilerinizi güncelleyebilirsiniz." 
                    : "Ödeme alabilmek için IBAN bilgilerinizi girin."
                  }
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-[10px] sm:text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 sm:mb-2">
                    IBAN Numarası <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-300">
                      <FiCreditCard className="w-3 h-3 sm:w-4 sm:h-4" />
                    </span>
                    <input
                      className="w-full h-9 sm:h-11 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white pl-8 sm:pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs sm:text-sm font-mono"
                      value={iban}
                      onChange={handleIbanChange}
                      placeholder="TR1234567890123456789012345"
                      maxLength={26}
                    />
                  </div>
                  <p className="mt-1 text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">
                    26 haneli IBAN numaranızı girin (TR ile başlamalı)
                  </p>
                </div>

                <div>
                  <label className="block text-[10px] sm:text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 sm:mb-2">
                    Tam Ad Soyad <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-300">
                      <FiUser className="w-3 h-3 sm:w-4 sm:h-4" />
                    </span>
                    <input
                      className="w-full h-9 sm:h-11 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white pl-8 sm:pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs sm:text-sm"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Ad Soyad"
                    />
                  </div>
                  <p className="mt-1 text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">
                    Para transferi için tam adınız
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-[10px] sm:text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 sm:mb-2">
                  Ödeme Açıklaması <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 sm:top-3 text-slate-400 dark:text-slate-300">
                    <FiEdit3 className="w-3 h-3 sm:w-4 sm:h-4" />
                  </span>
                  <textarea
                    className="w-full h-16 sm:h-20 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white pl-8 sm:pl-10 pr-3 pt-2 sm:pt-3 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs sm:text-sm resize-none"
                    value={paymentDescription}
                    onChange={(e) => setPaymentDescription(e.target.value)}
                    placeholder="Örnek: Kısa link hizmeti faturası"
                    maxLength={100}
                  />
                </div>
                <p className="mt-1 text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">
                  Fatura karşılığı ödeme açıklaması (max 100 karakter)
                </p>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                <Button type="submit" disabled={status === "loading"} className="inline-flex items-center gap-2 text-xs sm:text-sm py-2 sm:py-3">
                  <FiCheck className="w-3 h-3 sm:w-4 sm:h-4" />
                  {status === "loading" ? "Kaydediliyor..." : (hasIbanInfo ? "IBAN Bilgilerini Güncelle" : "IBAN Bilgilerini Ekle")}
                </Button>
                {ibanMsg && <p className={`text-xs sm:text-sm ${ibanMsg.includes("güncellendi") || ibanMsg.includes("eklendi") ? "text-green-600" : "text-red-600"}`}>{ibanMsg}</p>}
              </div>
              </form>
            )}
          </div>
        </div>

        {/* Referans Kodu Card */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm lg:col-span-2">
          <div className="absolute inset-x-0 -top-24 h-40 bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-teal-500/10 blur-2xl pointer-events-none" />
          <div className="relative p-4 sm:p-6">
            <div className="mb-4 sm:mb-5 flex items-center gap-2 sm:gap-3">
              <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg bg-green-500/10 text-green-600 dark:text-green-300 flex items-center justify-center">
                <FiUsers className="w-3 h-3 sm:w-4 sm:h-4" />
              </div>
              <h3 className="text-sm sm:text-lg font-semibold text-slate-900 dark:text-white">Referans Kodu</h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Left: Referral code and stats */}
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-[10px] sm:text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 sm:mb-2">Sizin Referans Kodunuz</label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 relative">
                      <input
                        className="w-full h-9 sm:h-11 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white px-2 sm:px-3 pr-8 sm:pr-10 focus:outline-none focus:ring-2 focus:ring-green-500 text-xs sm:text-sm font-mono text-center"
                        value={user?.referralCode || "Yükleniyor..."}
                        readOnly
                        style={{ textTransform: 'uppercase' }}
                      />
                      <div className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2">
                        <span className="text-[10px] sm:text-xs font-semibold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-1 sm:px-2 py-0.5 sm:py-1 rounded">
                          6 KARAKTER
                        </span>
                      </div>
                    </div>
                    <Button
                      type="button"
                      onClick={copyReferralCode}
                      disabled={!user?.referralCode}
                      className="h-9 sm:h-11 px-3 sm:px-4 bg-green-500 hover:bg-green-600 text-white"
                    >
                      <FiCopy className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                  </div>
                  {referralCopied && (
                    <p className="mt-1 text-[10px] sm:text-xs text-green-600 dark:text-green-400">
                      ✓ Referans kodu kopyalandı!
                    </p>
                  )}
                  <p className="mt-1 text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">
                    Bu kodu arkadaşlarınızla paylaşarak onları davet edebilirsiniz
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-3 sm:pt-4 border-t border-slate-200 dark:border-slate-700">
                  <div className="text-center">
                    <div className="text-lg sm:text-2xl font-bold text-slate-900 dark:text-white">
                      {user?.referralCount || 0}
                    </div>
                    <div className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">
                      Referans Edilen
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg sm:text-2xl font-bold text-slate-900 dark:text-white">
                      {user?.referredBy ? "✓" : "—"}
                    </div>
                    <div className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">
                      Referans Edildi
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg sm:text-2xl font-bold text-green-600 dark:text-green-400">
                      ₺{(user?.referral_earned || 0).toFixed(2)}
                    </div>
                    <div className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">
                      Referans Kazancı
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Info box */}
              <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3 sm:p-4 h-full">
                <h4 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white mb-2">
                  Referans Sistemi Nasıl Çalışır?
                </h4>
                <ul className="text-[10px] sm:text-xs text-slate-600 dark:text-slate-400 space-y-1">
                  <li>• Referans kodunuzu arkadaşlarınızla paylaşın</li>
                  <li>• Onlar kayıt olurken sizin kodunuzu girerler</li>
                  <li>• Her referans için ödül kazanabilirsiniz</li>
                  <li>• Referans sayınızı buradan takip edebilirsiniz</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


