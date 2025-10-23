import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { BlurSpot } from "@/components/ui/BlurSpot";
import { Card } from "../../components/ui/Card";

// Ülke bazlı kazanç oranları verileri (1000 tıklama başına)
const countryRates = [
  { country: "Amerika", rate: "₺45.50", tier: "Premium" },
  { country: "İngiltere", rate: "₺38.20", tier: "Premium" },
  { country: "Almanya", rate: "₺35.80", tier: "Premium" },
  { country: "Fransa", rate: "₺32.40", tier: "Premium" },
  { country: "Kanada", rate: "₺30.90", tier: "Premium" },
  { country: "Avustralya", rate: "₺28.70", tier: "Premium" },
  { country: "Japonya", rate: "₺26.30", tier: "High" },
  { country: "Hollanda", rate: "₺24.80", tier: "High" },
  { country: "İsveç", rate: "₺23.50", tier: "High" },
  { country: "Norveç", rate: "₺22.10", tier: "High" },
  { country: "İsviçre", rate: "₺20.90", tier: "High" },
  { country: "Avusturya", rate: "₺19.60", tier: "High" },
  { country: "Belçika", rate: "₺18.40", tier: "Medium" },
  { country: "Danimarka", rate: "₺17.20", tier: "Medium" },
  { country: "Finlandiya", rate: "₺16.80", tier: "Medium" },
  { country: "İtalya", rate: "₺15.90", tier: "Medium" },
  { country: "İspanya", rate: "₺14.70", tier: "Medium" },
  { country: "İrlanda", rate: "₺13.50", tier: "Medium" },
  { country: "Portekiz", rate: "₺12.80", tier: "Medium" },
  { country: "Yunanistan", rate: "₺11.90", tier: "Medium" },
  { country: "Çekya", rate: "₺10.50", tier: "Standard" },
  { country: "Polonya", rate: "₺9.80", tier: "Standard" },
  { country: "Macaristan", rate: "₺9.20", tier: "Standard" },
  { country: "Romanya", rate: "₺8.70", tier: "Standard" },
  { country: "Bulgaristan", rate: "₺8.10", tier: "Standard" },
  { country: "Hırvatistan", rate: "₺7.60", tier: "Standard" },
  { country: "Slovakya", rate: "₺7.20", tier: "Standard" },
  { country: "Slovenya", rate: "₺6.90", tier: "Standard" },
  { country: "Litvanya", rate: "₺6.50", tier: "Standard" },
  { country: "Letonya", rate: "₺6.20", tier: "Standard" },
  { country: "Estonya", rate: "₺5.90", tier: "Standard" },
  { country: "Rusya", rate: "₺5.40", tier: "Standard" },
  { country: "Ukrayna", rate: "₺4.80", tier: "Standard" },
  { country: "Türkiye", rate: "₺4.20", tier: "Standard" },
  { country: "Brezilya", rate: "₺3.90", tier: "Standard" },
  { country: "Meksika", rate: "₺3.50", tier: "Standard" },
  { country: "Arjantin", rate: "₺3.20", tier: "Standard" },
  { country: "Şili", rate: "₺2.90", tier: "Standard" },
  { country: "Kolombiya", rate: "₺2.60", tier: "Standard" },
  { country: "Peru", rate: "₺2.40", tier: "Standard" },
  { country: "Venezuela", rate: "₺2.10", tier: "Standard" },
  { country: "Güney Afrika", rate: "₺1.90", tier: "Standard" },
  { country: "Nijerya", rate: "₺1.60", tier: "Standard" },
  { country: "Mısır", rate: "₺1.40", tier: "Standard" },
  { country: "Hindistan", rate: "₺1.20", tier: "Standard" },
  { country: "Çin", rate: "₺1.00", tier: "Standard" },
  { country: "Endonezya", rate: "₺0.90", tier: "Standard" },
  { country: "Filipinler", rate: "₺0.80", tier: "Standard" },
  { country: "Tayland", rate: "₺0.70", tier: "Standard" },
  { country: "Vietnam", rate: "₺0.60", tier: "Standard" },
  { country: "Malezya", rate: "₺0.50", tier: "Standard" },
  { country: "Singapur", rate: "₺0.40", tier: "Standard" },
];

