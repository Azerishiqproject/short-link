"use client";
import React from "react";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { BlurSpot } from "@/components/ui/BlurSpot";
import { motion, MotionConfig } from "framer-motion";
import Image from "next/image";
import { FaTwitter, FaLinkedin, FaGithub, FaShieldAlt, FaBolt, FaUsers, FaHeart } from "react-icons/fa";
import Testimonials from "@/components/ui/Testimonials";

function useCountUp(target: number, durationMs = 1200) {
  const [value, setValue] = React.useState(0);
  React.useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = () => {
      const now = performance.now();
      const p = Math.min(1, (now - start) / durationMs);
      setValue(Math.floor(target * p));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, durationMs]);
  return value;
}

// Motion variants
const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.08 }
  }
};

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

const pop = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
};

// Values (Değerlerimiz) section variants - springy staggered pop-in with slight tilt
const valuesStagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.04 }
  }
};

const valuesItem = {
  hidden: { opacity: 0, y: 20, scale: 0.98, rotate: -1.5 },
  show: {
    opacity: 1, y: 0, scale: 1, rotate: 0,
    transition: { duration: 0.45 }
  }
};

export default function AboutPage() {
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
      <Section className="pt-24 sm:pt-28 pb-14 sm:pb-20 overflow-x-hidden">
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
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-200/70 dark:border-blue-500/30 text-xs sm:text-sm">Hakkımızda</span>
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-200 bg-clip-text text-transparent">Uzun linkleri akıllı bağlantılara dönüştürüyoruz</h1>
              <motion.p
                variants={rise}
                className="mx-auto lg:mx-0 max-w-2xl text-slate-600 dark:text-slate-300 text-base sm:text-lg"
              >
                Amacımız; içerik üreticileri ve işletmelerin bağlantılarını ölçülebilir, hızlı ve güvenli bir şekilde yönetmelerini sağlamak. Gizlilik odaklı mimari ve güçlü analitik ile.
              </motion.p>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                <motion.div className="w-full sm:w-auto" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                  <Button size="lg" className="w-full sm:w-auto">Hemen Başla</Button>
                </motion.div>
                <motion.div className="w-full sm:w-auto" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto">İletişime Geç</Button>
                </motion.div>
              </div>
            </motion.div>
            <motion.div
              variants={slideRight}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              className="relative mx-auto w-full max-w-md"
            >
              <div className="absolute -inset-6 sm:-inset-10 bg-gradient-to-tr from-blue-500/25 via-fuchsia-500/20 to-pink-500/25 blur-3xl" />
              <div className="relative rounded-[24px] border border-slate-200/80 dark:border-slate-800/80 overflow-hidden shadow-2xl bg-white/70 dark:bg-slate-900/60 backdrop-blur">
                <div className="absolute top-3 left-3 right-3 h-8 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 opacity-90" />
                <div className="p-4 sm:p-5 pt-12 sm:pt-14">
                  <div className="transform scale-[0.92] sm:scale-100 origin-top">
                    <Image src="/illustrations/hero.svg" alt="s.link hero" width={1200} height={800} className="w-full h-auto object-cover rounded-2xl" />
                    <div className="mt-3 grid grid-cols-3 gap-2">
                    {[
                      {t:"Görüntülenme",v:"180K"},
                      {t:"Tıklama",v:"12.5K"},
                      {t:"ROAS",v:"4.7x"}
                    ].map((m, i)=> (
                      <motion.div
                        key={m.t}
                        variants={pop}
                        className="rounded-lg p-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center"
                      >
                        <div className="text-[10px] text-slate-500 dark:text-slate-300">{m.t}</div>
                        <div className="text-base font-bold text-slate-900 dark:text-white">{m.v}</div>
                      </motion.div>
                    ))}
                    </div>
                  </div>
                </div>
                {/* Floating chips */}
                <div className="pointer-events-none">
                  <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} transition={{delay:0.2}} className="absolute top-2 left-2 rounded-full px-2.5 py-1 text-[11px] bg-white/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow">%99.9 Uptime</motion.div>
                  <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} transition={{delay:0.35}} className="absolute bottom-2 right-2 rounded-full px-2.5 py-1 text-[11px] bg-white/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow">Gizlilik Odaklı</motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </Section>

      {/* Misyon & Vizyon */}
      <Section className="py-12 sm:py-18">
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <BlurSpot className="absolute -left-10 top-10" color="#93c5fd" size={180} opacity={0.18} />
            <BlurSpot className="absolute right-0 bottom-0" color="#a78bfa" size={160} opacity={0.16} />
          </div>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <motion.div variants={slideLeft} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/70 backdrop-blur p-6">
              <h3 className="text-xl font-bold mb-2">Misyonumuz</h3>
              <p className="text-sm text-muted">Markaların ve üreticilerin bağlantılarından en yüksek verimi almasını sağlamak; karmaşıklığı azaltıp, ölçülebilirliği artırmak.</p>
              <ul className="mt-4 space-y-2 text-sm text-muted">
                <li>• Hızlı ve güvenli yönlendirme</li>
                <li>• Gizlilik odaklı analiz</li>
                <li>• Kolay entegrasyon ve paylaşım</li>
              </ul>
            </motion.div>
            <motion.div variants={slideRight} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/70 backdrop-blur p-6">
              <h3 className="text-xl font-bold mb-2">Vizyonumuz</h3>
              <p className="text-sm text-muted">Bağlantıların sadece kısa değil, akıllı olduğu; kararları veriye dayalı, kullanıcı deneyimi sade bir gelecek.</p>
              <ul className="mt-4 space-y-2 text-sm text-muted">
                <li>• Küresel erişim ve düşük gecikme</li>
                <li>• Reklâmveren ve yayıncı ekosistemi</li>
                <li>• Etik ve şeffaf platform</li>
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </Section>

      {/* Değerler */}
      <Section className="py-12 sm:py-18">
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <BlurSpot className="absolute left-1/3 -top-6" color="#60a5fa" size={140} opacity={0.16} />
          </div>
          <motion.div variants={rise} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Değerlerimiz</h2>
            <p className="mt-2 text-muted">Ürün geliştirme ve destek kültürümüzün temeli</p>
          </motion.div>

          <motion.div variants={valuesStagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3, margin: "-80px" }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { t: "Güvenilirlik", d: "Verilerinize saygı duyarız; güvenlik ve gizlilik önceliğimizdir.", i: FaShieldAlt },
              { t: "Hız", d: "Her milisaniye önemli. Tüm deneyimi hızlı tutuyoruz.", i: FaBolt },
              { t: "Topluluk", d: "Kullanıcılarımızla birlikte inşa ediyor, geri bildirimleri dinliyoruz.", i: FaUsers },
              { t: "Tutku", d: "Sevdiğimiz işi yapıyoruz; detaylara özen gösteriyoruz.", i: FaHeart }
            ].map((v, i) => {
              const Icon = v.i;
              return (
                <motion.div
                  key={v.t}
                  variants={valuesItem}
                  whileHover={{ y: -4, rotate: -0.6, scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/70 backdrop-blur p-6 will-change-transform"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white flex items-center justify-center mb-3">
                    <Icon className="text-base" />
                  </div>
                  <div className="text-lg font-semibold mb-1">{v.t}</div>
                  <div className="text-sm text-muted">{v.d}</div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </Section>

  {/* İstatistikler */}
  <Section className="py-8 sm:py-12">
    <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <BlurSpot className="absolute -right-8 top-6" color="#7dd3fc" size={120} opacity={0.16} />
      </div>
          <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6">
        {[
          {v: 12000, s: "+", l: "Kısaltılan link"},
          {v: 3200000, s: "+", l: "Toplam tıklama"},
          {v: 99, s: ".9%", l: "Uptime"},
          {v: 24, s: "/7", l: "Destek"}
        ].map((m, i)=> {
          const n = useCountUp(m.v);
          const formatted = m.v >= 1000000 ? `${Math.floor(n/10000)/100}M` : (m.v >= 1000 ? `${Math.floor(n/10)/100}K` : `${n}`);
          return (
            <motion.div
              key={m.l}
              variants={pop}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 backdrop-blur p-5 text-center"
            >
              <div className="text-2xl sm:text-3xl font-bold text-foreground">{formatted}{m.s}</div>
              <div className="text-xs sm:text-sm text-muted mt-1">{m.l}</div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  </Section>

      {/* Hikayemiz (Timeline) */}
      <Section className="py-10 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <motion.div variants={rise} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Hikayemiz</h2>
            <p className="mt-2 text-muted">Kısa linkten akıllı platforma uzanan yolculuğumuz</p>
          </motion.div>
          <motion.ol variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} className="relative border-l border-slate-200 dark:border-slate-700 ml-3 space-y-6">
            {[
              { y: "2023", t: "Başlangıç", d: "İlk MVP: hızlı yönlendirme + temel analitik. İlk 1.000 kullanıcı." },
              { y: "2024", t: "Ürün-Market Uyumu", d: "Coğrafi hedefleme, ekipler ve reklamveren araçları. 100K+ aktif link." },
              { y: "2025", t: "Ölçeklenme", d: "Küresel CDN, gizlilik odaklı analitik, entegrasyonlar. 3M+ tıklama/gün." },
              { y: "2026", t: "Vizyon", d: "Açık API ekosistemi ve gelişmiş otomasyon ile daha akıllı kampanyalar." }
            ].map((e, i) => (
              <motion.li
                key={e.y}
                variants={slideLeft}
                className="ml-4"
              >
                <div className="absolute -left-[7px] w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600" />
                <div className="text-xs text-muted">{e.y}</div>
                <div className="mt-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-900/50 backdrop-blur p-4">
                  <div className="text-base font-semibold">{e.t}</div>
                  <div className="text-sm text-muted">{e.d}</div>
                </div>
              </motion.li>
            ))}
          </motion.ol>
        </div>
      </Section>

      {/* Ekip Tanıtımı */}
  <Section className="py-10 sm:py-16">
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <motion.div variants={rise} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Ekibimiz</h2>
            <p className="mt-2 text-muted">Küçük ekip, büyük etki</p>
          </motion.div>
          <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="grid grid-cols-2 md:grid-cols-4 gap-5 sm:gap-6">
            {[
              {n:"Aylin", r:"Ürün", i:"https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=640&auto=format&fit=crop", bio:"Deneyimli ürün yöneticisi.", tw:"#", li:"#", gh:"#"},
              {n:"Kerem", r:"Geliştirme", i:"https://i.pravatar.cc/640?img=32", bio:"Tam yığın geliştirici.", tw:"#", li:"#", gh:"#"},
              {n:"Merve", r:"Tasarım", i:"https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=640&auto=format&fit=crop", bio:"Kullanıcı odaklı tasarımcı.", tw:"#", li:"#", gh:"#"},
              {n:"Deniz", r:"Büyüme", i:"https://images.unsplash.com/photo-1542204637-e67bc7d41e48?q=80&w=640&auto=format&fit=crop", bio:"Veri odaklı büyüme uzmanı.", tw:"#", li:"#", gh:"#"}
            ].map((p, i)=> (
              <motion.div
                key={p.n}
                variants={pop}
                viewport={{ once: true, amount: 0.2 }}
                whileHover={{ y: -4 }}
                className="group rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur"
              >
                <div className="aspect-square relative">
                  <img src={p.i} alt={p.n} className="w-full h-full object-cover" loading="lazy" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/50 transition-colors flex items-end">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity w-full p-3 text-white text-xs flex items-center justify-between">
                      <span>{p.bio}</span>
                      <span className="flex items-center gap-2">
                        <a href={p.tw} aria-label="Twitter" className="hover:text-blue-300"><FaTwitter /></a>
                        <a href={p.li} aria-label="LinkedIn" className="hover:text-blue-300"><FaLinkedin /></a>
                        <a href={p.gh} aria-label="GitHub" className="hover:text-blue-300"><FaGithub /></a>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="p-4 text-center">
                  <div className="font-semibold">{p.n}</div>
                  <div className="text-xs text-muted">{p.r}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
    </div>
  </Section>

  {/* Referanslar / Partnerler */}
  <Section className="py-10 sm:py-16">
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <motion.div variants={rise} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Referanslar</h2>
        <p className="mt-2 text-muted">Birlikte çalıştığımız ve entegre olduğumuz markalar</p>
      </motion.div>
          <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-6">
        {[
          { name: "Next.js", logo: "/next.svg" },
          { name: "Vercel", logo: "/vercel.svg" },
          { name: "Windows", logo: "/window.svg" },
          { name: "Analytics", logo: "/illustrations/how-it-works.svg" },
          { name: "Dashboard", logo: "/illustrations/dashboard.svg" },
          { name: "Ads", logo: "/illustrations/ads.svg" }
        ].map((b, i) => (
          <motion.div
            key={i}
            variants={rise}
            whileHover={{ scale: 1.05 }}
            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur p-4 flex items-center justify-center hover:shadow-md transition-shadow"
          >
            <img src={b.logo} alt={b.name} title={b.name} className="h-8 w-auto mx-auto grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition" />
          </motion.div>
        ))}
      </motion.div>
      <div className="mt-6 text-center text-xs text-muted">Logolar ticari markaların mülkiyetidir ve sadece örnekleme amacıyla gösterilmektedir.</div>
    </div>
  </Section>

  

  {/* Kullanıcı yorumları */}
  <Section className="py-10 sm:py-16">
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <Testimonials />
    </div>
  </Section>

      {/* CTA */}
      <Section className="py-10 sm:py-16">
        <motion.div variants={rise} initial="hidden" whileInView="show" viewport={{ once: true }} className="mx-auto max-w-3xl text-center px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl font-bold tracking-tight">Bize katılmaya hazır mısın?</h3>
          <p className="mt-2 text-muted">Hemen ücretsiz hesap oluştur ve önemli olanı ölçmeye başla.</p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <Button size="lg">Hesap Oluştur</Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <Button variant="secondary" size="lg">İletişime Geç</Button>
            </motion.div>
          </div>
        </motion.div>
      </Section>
      </motion.div>
    </MotionConfig>
  );
}


