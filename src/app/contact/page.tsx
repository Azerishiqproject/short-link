"use client";
import React, { useState } from "react";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { BlurSpot } from "@/components/ui/BlurSpot";
import { motion, MotionConfig } from "framer-motion";
import { Mail, Phone, MapPin, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store";
import { submitContactFormThunk } from "@/store/slices/contactSlice";

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
  hidden: { opacity: 0, y: 18, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45 } }
};

export default function ContactPage() {
  const dispatch = useAppDispatch();
  const { status, error } = useAppSelector((s) => s.contact);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await dispatch(submitContactFormThunk(formData));
    
    if (submitContactFormThunk.fulfilled.match(result)) {
      setFormData({ name: "", email: "", subject: "", message: "" });
    }
  };

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
        <Section className="pt-24 sm:pt-28 pb-12 sm:pb-16 overflow-x-hidden">
          <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <BlurSpot className="absolute left-4 sm:left-8 top-8 hidden sm:block" color="#60a5fa" size={160} opacity={0.18} />
              <BlurSpot className="absolute right-6 top-[240px] hidden md:block" color="#a78bfa" size={200} opacity={0.16} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <motion.div
                variants={slideLeft}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
                className="text-center lg:text-left space-y-5"
              >
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-200/70 dark:border-blue-500/30 text-xs sm:text-sm">İletişim</span>
                <motion.h1 variants={rise} className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-200 bg-clip-text text-transparent">Bizimle iletişime geçin</motion.h1>
                <motion.p variants={rise} className="mx-auto lg:mx-0 max-w-2xl text-slate-600 dark:text-slate-300 text-base sm:text-lg">Sorularınız, önerileriniz veya destek talepleriniz için formu doldurun ya da aşağıdaki kanallardan bize ulaşın.</motion.p>
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                  <motion.div className="w-full sm:w-auto" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                    <Button size="lg" className="w-full sm:w-auto">Destek Talebi Oluştur</Button>
                  </motion.div>
                  <motion.div className="w-full sm:w-auto" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                    <Button variant="secondary" size="lg" className="w-full sm:w-auto">SSS'yi Gör</Button>
                  </motion.div>
                </div>
              </motion.div>

              {/* Contact Form */}
              <motion.div
                variants={slideRight}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
                className="relative mx-auto w-full max-w-xl"
              >
                <div className="absolute -inset-6 sm:-inset-10 bg-gradient-to-tr from-blue-500/25 via-fuchsia-500/20 to-pink-500/25 blur-3xl" />
                <form onSubmit={handleSubmit} className="relative rounded-2xl border border-slate-200/80 dark:border-slate-800/80 overflow-hidden shadow-2xl bg-white/70 dark:bg-slate-900/60 backdrop-blur p-5 sm:p-6 space-y-4 will-change-transform">
                  {status === "succeeded" && (
                    <div className="rounded-lg p-3 flex items-center gap-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm">Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.</span>
                    </div>
                  )}
                  {error && (
                    <div className="rounded-lg p-3 flex items-center gap-2 bg-red-500/10 text-red-600 dark:text-red-400">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm">{error}</span>
                    </div>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-muted" htmlFor="name">Ad Soyad</label>
                      <input 
                        id="name" 
                        name="name" 
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/60 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/40" 
                        placeholder="Adınız" 
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted" htmlFor="email">E-posta</label>
                      <input 
                        id="email" 
                        name="email" 
                        type="email" 
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/60 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/40" 
                        placeholder="ornek@mail.com" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-muted" htmlFor="subject">Konu</label>
                    <input 
                      id="subject" 
                      name="subject" 
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/60 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/40" 
                      placeholder="Kısa açıklama" 
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted" htmlFor="message">Mesaj</label>
                    <textarea 
                      id="message" 
                      name="message" 
                      rows={5} 
                      value={formData.message}
                      onChange={handleChange}
                      required
                      className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/60 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/40" 
                      placeholder="Mesajınızı yazın..." 
                    />
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="text-[11px] text-muted">Yanıt süresi: 24 saat içinde</span>
                    <Button type="submit" disabled={status === "loading"} className="w-full sm:w-auto">
                      {status === "loading" ? "Gönderiliyor..." : "Gönder"}
                    </Button>
                  </div>
                </form>
              </motion.div>
            </div>
          </div>
        </Section>

        {/* Contact Info */}
        <Section className="py-10 sm:py-16">
          <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
              <BlurSpot className="absolute -left-8 top-10" color="#93c5fd" size={160} opacity={0.16} />
              <BlurSpot className="absolute right-0 bottom-0" color="#a78bfa" size={160} opacity={0.14} />
            </div>
            <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.25 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {[
                { title: "E-posta", desc: "destek@kisa.link", Icon: Mail },
                { title: "Telefon", desc: "+90 555 000 00 00", Icon: Phone },
                { title: "Adres", desc: "İstanbul, Türkiye", Icon: MapPin },
                { title: "Çalışma Saatleri", desc: "Hafta içi 09:00–18:00", Icon: Clock }
              ].map((c) => {
                const Icon = c.Icon;
                return (
                  <motion.div key={c.title} variants={cardItem} whileHover={{ y: -4, scale: 1.01 }} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/70 backdrop-blur p-5">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white flex items-center justify-center">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold">{c.title}</div>
                        <div className="text-xs text-muted mt-1">{c.desc}</div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </Section>

        {/* Map */}
        <Section className="py-10 sm:py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur p-4">
              <div className="aspect-[16/9] w-full overflow-hidden rounded-xl">
                <iframe
                  title="Google Maps - İstanbul"
                  className="w-full h-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12035.188106207432!2d28.9746634!3d41.0082376!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab9b2b0b2c6ad%3A0x2d0c99f0a8a1d!2zSXN0YW5idWw!5e0!3m2!1str!2str!4v1699999999999"
                  allowFullScreen
                />
              </div>
            </motion.div>
          </div>
        </Section>

        {/* FAQ */}
        <Section className="py-10 sm:py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <motion.div variants={rise} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Sık Sorulan Sorular</h2>
              <p className="mt-2 text-muted">Hızlıca yanıtladığımız konular</p>
            </motion.div>
            <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {[
                { q: "Yanıt süreniz nedir?", a: "Genellikle 24 saat içinde dönüş yapıyoruz." },
                { q: "Kurumsal destek var mı?", a: "Evet, SLA içeren kurumsal destek paketlerimiz mevcut." },
                { q: "Veri gizliliği?", a: "KVKK ve GDPR prensiplerine uygun olarak çalışıyoruz." },
                { q: "Entegrasyonlar?", a: "Zapier, Google Analytics, Facebook vb. ile uyumluyuz." }
              ].map((f) => (
                <motion.div key={f.q} variants={cardItem} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/70 backdrop-blur p-5">
                  <div className="text-sm font-semibold">{f.q}</div>
                  <div className="text-xs text-muted mt-1">{f.a}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </Section>
      </motion.div>
    </MotionConfig>
  );
}


