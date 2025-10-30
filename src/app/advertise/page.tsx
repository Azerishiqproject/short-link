"use client";
import React, { useEffect, useRef, useState } from "react";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { BlurSpot } from "@/components/ui/BlurSpot";
import { Card } from "../../components/ui/Card";
import Image from "next/image";
import { FaCrosshairs, FaChartLine, FaFlask, FaMobileAlt, FaShieldAlt, FaHeadset, FaImage, FaBullhorn, FaVideo, FaFileAlt, FaChartBar, FaRocket, FaGoogle, FaUsers, FaPlayCircle, FaHeart, FaUserPlus, FaCheck, FaTimes, FaQuoteLeft } from "react-icons/fa";


// Reklam türleri
const adTypes = [
  {
    title: "Banner Reklamlar",
    description: "Web sitelerinde görsel reklamlar",
    icon: FaImage,
    features: ["Responsive tasarım", "Yüksek görünürlük", "Tıklanabilir"]
  },
  {
    title: "Pop-up Reklamlar",
    description: "Dikkat çekici pop-up reklamlar",
    icon: FaBullhorn,
    features: ["Yüksek etkileşim", "Özelleştirilebilir", "Zamanlanabilir"]
  },
  {
    title: "Video Reklamlar",
    description: "Etkili video reklam deneyimi",
    icon: FaVideo,
    features: ["Otomatik oynatma", "Ses kontrolü", "Mobil uyumlu"]
  },
  {
    title: "Text Reklamlar",
    description: "Hedefli metin reklamları",
    icon: FaFileAlt,
    features: ["SEO dostu", "Hızlı yükleme", "Maliyet etkin"]
  }
];

// Kampanya hedefleri (Advertiser ihtiyaçlarına göre)
const campaignGoals = [
  {
    title: "Google Yorum Kampanyası",
    description: "İşletmeniz için güven artıran gerçek kullanıcı yorumları edinin.",
    icon: FaGoogle,
    color: "from-emerald-500 to-emerald-600",
    bullets: ["Yorum hacmi ve kalite hedefleri", "Bölge ve dil hedefleme", "Doğrulanmış kullanıcı akışı"]
  },
  {
    title: "Site Trafiği Arttırma",
    description: "Nitelikli ziyaretçilerle sitenizin trafiğini ölçeklendirin.",
    icon: FaUsers,
    color: "from-blue-500 to-indigo-600",
    bullets: ["Demografi ve ilgi alanı hedefleme", "Cihaz ve lokasyon kırılımları", "Hızlı kurulum"]
  },
  {
    title: "Video İzletme",
    description: "Videolarınız için izlenme ve görüntülenme süresi kazanın.",
    icon: FaPlayCircle,
    color: "from-purple-500 to-pink-600",
    bullets: ["Tamamlama oranı optimizasyonu", "Sessiz/otomatik oynatma seçenekleri", "Platform çapraz dağıtım"]
  },
  {
    title: "Beğeni & Takip",
    description: "Sosyal profillerinizde beğeni ve takipçi büyümesi elde edin.",
    icon: FaHeart,
    color: "from-rose-500 to-red-600",
    bullets: ["Gerçek kullanıcı segmentleri", "Kademeli büyüme", "Risk azaltma politikaları"]
  }
];

