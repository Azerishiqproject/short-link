"use client";

import { useEffect, useState, type FormEvent, Suspense } from "react";
import { useAppDispatch } from "@/store";
import { requestPasswordResetThunk, resetPasswordThunk } from "@/store/slices/authSlice";
export const dynamic = 'force-dynamic';
import { useSearchParams, useRouter } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { BlurSpot } from "@/components/ui/BlurSpot";
import Link from "next/link";

export default function ForgotPassword() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const t = new URLSearchParams(window.location.search).get('token');
      setToken(t);
    }
  }, []);

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [status, setStatus] = useState<"idle" | "loading" | "succeeded" | "failed">("idle");
  const [message, setMessage] = useState("");

  const handleRequest = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const r:any = await dispatch<any>(requestPasswordResetThunk({ email }));
      if (r.meta.requestStatus === 'fulfilled') {
        setStatus("succeeded");
        setMessage("Eğer e-posta kayıtlı ise sıfırlama bağlantısı gönderildi.");
      } else {
        setStatus("failed");
        setMessage(r.payload || "Şifre sıfırlama isteği başarısız oldu.");
      }
    } catch (error: any) {
      setStatus("failed");
      setMessage("Bir hata oluştu. Lütfen daha sonra tekrar deneyin.");
    }
  };

  const handleReset = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    if (!token) {
      setStatus("failed");
      setMessage("Geçersiz bağlantı. Lütfen e-postadaki bağlantıyı kullanın.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setStatus("failed");
      setMessage("Yeni şifreler eşleşmiyor.");
      return;
    }

    try {
      const r:any = await dispatch<any>(resetPasswordThunk({ token, password: newPassword }));
      if (r.meta.requestStatus === 'fulfilled') {
        setStatus("succeeded");
        setMessage("Şifreniz başarıyla sıfırlandı. Giriş sayfasına yönlendiriliyorsunuz...");
        setTimeout(() => router.push("/login"), 1200);
      } else {
        setStatus("failed");
        setMessage(r.payload || "Şifre sıfırlama başarısız oldu. Bağlantı süresi dolmuş olabilir.");
      }
    } catch (error: any) {
      setStatus("failed");
      setMessage("Bir hata oluştu. Lütfen daha sonra tekrar deneyin.");
    }
  };

  const isResetMode = Boolean(token);

  return (
    <Suspense fallback={null}>
    <div className="relative min-h-screen">
      {/* Arka plan katmanları (ana sayfa ile uyumlu) */}
      <div className="absolute inset-0 -z-20 bg-gradient-to-b from-[#F8FBFF] via-white to-[#F5F7FB] dark:from-slate-900 dark:via-slate-950 dark:to-slate-900" />
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-20" style={{backgroundImage:"radial-gradient(#e5e7eb 1px, transparent 1px)", backgroundSize:"24px 24px"}} />
      <div className="pointer-events-none absolute inset-0 -z-10 hidden dark:block opacity-10" style={{backgroundImage:"radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)", backgroundSize:"24px 24px"}} />

      {/* BlurSpots ekleyip ekrandan taşmayacak şekilde kısıtlıyoruz */}
      <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
        <BlurSpot className="absolute -top-20 -left-24" color="#60a5fa" size={360} opacity={0.25} />
        <BlurSpot className="absolute top-24 -right-28" color="#a78bfa" size={420} opacity={0.18} />
      </div>

      {/* Başlık */}
      <Section className="pt-28 sm:pt-36 pb-6">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">{isResetMode ? "Yeni Şifre Belirle" : "Şifre Sıfırla"}</span>
          </h1>
          <p className="mt-3 text-slate-600 dark:text-slate-300 text-sm sm:text-base">
            {isResetMode ? "Yeni şifrenizi belirleyin ve giriş yapın." : "Hesabınıza erişimi geri kazanmak için e‑posta adresinizi girin."}
          </p>
        </div>
      </Section>

      {/* Form Kartı */}
      <Section className="py-6">
        <div className="mx-auto max-w-md">
          <Card rounded="2xl" padding="lg" className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-black/10 dark:border-white/10 shadow-sm">
            {isResetMode ? (
              <form onSubmit={handleReset} className="space-y-5">
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Yeni Şifre</label>
                  <input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="w-full h-12 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-slate-700 text-slate-900 dark:text-white px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Yeni Şifre (Tekrar)</label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full h-12 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-slate-700 text-slate-900 dark:text-white px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="••••••••"
                  />
                </div>

                <Button type="submit" size="lg" className="w-full" disabled={status === "loading"}>
                  {status === "loading" ? "Gönderiliyor..." : "Şifreyi Yenile"}
                </Button>

                {message && (
                  <p className={`text-sm ${status === "failed" ? "text-red-600" : "text-slate-600 dark:text-slate-300"}`}>{message}</p>
                )}

                <div className="text-center text-sm text-slate-600 dark:text-slate-400">
                  <Link href="/login" className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">Giriş yap</Link>
                </div>
              </form>
            ) : (
              status === "succeeded" ? (
                <div className="text-center space-y-4">
                  <div className="mx-auto w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
                  </div>
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Bağlantı Gönderildi</h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Gelen kutunuzu ve spam klasörünü kontrol edin.</p>
                  <div className="pt-1">
                    <Link href="/login" className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">Giriş sayfasına dön</Link>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleRequest} className="space-y-5">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">E‑posta Adresi</label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full h-12 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-slate-700 text-slate-900 dark:text-white px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="ornek@email.com"
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full" disabled={status === "loading"}>
                    {status === "loading" ? "Gönderiliyor..." : "Sıfırlama Bağlantısı Gönder"}
                  </Button>

                  {message && (
                    <p className={`text-sm ${status === "failed" ? "text-red-600" : "text-slate-600 dark:text-slate-300"}`}>{message}</p>
                  )}

                  <div className="text-center text-sm text-slate-600 dark:text-slate-400">
                    <span>Şifrenizi hatırladınız mı? </span>
                    <Link href="/login" className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">Giriş yapın</Link>
                  </div>
                </form>
              )
            )}
          </Card>
        </div>
      </Section>
    </div>
    </Suspense>
  );
}


