import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { BlurSpot } from "@/components/ui/BlurSpot";
import { Card } from "../../components/ui/Card";
import { FaCrosshairs, FaChartLine, FaFlask, FaMobileAlt, FaShieldAlt, FaHeadset, FaImage, FaBullhorn, FaVideo, FaFileAlt, FaChartBar, FaRocket } from "react-icons/fa";


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

export default function ReklamVer() {
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

      {/* HERO - Modern interaktif tasarım */}
      <Section className="py-20 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Sol taraf - İçerik */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 border border-purple-200 dark:border-purple-800">
                  <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>
                  <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Reklamveren Platformu</span>
                </div>
                
                <h1 className="text-5xl sm:text-6xl font-bold tracking-tight">
                  <span className="text-slate-900 dark:text-white">Reklam</span>
                  <br />
                  <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent">Verin</span>
                  <span className="text-slate-900 dark:text-white">,</span>
                  <br />
                  <span className="text-slate-900 dark:text-white">Büyüyün</span>
                </h1>
                
                <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
                  Hedefli reklamlarınızla doğru kitleye ulaşın. Yüksek kaliteli trafik ve detaylı analitik raporlarla reklam yatırımınızı optimize edin.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg">
                  Kampanya Başlat
                </Button>
                <Button variant="secondary" size="lg" className="px-8 py-4 text-lg">
                  Demo İzle
                </Button>
              </div>
            </div>
            
            {/* Sağ taraf - Görsel */}
            <div className="relative">
              <div className="relative z-10 bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-2xl border border-slate-200 dark:border-slate-700">
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-sm text-slate-500 ml-4">Reklam Dashboard</span>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="h-4 bg-gradient-to-r from-purple-200 to-pink-200 dark:from-purple-800 dark:to-pink-800 rounded"></div>
                    <div className="h-4 bg-gradient-to-r from-blue-200 to-purple-200 dark:from-blue-800 dark:to-purple-800 rounded w-3/4"></div>
                    <div className="h-4 bg-gradient-to-r from-pink-200 to-red-200 dark:from-pink-800 dark:to-red-800 rounded w-1/2"></div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-100 dark:bg-slate-700 rounded-lg p-4">
                      <div className="text-2xl font-bold text-purple-600">2.4M</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">Görüntülenme</div>
                    </div>
                    <div className="bg-slate-100 dark:bg-slate-700 rounded-lg p-4">
                      <div className="text-2xl font-bold text-pink-600">12.5%</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">Tıklama Oranı</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Arka plan efektleri */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-purple-500/20 rounded-full blur-xl"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-pink-500/20 rounded-full blur-xl"></div>
            </div>
          </div>
        </div>
      </Section>

      {/* Reklam Özellikleri - Padding yarıya indirildi */}
      <Section className="py-10 sm:py-14">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold tracking-tight">Reklam Özelliklerimiz</h2>
            <p className="mt-2 text-muted">Güçlü reklam araçları ile hedefinize ulaşın</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Hedefli Gösterim",
                description: "Yaş, cinsiyet, lokasyon ve ilgi alanlarına göre hedefli reklam gösterimi",
                icon: FaCrosshairs,
                color: "from-blue-500 to-blue-600"
              },
              {
                title: "Gerçek Zamanlı Analitik",
                description: "Anlık performans takibi ve detaylı raporlama sistemi",
                icon: FaChartLine,
                color: "from-emerald-500 to-emerald-600"
              },
              {
                title: "A/B Test Desteği",
                description: "Farklı reklam varyantlarını test edin ve en iyisini bulun",
                icon: FaFlask,
                color: "from-purple-500 to-purple-600"
              },
              {
                title: "Mobil Optimizasyon",
                description: "Tüm cihazlarda mükemmel görünüm ve performans",
                icon: FaMobileAlt,
                color: "from-orange-500 to-orange-600"
              },
              {
                title: "Fraud Koruması",
                description: "Gelişmiş bot koruması ile gerçek tıklamaları garanti edin",
                icon: FaShieldAlt,
                color: "from-red-500 to-red-600"
              },
              {
                title: "7/24 Destek",
                description: "Uzman ekibimizden sürekli destek ve rehberlik",
                icon: FaHeadset,
                color: "from-indigo-500 to-indigo-600"
              }
            ].map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card 
                  key={feature.title}
                  rounded="2xl" 
                  padding="lg" 
                  className="text-center hover:shadow-lg transition-all duration-300 group"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="text-white text-2xl" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted">{feature.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </Section>

      {/* Reklam Türleri - Padding yarıya indirildi */}
      <Section className="py-10 sm:py-14">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold tracking-tight">Reklam Türleri</h2>
            <p className="mt-2 text-muted">Farklı reklam formatları ile hedefinize ulaşın</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {adTypes.map((type, index) => {
              const IconComponent = type.icon;
              return (
                <Card 
                  key={type.title}
                  rounded="2xl" 
                  padding="lg" 
                  className="text-center hover:shadow-lg transition-all duration-300 group"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="text-white text-2xl" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{type.title}</h3>
                  <p className="text-sm text-muted mb-4">{type.description}</p>
                  
                  <ul className="space-y-2 text-left">
                    {type.features.map((feature, idx) => (
                      <li key={idx} className="text-xs text-muted flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-blue-500"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </Card>
              );
            })}
          </div>
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
            <Button size="lg">Kampanya Oluştur</Button>
            <Button variant="secondary" size="lg">Demo İzle</Button>
          </div>
        </div>
      </Section>
    </div>
  );
}