export default function ReklamVer() {
  const featuresSliderRef = useRef<HTMLDivElement>(null);
  const [featureIndex, setFeatureIndex] = useState(0);
  const featuresData = [
    {
      title: "Hedefli Gösterim",
      description: "Coğrafi, demografik ve ilgi alanlarına göre hedefleme",
      icon: FaCrosshairs,
    },
    {
      title: "Gerçek Zamanlı Analitik",
      description: "Anlık performans takibi ve raporlama",
      icon: FaChartLine,
    },
    {
      title: "A/B Test Desteği",
      description: "Varyant deneyleri ile optimizasyon",
      icon: FaFlask,
    },
    {
      title: "Mobil Optimizasyon",
      description: "Tüm cihazlarda yüksek performans",
      icon: FaMobileAlt,
    },
    {
      title: "Fraud Koruması",
      description: "Bot ve sahte tıklamalara karşı koruma",
      icon: FaShieldAlt,
    },
    {
      title: "7/24 Destek",
      description: "Uzman ekipten sürekli destek",
      icon: FaHeadset,
    },
  ];

  const slideBy = (dir: number) => {
    const container = featuresSliderRef.current;
    if (!container) return;
    const card = container.querySelector('.feature-card') as HTMLElement | null;
    const step = card ? card.clientWidth + 16 : container.clientWidth * 0.9;
    container.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  useEffect(() => {
    const container = featuresSliderRef.current;
    if (!container) return;
    const onScroll = () => {
      const card = container.querySelector('.feature-card') as HTMLElement | null;
      const step = card ? card.clientWidth + 16 : container.clientWidth;
      const idx = Math.round(container.scrollLeft / step);
      setFeatureIndex(Math.max(0, Math.min(featuresData.length - 1, idx)));
    };
    container.addEventListener('scroll', onScroll, { passive: true });
    return () => container.removeEventListener('scroll', onScroll as EventListener);
  }, [featuresData.length]);
  const dotsCount = Math.max(0, featuresData.length - 2);
  const activeDot = Math.min(featureIndex, Math.max(0, dotsCount - 1));
  return (
    <div className="relative">
      {/* Arka plan katmanları - Ana sayfa ile tutarlı */}
      <div className="absolute inset-0 -z-20 bg-gradient-to-b from-[#F8FBFF] via-white to-[#F5F7FB] dark:from-slate-900 dark:via-slate-950 dark:to-slate-900" />
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-20" style={{backgroundImage:"radial-gradient(#e5e7eb 1px, transparent 1px)", backgroundSize:"24px 24px"}} />
      <div className="pointer-events-none absolute inset-0 -z-10 hidden dark:block opacity-12" style={{backgroundImage:"radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)", backgroundSize:"24px 24px"}} />
      
      {/* BlurSpot efektleri - Ekran içinde kalacak şekilde */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <BlurSpot className="absolute left-4 sm:left-8 md:left-12 top-8 hidden sm:block" color="#60a5fa" size={160} opacity={0.18} />
        <BlurSpot className="absolute right-4 sm:right-8 md:right-12 top-[200px] sm:top-[300px] hidden md:block" color="#a78bfa" size={180} opacity={0.16} />
        <BlurSpot className="absolute left-1/4 sm:left-1/3 bottom-4 sm:bottom-8 hidden sm:block" color="#3b82f6" size={140} opacity={0.14} />
      </div>

      {/* HERO - Minimal, modern metric hero */}
      <Section className="py-16 sm:py-24 overflow-x-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left: Copy */}
            <div className="lg:col-span-7 space-y-6">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-200/70 dark:border-blue-500/30 text-xs sm:text-sm">
                Reklamverenler için performans odaklı platform
              </span>
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
                <span className="bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-200 bg-clip-text text-transparent">Dönüşüm getiren kampanyalar, dakikalar içinde</span>
              </h1>
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl">
                İleri hedefleme, gerçek zamanlı analitik ve akıllı optimizasyonla sonuç odaklı reklamlar oluşturun.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  size="lg" 
                  className="px-7 sm:px-8"
                  onClick={() => alert("Çok yakında!")}
                >
                  Kampanya Başlat
                </Button>
                <a href="#ad-goals" className="inline-flex">
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                    Formatları Gör
                  </Button>
                </a>
              </div>
              <div className="grid grid-cols-3 gap-4 pt-2 max-w-md">
                {[{v:"2.4M",l:"Aylık görüntülenme"},{v:"12.5%",l:"Ortalama TO"},{v:"98%",l:"Gerçek kullanıcı"}].map((m)=> (
                  <div key={m.l} className="text-left">
                    <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">{m.v}</div>
                    <div className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">{m.l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Phone mock */}
            <div className="lg:col-span-5">
              <div className="mx-auto w-full max-w-sm">
                <div className="relative rounded-[28px] border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/80 shadow-2xl p-5 overflow-hidden">
                  {/* gradient ring */}
                  <div className="absolute -inset-20 bg-gradient-to-tr from-blue-500/20 via-fuchsia-500/20 to-pink-500/20 blur-3xl" />
                  <div className="relative space-y-4">
                    <div className="rounded-2xl p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                      <div className="text-xs opacity-90">Tahmini erişim</div>
                      <div className="text-3xl font-bold">180K</div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {[{t:"Tıklama",v:"12.5K"},{t:"CPC",v:"₺0.48"},{t:"ROAS",v:"4.7x"}].map((k)=> (
                        <div key={k.t} className="rounded-xl p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                          <div className="text-[10px] text-slate-500 dark:text-slate-300">{k.t}</div>
                          <div className="text-lg font-bold text-slate-900 dark:text-white">{k.v}</div>
                        </div>
                      ))}
                    </div>
                    <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 bg-white/70 dark:bg-slate-800/60">
                      <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 mb-2">
                        <span>Bütçe kullanımı</span>
                        <span className="font-semibold text-slate-900 dark:text-white">%62</span>
                      </div>
                      <div className="h-2 rounded bg-slate-200 dark:bg-slate-700 overflow-hidden">
                        <div className="h-2 bg-emerald-500" style={{ width: "62%" }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Nasıl Çalışır? - Dark stepper + neon glass mock */}
      <Section className="py-12 sm:py-18">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-900/50 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 shadow-inner mb-4">
                <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400"></span>
                <span className="text-xs font-medium">Nasıl Çalışır?</span>
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight mb-5">3 Adımda Kampanyanızı Yayına Alın</h2>
            <div className="relative">
                <div className="hidden sm:block absolute left-[14px] top-0 bottom-0 border-l border-slate-700/60" />
                <ol className="space-y-5">
                  {[
                    { title: "Hedefinizi Seçin", desc: "Google yorum, site trafiği, video izletme veya beğeni & takip." },
                    { title: "Kitleyi Tanımlayın", desc: "Lokasyon, cihaz, demografi ve ilgi alanlarına göre hedefleme yapın." },
                    { title: "Bütçe ve Yayın", desc: "Günlük/Toplam bütçe, teklif stratejisi ve zamanlama ile yayına alın." }
                  ].map((s, i) => (
                    <li key={i} className="flex gap-4 items-start">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white flex items-center justify-center font-semibold shadow-md ring-1 ring-fuchsia-400/40">{i+1}</div>
                      <div>
                        <div className="font-semibold">{s.title}</div>
                        <div className="text-sm text-muted">{s.desc}</div>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-gradient-to-b dark:from-slate-900 dark:to-slate-950 shadow-2xl p-6 sm:p-8">
                {/* Mini Wizard */}
                <div className="space-y-5">
                  {/* Step chips */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {[
                      { t: "Hedef", c: "from-fuchsia-600 to-pink-600" },
                      { t: "Hedefleme", c: "from-indigo-600 to-purple-600" },
                      { t: "Bütçe", c: "from-emerald-600 to-teal-600" }
                    ].map((s, i) => (
                      <span key={i} className={`px-3 py-1.5 rounded-full text-xs text-white bg-gradient-to-r ${s.c}`}>{s.t}</span>
                    ))}
                  </div>

                  {/* Targeting summary */}
                  <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 backdrop-blur p-4">
                    <div className="text-xs text-slate-500 dark:text-slate-300 mb-2">Hedefleme Özeti</div>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "TR, US, DE",
                        "18-44",
                        "Mobil + Web",
                        "İlgi: Teknoloji, Oyun"
                      ].map((t, i) => (
                        <span key={i} className="px-2 py-1 rounded-md text-[11px] bg-slate-100 border border-slate-200 text-slate-700 dark:bg-slate-800/60 dark:border-white/10 dark:text-slate-200">{t}</span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Budget preview */}
                  <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 backdrop-blur p-4">
                    <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 mb-2">
                      <span>Günlük Bütçe</span>
                      <span className="text-slate-900 dark:text-white font-semibold">₺1.500</span>
                    </div>
                    <div className="h-2 rounded bg-slate-200 dark:bg-slate-800 overflow-hidden">
                      <div className="h-2 bg-emerald-500" style={{ width: "62%" }} />
                    </div>
                    <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">Tahmini harcama: %62</div>
                  </div>
                  
                  {/* KPIs */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-xl p-3 bg-slate-800/60 border border-slate-700">
                      <div className="text-[10px] text-slate-400">Erişim</div>
                      <div className="text-lg font-bold text-fuchsia-400">180K</div>
                    </div>
                    <div className="rounded-xl p-3 bg-slate-800/60 border border-slate-700">
                      <div className="text-[10px] text-slate-400">Tıklama</div>
                      <div className="text-lg font-bold text-pink-400">12.5K</div>
                    </div>
                    <div className="rounded-xl p-3 bg-slate-800/60 border border-slate-700">
                      <div className="text-[10px] text-slate-400">CPC</div>
                      <div className="text-lg font-bold text-emerald-400">₺0.48</div>
                    </div>
                  </div>
                </div>

                {/* Glows */}
                <div className="absolute -top-10 -left-10 w-32 h-32 rounded-full bg-fuchsia-500/10 blur-2xl" />
                <div className="absolute -bottom-8 -right-8 w-40 h-40 rounded-full bg-pink-500/10 blur-2xl" />
                    </div>
                  </div>
                </div>
              </div>
      </Section>

      {/* Karşılaştırma Matrisi - farklı görsel dil */}
      <Section className="py-10 sm:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold tracking-tight">Karşılaştırma</h2>
            <p className="mt-2 text-muted">Kendi kampanyanız vs Geleneksel reklam kanalları</p>
            </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-y-2">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-xs uppercase tracking-wider text-muted">Özellik</th>
                  <th className="px-4 py-3">Biz</th>
                  <th className="px-4 py-3">Geleneksel</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { k: "Gerçek zamanlı analitik", a: true, b: false },
                  { k: "İnce hedefleme", a: true, b: false },
                  { k: "A/B testi", a: true, b: false },
                  { k: "Hızlı kurulum", a: true, b: false },
                  { k: "Esnek bütçe", a: true, b: false },
                ].map((row, i) => (
                  <tr key={i} className="bg-white/60 dark:bg-slate-800/60 backdrop-blur rounded-xl overflow-hidden">
                    <td className="px-4 py-3 text-sm">{row.k}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 text-xs"><FaCheck /> Var</span>
                    </td>
                    <td className="px-4 py-3">
                      {row.b ? (
                        <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 text-xs"><FaCheck /> Var</span>
                      ) : (
                        <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300 text-xs"><FaTimes /> Yok</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Section>

      {/* Müşteri Görüşleri - farklı komponent hissi için alıntı stili */}
      <Section className="py-10 sm:py-16">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { q: "Site trafiğimiz 3 ayda 4 kat arttı.", a: "E-ticaret Yöneticisi" },
              { q: "Google yorumlarımız müşteri güvenini ciddi artırdı.", a: "Kafe İşletmecisi" },
              { q: "Video izletme kampanyaları izlenme süremizi uzattı.", a: "İçerik Üreticisi" },
            ].map((t, i) => (
              <div key={i} className="relative rounded-2xl border border-slate-200 dark:border-slate-700 p-6 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800">
                <FaQuoteLeft className="text-slate-300 dark:text-slate-600 mb-3" />
                <p className="text-sm text-slate-700 dark:text-slate-300">{t.q}</p>
                <div className="mt-4 text-xs text-muted">— {t.a}</div>
              </div>
            ))}
          </div>
        </div>
      </Section>
      {/* Reklam Özellikleri - Farklı stil: bordered list rows */}
      <Section className="py-10 sm:py-14">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold tracking-tight">Reklam Özelliklerimiz</h2>
            <p className="mt-2 text-muted">Güçlü reklam araçları ile hedefinize ulaşın</p>
          </div>
          
          <div className="relative">
            {/* Arrow controls */}
            <button onClick={() => slideBy(-1)} className="flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 h-10 w-10 items-center justify-center rounded-full bg-white/80 dark:bg-slate-900/70 border border-slate-300 dark:border-slate-700 backdrop-blur hover:bg-white/90 dark:hover:bg-slate-900/90 shadow-md z-20" aria-label="Geri">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <button onClick={() => slideBy(1)} className="flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 h-10 w-10 items-center justify-center rounded-full bg-white/80 dark:bg-slate-900/70 border border-slate-300 dark:border-slate-700 backdrop-blur hover:bg-white/90 dark:hover:bg-slate-900/90 shadow-md z-20" aria-label="İleri">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>

            {/* Slider */}
            <div ref={featuresSliderRef} className="-mx-4 px-4 md:mx-0 md:px-0 overflow-x-auto no-scrollbar snap-x snap-mandatory flex gap-4 md:gap-6 pb-4">
              {featuresData.map((feature) => {
              const IconComponent = feature.icon;
                return (
                  <div key={feature.title} className="feature-card min-w-[260px] sm:min-w-[300px] md:min-w-[360px] snap-start">
                    <div className="rounded-xl h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center">
                          <IconComponent className="text-base" />
                        </div>
                        <div>
                          <h3 className="text-base font-semibold">{feature.title}</h3>
                          <p className="text-sm text-muted mt-1">{feature.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Dots (features - 2) */}
            <div className="mt-2 flex justify-center gap-2">
              {Array.from({ length: dotsCount }).map((_, i) => (
                <span key={i} className={`h-1.5 rounded-full transition-all duration-200 ${i === activeDot ? 'w-6 bg-slate-700 dark:bg-slate-300' : 'w-3 bg-slate-300 dark:bg-slate-700'}`} />
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Hangi Reklamları Verebilirsiniz? - Farklı stil: accent-left panels */}
      <Section className="py-10 sm:py-14">
        <div className="mx-auto max-w-6xl">
          <div id="ad-goals" className="text-center mb-8">
            <h2 className="text-2xl font-bold tracking-tight">Hangi Reklamları Verebilirsiniz?</h2>
            <p className="mt-2 text-muted">İhtiyacınıza uygun reklam hedefine odaklanın</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {campaignGoals.map((goal, index) => {
              const IconComponent = goal.icon;
              return (
                <div key={goal.title} className="relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
                  <div className={`absolute inset-y-0 left-0 w-1 bg-gradient-to-b ${goal.color}`} />
                  <div className="p-6 sm:p-7 flex items-start gap-5">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${goal.color} flex items-center justify-center text-white flex-shrink-0`}>
                      <IconComponent className="text-lg" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-lg font-bold">{goal.title}</h3>
                      <p className="text-sm text-muted mt-1 mb-3">{goal.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {goal.bullets.map((b, i) => (
                          <span key={i} className="px-2.5 py-1 rounded-full text-xs bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">{b}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Section>

      {/* Reklam Formatları - Alternating split cards with visual mocks */}
      <Section className="py-10 sm:py-14">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold tracking-tight">Reklam Formatları</h2>
            <p className="mt-2 text-muted">Mesajınızı farklı formatlarda iletin</p>
          </div>
          
          <div className="space-y-6">
            {adTypes.map((type, index) => {
              const IconComponent = type.icon;
              const accents = [
                "from-blue-500 to-purple-600",
                "from-emerald-500 to-teal-600",
                "from-rose-500 to-pink-600",
                "from-amber-500 to-orange-600",
              ];
              const accent = accents[index % accents.length];
              const isReversed = index % 2 === 1;
              return (
                <div key={type.title} className={`rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900`}> 
                  <div className={`flex flex-col ${isReversed ? "md:flex-row-reverse" : "md:flex-row"}`}>
                    {/* Visual Mock */}
                    <div className="md:w-1/2 p-5 sm:p-6 bg-slate-50 dark:bg-slate-800/60">
                      <div className={`relative h-48 sm:h-56 rounded-xl overflow-hidden bg-gradient-to-br ${accent} opacity-90`}> 
                        {/* Format-specific mock */}
                        {type.title.includes("Banner") && (
                          <div className="absolute inset-0 p-4">
                            <div className="h-6 bg-white/90 rounded mb-3" />
                            <div className="h-24 bg-white/80 rounded" />
                            <div className="absolute bottom-4 left-4 right-4 h-10 bg-black/80 rounded" />
                          </div>
                        )}
                        {type.title.includes("Pop-up") && (
                          <div className="absolute inset-0 p-4">
                            <div className="h-full bg-white/30 rounded" />
                            <div className="absolute inset-6 bg-white rounded-xl shadow-2xl">
                              <div className="h-8 bg-slate-200 rounded-t-xl" />
                              <div className="p-3 space-y-2">
                                <div className="h-3 bg-slate-200/90 rounded" />
                                <div className="h-3 bg-slate-200/80 rounded w-3/4" />
                                <div className="mt-3 h-8 bg-purple-500/80 rounded" />
                              </div>
                            </div>
                          </div>
                        )}
                        {type.title.includes("Video") && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center">
                              <div className="ml-1 w-0 h-0 border-t-[10px] border-t-transparent border-l-[16px] border-l-purple-600 border-b-[10px] border-b-transparent" />
                            </div>
                            <div className="absolute bottom-4 left-4 right-4 h-2 bg-white/70 rounded">
                              <div className="h-2 bg-purple-600 rounded" style={{ width: "45%" }} />
                            </div>
                          </div>
                        )}
                        {type.title.includes("Text") && (
                          <div className="absolute inset-0 p-6 space-y-3">
                            <div className="h-3 bg-white/90 rounded w-3/4" />
                            <div className="h-3 bg-white/80 rounded w-2/3" />
                            <div className="h-3 bg-white/70 rounded w-4/5" />
                            <div className="mt-3 h-8 bg-black/70 rounded w-28" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="md:w-1/2 p-6 sm:p-8">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${accent} text-white flex items-center justify-center`}>
                          <IconComponent className="text-base" />
                        </div>
                        <h3 className="text-lg font-bold">{type.title}</h3>
                      </div>
                      <p className="text-sm text-muted mb-4">{type.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {type.features.map((feature, idx) => (
                          <span key={idx} className="px-2.5 py-1 rounded-full text-xs bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">{feature}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Section>

      {/* Neler Yapabilirsiniz? (Yetkinlikler) */}
      <Section className="py-10 sm:py-14">
        <div className="mx-auto max-w-6xl">
          <Card rounded="2xl" padding="lg" className="">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-3">Neler Yapabilirsiniz?</h3>
                <p className="text-sm text-muted mb-4">Reklamveren panelimizde kampanyalarınızı uçtan uca yönetin.</p>
                <ul className="space-y-3">
                  {[
                    "Detaylı hedefleme: lokasyon, cihaz, demografi, ilgi alanları",
                    "Bütçe ve teklif optimizasyonu (CPC/CPM/CPA)",
                    "Zamanlama ve sıklık kontrolü (frequency capping)",
                    "A/B testleri ve varyant yönetimi",
                    "Dönüşüm hedefleri ve piksel/SDK entegrasyonu",
                    "Gerçek zamanlı raporlama ve dışa aktarma"
                  ].map((item, i) => (
                    <li key={i} className="text-sm text-foreground flex items-start gap-3">
                      <span className="mt-1 w-2.5 h-2.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-600"></span>
                      <span className="text-slate-600 dark:text-slate-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-100 dark:bg-slate-800 rounded-xl p-4">
                  <div className="text-2xl font-bold text-purple-600">+320%</div>
                  <div className="text-xs text-muted">Ortalama erişim artışı</div>
                </div>
                <div className="bg-slate-100 dark:bg-slate-800 rounded-xl p-4">
                  <div className="text-2xl font-bold text-emerald-600">-35%</div>
                  <div className="text-xs text-muted">Kampanya maliyeti (optimizasyon)</div>
                </div>
                <div className="bg-slate-100 dark:bg-slate-800 rounded-xl p-4">
                  <div className="text-2xl font-bold text-blue-600">4.7x</div>
                  <div className="text-xs text-muted">Ortalama ROAS</div>
                </div>
                <div className="bg-slate-100 dark:bg-slate-800 rounded-xl p-4">
                  <div className="text-2xl font-bold text-rose-600">98%+</div>
                  <div className="text-xs text-muted">Gerçek kullanıcı doğruluğu</div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </Section>

      {/* Avantajlar - Padding yarıya indirildi */}
      <Section className="py-10 sm:py-14">
        <Card className="mx-auto max-w-4xl" rounded="2xl" padding="lg">
          <div className="text-center mb-8">
            <h3 className="text-xl font-bold mb-4">Neden Bizimle Reklam Verin?</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <FaCrosshairs className="text-white text-xl" />
              </div>
              <h4 className="font-semibold mb-2">Hedefli Reklamcılık</h4>
              <p className="text-sm text-muted">Coğrafya, demografi ve ilgi alanlarına göre hedefli reklam gösterimi.</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <FaChartBar className="text-white text-xl" />
              </div>
              <h4 className="font-semibold mb-2">Detaylı Analitik</h4>
              <p className="text-sm text-muted">Gerçek zamanlı performans raporları ve ROI analizi.</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <FaRocket className="text-white text-xl" />
              </div>
              <h4 className="font-semibold mb-2">Hızlı Başlangıç</h4>
              <p className="text-sm text-muted">5 dakikada reklam kampanyanızı oluşturun ve yayına alın.</p>
            </div>
          </div>
        </Card>
      </Section>

      {/* CTA - Padding yarıya indirildi */}
      <Section className="py-10 sm:py-14">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold tracking-tight">Reklam Kampanyanızı Başlatın</h2>
          <p className="mt-3 text-muted">Hemen başlayın ve markanızı milyonlarca kullanıcıya ulaştırın.</p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Button size="lg" onClick={() => alert("Çok yakında!")}>Kampanya Oluştur</Button>
          </div>
        </div>
      </Section>
    </div>
  );
}
