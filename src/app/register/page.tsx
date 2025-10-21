"use client";

import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { BlurSpot } from "@/components/ui/BlurSpot";
import { Card } from "@/components/ui/Card";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { registerThunk } from "@/store/slices/authSlice";
import { useRouter } from "next/navigation";

export default function Register() {
  const dispatch = useAppDispatch();
  const { status, error, user } = useAppSelector((s) => s.auth);
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: "user" as "user" | "advertiser",
    referralCode: "",
    acceptTerms: false,
    acceptMarketing: false
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = "Lütfen adınızı girin";
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = "Ad en az 2 karakter olmalıdır";
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Lütfen soyadınızı girin";
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = "Soyad en az 2 karakter olmalıdır";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Lütfen e-posta adresinizi girin";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Geçerli bir e-posta adresi girin (örn: ornek@email.com)";
    }
    
    if (!formData.password) {
      newErrors.password = "Lütfen şifrenizi girin";
    } else if (formData.password.length < 8) {
      newErrors.password = "Şifre en az 8 karakter olmalıdır";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = "Şifre en az bir büyük harf, bir küçük harf ve bir rakam içermelidir";
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Lütfen şifrenizi tekrar girin";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Şifreler eşleşmiyor. Lütfen aynı şifreyi girin";
    }
    
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = "Devam edebilmek için kullanım koşullarını kabul etmelisiniz";
    }
    
    // Referans kodu kontrolü (opsiyonel)
    if (formData.referralCode && formData.referralCode.length !== 6) {
      newErrors.referralCode = "Referans kodu 6 karakter olmalıdır";
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      dispatch(registerThunk({
        email: formData.email,
        password: formData.password,
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        role: formData.userType,
        referralCode: formData.referralCode || undefined,
      }));
    }
  };

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    // Referans kodu için özel işlem
    if (name === 'referralCode') {
      const upperValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
      setFormData(prev => ({
        ...prev,
        [name]: upperValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Arka plan katmanları */}
      <div className="absolute inset-0 -z-20 bg-gradient-to-b from-[#F8FBFF] via-white to-[#F5F7FB] dark:from-slate-900 dark:via-slate-950 dark:to-slate-900" />
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-40 dark:opacity-20" style={{backgroundImage:"radial-gradient(#e5e7eb 1px, transparent 1px)", backgroundSize:"22px 22px"}} />
      <BlurSpot className="-z-10 -top-12 sm:-top-24 -left-12 sm:-left-24" color="#60a5fa" size={320} opacity={0.35} />
      <BlurSpot className="-z-10 top-16 sm:top-32 -right-14 sm:-right-28" color="#a78bfa" size={360} opacity={0.25} />

      {/* HERO */}
      <Section className="pt-28 sm:pt-36">
        <div className="mx-auto max-w-md text-center relative">
          <div className="absolute -inset-x-6 -top-16 h-40 animate-gradient blur-3xl rounded-full opacity-20" />
          <h1 className="mt-5 tracking-tight">
            <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 bg-clip-text text-transparent">Kayıt Ol</span>
          </h1>
          <p className="mt-3 text-slate-600 dark:text-slate-300">
            Ücretsiz hesap oluşturun ve linklerinizi yönetmeye başlayın.
          </p>
        </div>
      </Section>

      {/* Register Form */}
      <Section className="py-10">
        <div className="mx-auto max-w-md">
          <Card rounded="2xl" padding="lg" className="shadow-soft bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-black/10 dark:border-white/20">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Ad
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`w-full h-12 rounded-xl text-base border px-4 shadow-soft focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white dark:bg-slate-700 text-slate-900 dark:text-white ${
                      errors.firstName ? 'border-red-500' : 'border-black/10 dark:border-white/20'
                    }`}
                    placeholder="Adınız"
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Soyad
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`w-full h-12 rounded-xl text-base border px-4 shadow-soft focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white dark:bg-slate-700 text-slate-900 dark:text-white ${
                      errors.lastName ? 'border-red-500' : 'border-black/10 dark:border-white/20'
                    }`}
                    placeholder="Soyadınız"
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
                  )}
                </div>
              </div>

              {/* Email */}
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
                  className={`w-full h-12 rounded-xl text-base border px-4 shadow-soft focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white dark:bg-slate-700 text-slate-900 dark:text-white ${
                    errors.email ? 'border-red-500' : 'border-black/10 dark:border-white/20'
                  }`}
                  placeholder="ornek@email.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              {/* Referral Code */}
              <div>
                <label htmlFor="referralCode" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Referans Kodu <span className="text-slate-400 text-xs">(Opsiyonel)</span>
                </label>
                <input
                  type="text"
                  id="referralCode"
                  name="referralCode"
                  value={formData.referralCode}
                  onChange={handleChange}
                  className={`w-full h-12 rounded-xl text-base border px-4 shadow-soft focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white dark:bg-slate-700 text-slate-900 dark:text-white ${
                    errors.referralCode ? 'border-red-500' : 'border-black/10 dark:border-white/20'
                  }`}
                  placeholder="ABC123"
                  maxLength={6}
                  style={{ textTransform: 'uppercase' }}
                />
                {errors.referralCode && (
                  <p className="mt-1 text-sm text-red-500">{errors.referralCode}</p>
                )}
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Bir arkadaşınızın referans kodunu girerek kayıt olabilirsiniz
                </p>
              </div>

              {/* User Type */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                  Hesap Türü
                </label>
                <div className="grid grid-cols-1 gap-4">
                  {/* Görev Yapan */}
                  <label
                    className={`relative overflow-hidden flex items-center justify-center p-5 rounded-2xl border transition-all duration-200 cursor-pointer shadow-sm backdrop-blur ${
                      formData.userType === "user"
                        ? "border-blue-500/60 ring-2 ring-blue-500 ring-offset-2 ring-offset-white dark:ring-offset-slate-900 bg-gradient-to-br from-blue-500/10 to-indigo-500/10"
                        : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white/60 dark:bg-slate-800/60"
                    }`}
                  >
                    <input
                      type="radio"
                      name="userType"
                      value="user"
                      checked={formData.userType === "user"}
                      onChange={handleChange}
                      className="sr-only"
                    />

                    {/* Accent dot */}
                    <span className="absolute left-3 top-3 w-2.5 h-2.5 rounded-full bg-blue-500/80" />

                    {/* Checkmark */}
                    {formData.userType === "user" && (
                      <span className="absolute right-3 top-3 text-blue-600 dark:text-blue-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
                      </span>
                    )}

                    <div className="text-center">
                      <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div className="text-base font-semibold text-slate-900 dark:text-white">Görev Yapan</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">Link kısaltma</div>
                    </div>

                    {/* Glow */}
                    {formData.userType === "user" && (
                      <span className="pointer-events-none absolute -inset-10 bg-blue-500/10 blur-2xl" />
                    )}
                  </label>

                  {/* Reklam Veren - Geçici olarak kaldırıldı */}
                  {/* <label
                    className={`relative overflow-hidden flex items-center justify-center p-5 rounded-2xl border transition-all duration-200 cursor-pointer shadow-sm backdrop-blur ${
                      formData.userType === "advertiser"
                        ? "border-purple-500/60 ring-2 ring-purple-500 ring-offset-2 ring-offset-white dark:ring-offset-slate-900 bg-gradient-to-br from-purple-500/10 to-fuchsia-500/10"
                        : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white/60 dark:bg-slate-800/60"
                    }`}
                  >
                    <input
                      type="radio"
                      name="userType"
                      value="advertiser"
                      checked={formData.userType === "advertiser"}
                      onChange={handleChange}
                      className="sr-only"
                    />

                    <span className="absolute left-3 top-3 w-2.5 h-2.5 rounded-full bg-purple-500/80" />

                    {formData.userType === "advertiser" && (
                      <span className="absolute right-3 top-3 text-purple-600 dark:text-purple-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
                      </span>
                    )}

                    <div className="text-center">
                      <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <div className="text-base font-semibold text-slate-900 dark:text-white">Reklam Veren</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">Kampanya yönetimi</div>
                    </div>

                    {formData.userType === "advertiser" && (
                      <span className="pointer-events-none absolute -inset-10 bg-purple-500/10 blur-2xl" />
                    )}
                  </label> */}
                </div>
              </div>

              {/* Password */}
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
                  className={`w-full h-12 rounded-xl text-base border px-4 shadow-soft focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white dark:bg-slate-700 text-slate-900 dark:text-white ${
                    errors.password ? 'border-red-500' : 'border-black/10 dark:border-white/20'
                  }`}
                  placeholder="En az 8 karakter (büyük harf, küçük harf, rakam)"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Şifre Tekrar
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full h-12 rounded-xl border px-4 text-base shadow-soft focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white dark:bg-slate-700 text-slate-900 dark:text-white ${
                    errors.confirmPassword ? 'border-red-500' : 'border-black/10 dark:border-white/20'
                  }`}
                  placeholder="Şifrenizi tekrar girin"
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Checkboxes */}
              <div className="space-y-4">
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    name="acceptTerms"
                    checked={formData.acceptTerms}
                    onChange={handleChange}
                    className={`w-4 h-4 text-blue-600 text-base border-gray-300 dark:border-slate-600 rounded focus:ring-blue-500 mt-1 bg-white dark:bg-slate-700 ${
                      errors.acceptTerms ? 'border-red-500' : ''
                    }`}
                  />
                  <span className="ml-2 text-sm text-base text-slate-700 dark:text-slate-300">
                    <Link href="/kullanim-kosullari" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                      Kullanım Koşulları
                    </Link>{" "}
                    ve{" "}
                    <Link href="/gizlilik" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                      Gizlilik Politikası
                    </Link>{" "}
                    nı okudum ve kabul ediyorum.
                  </span>
                </label>
                {errors.acceptTerms && (
                  <p className="text-sm text-red-500">{errors.acceptTerms}</p>
                )}

                <label className="flex items-start">
                  <input
                    type="checkbox"
                    name="acceptMarketing"
                    checked={formData.acceptMarketing}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600 text-base border-gray-300 dark:border-slate-600 rounded focus:ring-blue-500 mt-1 bg-white dark:bg-slate-700"
                  />
                  <span className="ml-2 text-sm text-slate-700 dark:text-slate-300">
                    Pazarlama e-postaları ve güncellemeler hakkında bilgi almak istiyorum.
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <Button type="submit" size="lg" className="w-full">
                {status === "loading" ? "Hesap oluşturuluyor..." : "Hesap Oluştur"}
              </Button>
              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50 rounded-lg">
                  <p className="text-red-600 dark:text-red-400 text-sm">
                    {error === "Email already exists" 
                      ? "Bu e-posta adresi zaten kullanılıyor. Farklı bir e-posta adresi deneyin veya giriş yapın."
                      : error === "Invalid email format"
                      ? "Geçersiz e-posta formatı. Lütfen doğru formatta bir e-posta adresi girin."
                      : error === "Password too weak"
                      ? "Şifre çok zayıf. Lütfen daha güçlü bir şifre seçin."
                      : error === "Registration failed"
                      ? "Kayıt işlemi başarısız oldu. Lütfen tekrar deneyin."
                      : error === "Server error"
                      ? "Sunucu hatası oluştu. Lütfen daha sonra tekrar deneyin."
                      : error === "Geçersiz referans kodu"
                      ? "Girdiğiniz referans kodu geçersiz. Lütfen doğru kodu girin veya boş bırakın."
                      : "Hesap oluşturulurken bir hata oluştu. Lütfen tekrar deneyin."
                    }
                  </p>
                </div>
              )}

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-black/10 dark:border-white/20" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400">veya</span>
                </div>
              </div>

              {/* Social Register */}
              <div className="grid grid-cols-2 gap-3">
                <Button variant="secondary" size="lg" className="w-full">
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google
                </Button>
                <Button variant="secondary" size="lg" className="w-full">
                  <svg className="w-5 h-5 mr-2" fill="#1877F2" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Facebook
                </Button>
              </div>
            </form>
          </Card>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-slate-600 dark:text-slate-300 text-base">
              Zaten hesabınız var mı?{" "}
              <Link 
                href="/login" 
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors duration-300"
              >
                Giriş yapın
              </Link>
            </p>
          </div>
        </div>
      </Section>
    </div>
  );
}