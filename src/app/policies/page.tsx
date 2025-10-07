"use client";
import React from "react";
import { Section } from "@/components/ui/Section";
import { BlurSpot } from "@/components/ui/BlurSpot";
import { motion, MotionConfig } from "framer-motion";

const slideLeft = {
  hidden: { opacity: 0, x: -100 },
  show: { opacity: 1, x: 0, transition: { duration: 0.6 } }
};

const slideRight = {
  hidden: { opacity: 0, x: 100 },
  show: { opacity: 1, x: 0, transition: { duration: 0.6 } }
};

const rise = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.06 }
  }
};

const cardItem = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45 } }
};

export default function PoliciesPage() {
  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        className="relative overflow-x-hidden will-change-transform"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Background */}
        <div className="absolute inset-0 -z-20 bg-gradient-to-b from-[#F8FBFF] via-white to-[#F5F7FB] dark:from-slate-900 dark:via-slate-950 dark:to-slate-900" />
        <div className="pointer-events-none absolute inset-0 -z-10 opacity-20" style={{backgroundImage:"radial-gradient(#e5e7eb 1px, transparent 1px)", backgroundSize:"24px 24px"}} />
        <div className="pointer-events-none absolute inset-0 -z-10 hidden dark:block opacity-12" style={{backgroundImage:"radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)", backgroundSize:"24px 24px"}} />

        {/* Hero */}
        <Section className="pt-24 sm:pt-28 pb-10 sm:pb-14">
          <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <BlurSpot className="absolute left-4 sm:left-8 top-8 hidden sm:block" color="#60a5fa" size={160} opacity={0.18} />
              <BlurSpot className="absolute right-6 top-[240px] hidden md:block" color="#a78bfa" size={200} opacity={0.16} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <motion.div variants={slideLeft} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} className="text-center lg:text-left space-y-5">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-200/70 dark:border-blue-500/30 text-xs sm:text-sm">Politikalar</span>
                <motion.h1 variants={rise} className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-200 bg-clip-text text-transparent">Gizlilik, Kullanım Şartları ve Çerez Politikası</motion.h1>
                <motion.p variants={rise} className="mx-auto lg:mx-0 max-w-2xl text-slate-600 dark:text-slate-300 text-base sm:text-lg">Şeffaflık ilkesiyle, verilerinizi nasıl işlediğimizi ve hizmetlerimizi kullanırken hangi kurallara tabi olduğunuzu açıkça paylaşıyoruz.</motion.p>
              </motion.div>
              <motion.div variants={slideRight} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} className="relative mx-auto w-full max-w-xl">
                <div className="absolute -inset-6 sm:-inset-10 bg-gradient-to-tr from-blue-500/25 via-fuchsia-500/20 to-pink-500/25 blur-3xl" />
                <div className="relative rounded-2xl border border-slate-200/80 dark:border-slate-800/80 overflow-hidden shadow-2xl bg-white/70 dark:bg-slate-900/60 backdrop-blur p-5 sm:p-6">
                  <div className="text-sm text-muted">Son güncelleme: 24 Eylül 2025</div>
                  <ul className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-300">
                    <li>• Gizlilik: Verilerinizi KVKK ve GDPR ilkelerine uygun işleriz.</li>
                    <li>• Kullanım: Hizmetleri kötüye kullanım, spam ve dolandırıcılık yasaktır.</li>
                    <li>• Çerezler: Deneyimi iyileştirmek için gerekli ve analitik çerezler kullanılır.</li>
                  </ul>
                </div>
              </motion.div>
            </div>
          </div>
        </Section>

        {/* Policies Content */}
        <Section className="py-8 sm:py-12">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="space-y-8 sm:space-y-10">
              {/* Privacy */}
              <motion.div variants={cardItem} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/70 backdrop-blur p-5 sm:p-6">
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Gizlilik Politikası</h2>
                <p className="mt-2 text-sm text-muted">Hangi verileri topladığımız, hangi amaçlarla işlediğimiz ve haklarınız.</p>
                <div className="mt-4 space-y-2 text-sm text-slate-700 dark:text-slate-300">
                  <p>• Hesap bilgileri, kullanım verileri ve cihaz/konum bazlı istatistikler toplanabilir.</p>
                  <p>• Yasal yükümlülükler ve hizmetin işletilmesi için gerekli süre boyunca saklanır.</p>
                  <p>• Verilerinize erişim, düzeltme, silme ve itiraz haklarına sahipsiniz.</p>
                </div>
              </motion.div>

              {/* Terms */}
              <motion.div variants={cardItem} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/70 backdrop-blur p-5 sm:p-6">
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Kullanım Şartları</h2>
                <p className="mt-2 text-sm text-muted">Hizmet kullanım kuralları ve kullanıcı sorumlulukları.</p>
                <div className="mt-4 space-y-2 text-sm text-slate-700 dark:text-slate-300">
                  <p>• Spam, zararlı yazılım dağıtımı ve yasa dışı içerik yasaktır.</p>
                  <p>• Hesap güvenliği kullanıcının sorumluluğundadır; şüpheli faaliyetler kısıtlanabilir.</p>
                  <p>• Hizmette değişiklik yapma ve erişimi askıya alma hakkımız saklıdır.</p>
                </div>
              </motion.div>

              {/* Cookies */}
              <motion.div variants={cardItem} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/70 backdrop-blur p-5 sm:p-6">
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Çerez Politikası</h2>
                <p className="mt-2 text-sm text-muted">Çerez türleri, amaçları ve tercihleriniz.</p>
                <div className="mt-4 space-y-2 text-sm text-slate-700 dark:text-slate-300">
                  <p>• Zorunlu çerezler oturum yönetimi için gereklidir.</p>
                  <p>• Analitik çerezler performans ve kullanım analizi sağlar.</p>
                  <p>• Tarayıcı ayarları veya tercih yönetim aracıyla çerezleri kontrol edebilirsiniz.</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </Section>

        {/* Last Updated */}
        <Section className="py-6 sm:py-8">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }} className="text-center text-xs text-muted">
              Bu sayfa bilgilendirme amaçlıdır. Güncel metinler, kayıt sırasında sunulan yasal belgelerde yer alır.
            </motion.div>
          </div>
        </Section>
      </motion.div>
    </MotionConfig>
  );
}









