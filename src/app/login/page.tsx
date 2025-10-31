"use client";

import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { BlurSpot } from "@/components/ui/BlurSpot";
import { Card } from "@/components/ui/Card";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { loginThunk } from "@/store/slices/authSlice";
import { useRouter } from "next/navigation";
import { verifyRecaptchaThunk } from "@/store/slices/linksSlice";

export default function Login() {
  const dispatch = useAppDispatch();
  const { status, error, token, hydrated, user } = useAppSelector((s) => s.auth);
  const router = useRouter();
  const recaptchaRef = useRef<any>(null);
  const [siteKey, setSiteKey] = useState<string>("");
  const [captchaError, setCaptchaError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCaptchaError(null);
    // Enterprise execute flow
    if (siteKey) {
      try {
        // Ensure script is loaded
        if (!(window as any).grecaptcha) {
          const script = document.createElement("script");
          script.src = `https://www.google.com/recaptcha/enterprise.js?render=${encodeURIComponent(siteKey)}`;
          script.async = true;
          document.head.appendChild(script);
          await new Promise((resolve) => {
            script.onload = resolve as any;
            // small timeout safeguard
            setTimeout(resolve, 1500);
          });
        }
        const token: string = await new Promise((resolve, reject) => {
          try {
            (window as any).grecaptcha.enterprise.ready(async () => {
              try {
                const t = await (window as any).grecaptcha.enterprise.execute(siteKey, { action: "LOGIN" });
                resolve(t);
              } catch (err) {
                reject(err);
              }
            });
          } catch (err) {
            reject(err);
          }
        });
        const verifyRes: any = await dispatch<any>(verifyRecaptchaThunk({ token }));
        if (verifyRes.meta.requestStatus !== "fulfilled") {
          setCaptchaError("Doğrulama başarısız. Lütfen tekrar deneyin.");
          return;
        }
      } catch (_) {
        setCaptchaError("Doğrulama başarısız. Lütfen tekrar deneyin.");
        return;
      }
    }
    dispatch(loginThunk({ email: formData.email, password: formData.password, rememberMe: formData.rememberMe }));
  };

  // no-op: enterprise execute akışı kullanılıyor

  useEffect(() => {
    if (status === "succeeded" && user) {
      // Redirect based on user role
      if (user.role === "admin") {
        router.push("/secret-dashboard");
      } else if (user.role === "advertiser") {
        router.push("/advertiser");
      } else {
        router.push("/panel");
      }
    }
  }, [status, user, router]);

  // If already authenticated, redirect away when hydrated
  useEffect(() => {
    if (!hydrated) return;
    if (token && user) {
      // Redirect based on user role
      if (user.role === "admin") {
        router.replace("/secret-dashboard");
      } else if (user.role === "advertiser") {
        router.replace("/advertiser");
      } else {
        router.replace("/panel");
      }
    }
  }, [hydrated, token, user, router]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  useEffect(() => {
    // Fetch site key from server API (no NEXT_PUBLIC usage)
    (async () => {
      try {
        const res = await fetch("/api/recaptcha-sitekey", { cache: "no-store" });
        const data = await res.json();
        if (res.ok && data?.siteKey) {
          setSiteKey(String(data.siteKey));
        }
      } catch {}
    })();
  }, []);

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 -z-20 bg-gradient-to-b from-[#F8FBFF] via-white to-[#F5F7FB] dark:from-slate-900 dark:via-slate-950 dark:to-slate-900" />
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-40 dark:opacity-20"
        style={{ backgroundImage: "radial-gradient(#e5e7eb 1px, transparent 1px)", backgroundSize: "22px 22px" }}
      />
      <BlurSpot className="-z-10 -top-12 sm:-top-24 -left-12 sm:-left-24" color="#60a5fa" size={320} opacity={0.35} />
      <BlurSpot className="-z-10 top-16 sm:top-32 -right-14 sm:-right-28" color="#a78bfa" size={360} opacity={0.25} />

      <Section className="pt-28 sm:pt-36">
        <div className="mx-auto max-w-md text-center relative">
          <div className="absolute -inset-x-6 -top-16 h-40 animate-gradient blur-3xl rounded-full opacity-20" />
          <h1 className="mt-5 tracking-tight">
            <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 bg-clip-text text-transparent">Giriş Yap</span>
          </h1>
          <p className="mt-3 text-slate-600 dark:text-slate-300">Hesabınıza giriş yapın ve linklerinizi yönetmeye başlayın.</p>
        </div>
      </Section>

      <Section className="py-10">
        <div className="mx-auto max-w-md">
          <Card rounded="2xl" padding="lg" className="shadow-soft bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-black/10 dark:border-white/20">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  E-posta Adresi
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full h-12 text-base rounded-xl border border-black/10 dark:border-white/20 bg-white dark:bg-slate-700 text-slate-900 dark:text-white px-4 shadow-soft focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="ornek@email.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Şifre
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full h-12 text-base rounded-xl border border-black/10 dark:border-white/20 bg-white dark:bg-slate-700 text-slate-900 dark:text-white px-4 shadow-soft focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="••••••••"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 dark:border-slate-600 rounded focus:ring-blue-500 bg-white dark:bg-slate-700"
                  />
                  <span className="ml-2 text-sm text-slate-700 dark:text-slate-300">Beni hatırla</span>
                </label>
                <Link href="/reset-password" className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-300">
                  Şifremi unuttum
                </Link>
              </div>

              <Button type="submit" size="lg" className="w-full" disabled={status === "loading"}>
                {status === "loading" ? "Giriş yapılıyor..." : "Giriş Yap"}
              </Button>
              {captchaError && <div className="text-xs text-red-500 text-center">{captchaError}</div>}
              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50 rounded-lg">
                  <p className="text-red-600 dark:text-red-400 text-sm">
                    {error === "Invalid credentials" 
                      ? "E-posta adresi veya şifre hatalı. Lütfen bilgilerinizi kontrol edin."
                      : error === "User not found"
                      ? "Bu e-posta adresi ile kayıtlı bir hesap bulunamadı."
                      : error === "Invalid password"
                      ? "Şifre hatalı. Lütfen şifrenizi kontrol edin."
                      : error === "Account locked"
                      ? "Hesabınız geçici olarak kilitlenmiştir. Lütfen daha sonra tekrar deneyin."
                      : error === "Email not verified"
                      ? "E-posta adresiniz doğrulanmamış. Lütfen e-postanızı kontrol edin."
                      : "Giriş yapılırken bir hata oluştu. Lütfen tekrar deneyin."
                    }
                  </p>
                </div>
              )}

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-black/10 dark:border-white/20" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400">veya</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button variant="secondary" size="lg" className="w-full" type="button">
                  Google
                </Button>
                <Button variant="secondary" size="lg" className="w-full" type="button">
                  Facebook
                </Button>
              </div>
            </form>
          </Card>

          <div className="mt-6 text-center">
            <p className="text-slate-600 dark:text-slate-300 text-base">
              Hesabınız yok mu?{" "}
              <Link href="/register" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors duration-300">
                Kayıt olun
              </Link>
            </p>
          </div>
        </div>
      </Section>
    </div>
  );
}