const tierColors = {
  Premium: "from-emerald-500 to-emerald-600 text-white",
  High: "from-blue-500 to-blue-600 text-white", 
  Medium: "from-amber-500 to-orange-500 text-white",
  Standard: "from-gray-500 to-gray-600 text-white"
};

export default function KazancOranlari() {
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

    

     

      {/* Kazanç Oranları Tablosu - Responsive */}
      <Section className="py-10 sm:py-14">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-6 sm:mb-8 pt-14 sm:pt-16 px-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Ülke Bazlı Kazanç Oranları</h2>
            <p className="mt-2 text-sm sm:text-base text-muted">1000 tıklama başına kazanç miktarları (TL cinsinden)</p>
          </div>
          
          {/* Masaüstü Tablo */}
          <Card rounded="2xl" padding="lg" className="overflow-hidden hidden sm:block">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-black/10 dark:border-white/10">
                    <th className="text-left py-4 px-6 font-semibold text-sm sm:text-base text-foreground">Ülke</th>
                    <th className="text-right py-4 px-6 font-semibold text-sm sm:text-base text-foreground">Kazanç (1000 tıklama)</th>
                    <th className="text-center py-4 px-6 font-semibold text-sm sm:text-base text-foreground">Tier</th>
                  </tr>
                </thead>
                <tbody>
                  {countryRates.map((country, index) => (
                    <tr 
                      key={country.country} 
                      className="border-b border-black/5 dark:border-white/5 text-sm sm:text-base hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-300 group"
                      style={{ animationDelay: `${index * 0.02}s` }}
                    >
                      <td className="py-3 sm:py-4 px-4 sm:px-6 font-medium text-foreground group-hover:text-black dark:group-hover:text-white transition-colors duration-300">
                        {country.country}
                      </td>
                      <td className="py-3 sm:py-4 px-4 sm:px-6 text-right font-bold text-emerald-600 dark:text-emerald-400 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors duration-300">
                        {country.rate}
                      </td>
                      <td className="py-3 sm:py-4 px-4 sm:px-6 text-center">
                        <span className={`inline-flex items-center px-2.5 sm:px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-medium bg-gradient-to-r ${tierColors[country.tier as keyof typeof tierColors]} shadow-soft group-hover:shadow-md transition-all duration-300`}>
                          {country.tier}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Mobil Liste */}
          <div className="sm:hidden space-y-3">
            {countryRates.map((country) => (
              <Card key={country.country} rounded="2xl" padding="md" className="">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-semibold text-sm text-foreground truncate">{country.country}</div>
                    <div className="text-xs text-muted mt-0.5">1000 tıklama</div>
                  </div>
                  <div className="text-right">
                    <div className="text-emerald-600 dark:text-emerald-400 font-bold text-sm">{country.rate}</div>
                    <div className="mt-1">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-medium bg-gradient-to-r ${tierColors[country.tier as keyof typeof tierColors]}`}>
                        {country.tier}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      {/* Açıklama Bölümü - Responsive */}
      <Section className="py-10 sm:py-14">
        <Card className="mx-auto max-w-4xl" rounded="2xl" padding="lg">
          <div className="text-center">
            <h3 className="text-lg sm:text-xl font-bold mb-4">Kazanç Oranları Nasıl Belirlenir?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 text-left">
              <div>
                <h4 className="font-semibold mb-2">📍 Coğrafi Konum</h4>
                <p className="text-sm text-muted">Ülkenin ekonomik durumu ve reklam pazarı büyüklüğü kazanç oranlarını etkiler.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">💰 Reklam Değeri</h4>
                <p className="text-sm text-muted">Reklamverenlerin o ülkedeki kullanıcılara verdiği değer oranları belirler.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">📊 Trafik Kalitesi</h4>
                <p className="text-sm text-muted">Tıklama kalitesi ve dönüşüm oranları kazanç miktarını etkiler.</p>
              </div>
            </div>
          </div>
        </Card>
      </Section>

      {/* CTA - Responsive */}
      <Section className="py-10 sm:py-14">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Hemen Başlayın ve Kazanmaya Başlayın</h2>
          <p className="mt-3 text-sm sm:text-base text-muted">Linklerinizi kısaltın ve ülke bazlı kazanç oranlarından faydalanın.</p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 px-2">
            <Button size="lg" className="w-full sm:w-auto">Ücretsiz Başla</Button>
          </div>
        </div>
      </Section>
    </div>
  );
}
