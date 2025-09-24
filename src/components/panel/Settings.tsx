"use client";

import { useState, FormEvent } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { Button } from "@/components/ui/Button";
import { FiUser, FiMail, FiCheck, FiLock } from "react-icons/fi";

export default function Settings() {
  const { user, token } = useAppSelector((s) => s.auth);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState<string | null>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [savingPass, setSavingPass] = useState(false);
  const [passMsg, setPassMsg] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050";

  const saveProfile = async (e: FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setProfileMsg(null);
    setSavingProfile(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, email }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Profil güncellenemedi");
      }
      setProfileMsg("Profil güncellendi");
    } catch (e: any) {
      setProfileMsg(e?.message || "Bir hata oluştu");
    } finally {
      setSavingProfile(false);
    }
  };

  const changePassword = async (e: FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setPassMsg(null);
    setSavingPass(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Şifre değiştirilemedi");
      }
      setPassMsg("Şifre güncellendi");
      setCurrentPassword("");
      setNewPassword("");
    } catch (e: any) {
      setPassMsg(e?.message || "Bir hata oluştu");
    } finally {
      setSavingPass(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Ayarlar</h2>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Hesap bilgilerinizi güncelleyin</p>
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Profile Card */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
          <div className="absolute inset-x-0 -top-24 h-40 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-indigo-500/10 blur-2xl" />
          <div className="relative p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-300 flex items-center justify-center">
                <FiUser className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Profil</h3>
            </div>

            <form onSubmit={saveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">Ad Soyad</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-300">
                    <FiUser className="w-4 h-4" />
                  </span>
                  <input
                    className="w-full h-11 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Adınız"
                  />
                </div>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Adınız panelde görüntülenir.</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">E-posta</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-300">
                    <FiMail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    className="w-full h-11 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ornek@email.com"
                  />
                </div>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">E-posta giriş ve bildirimler için kullanılır.</p>
              </div>
              <div className="flex items-center gap-3">
                <Button type="submit" disabled={savingProfile} className="inline-flex items-center gap-2">
                  <FiCheck className="w-4 h-4" />
                  {savingProfile ? "Kaydediliyor..." : "Kaydet"}
                </Button>
                {profileMsg && <p className={`text-sm ${profileMsg.includes("güncellendi") ? "text-green-600" : "text-red-600"}`}>{profileMsg}</p>}
              </div>
            </form>
          </div>
        </div>

        {/* Password Card */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
          <div className="absolute inset-x-0 -top-24 h-40 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 blur-2xl" />
          <div className="relative p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 flex items-center justify-center">
                <FiLock className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Şifre Değiştir</h3>
            </div>

            <form onSubmit={changePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">Mevcut Şifre</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-300">
                    <FiLock className="w-4 h-4" />
                  </span>
                  <input
                    type="password"
                    className="w-full h-11 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">Yeni Şifre</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-300">
                    <FiLock className="w-4 h-4" />
                  </span>
                  <input
                    type="password"
                    className="w-full h-11 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Güçlü bir şifre kullanın (en az 6 karakter).</p>
              </div>
              <div className="flex items-center gap-3">
                <Button type="submit" disabled={savingPass} className="inline-flex items-center gap-2">
                  <FiCheck className="w-4 h-4" />
                  {savingPass ? "Kaydediliyor..." : "Şifreyi Güncelle"}
                </Button>
                {passMsg && <p className={`text-sm ${passMsg.includes("güncellendi") ? "text-green-600" : "text-red-600"}`}>{passMsg}</p>}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}


