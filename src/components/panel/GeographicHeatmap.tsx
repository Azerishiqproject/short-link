"use client";

import { useEffect, useMemo, useRef, useState } from 'react';
import WorldMap from 'react-svg-worldmap';

interface GeographicHeatmapProps {
  data: Array<{
    country: string;
    count: number;
    percentage: string;
  }>;
}

// react-svg-worldmap ISO2 beklentisi için basit ISO3/isim -> ISO2 eşlemesi
const iso3To2: { [k: string]: string } = {
  USA: 'US', TUR: 'TR', DEU: 'DE', FRA: 'FR', GBR: 'GB', ITA: 'IT', CAN: 'CA',
  BRA: 'BR', ARG: 'AR', MEX: 'MX', JPN: 'JP', CHN: 'CN', IND: 'IN', KOR: 'KR',
  AUS: 'AU', RUS: 'RU', UKR: 'UA', POL: 'PL', NLD: 'NL', BEL: 'BE', ESP: 'ES',
  PRT: 'PT', GRC: 'GR', SWE: 'SE', NOR: 'NO', DNK: 'DK', FIN: 'FI', CHE: 'CH',
  AUT: 'AT', CZE: 'CZ', HUN: 'HU', ROU: 'RO', BGR: 'BG', HRV: 'HR', SRB: 'RS',
  SVK: 'SK', SVN: 'SI', EST: 'EE', LVA: 'LV', LTU: 'LT', SGP: 'SG'
};

// Ülke kodları mapping (Türkçe ve yaygın İngilizce adlar)
const countryCodeMap: { [key: string]: string } = {
  'Türkiye': 'TUR',
  'Almanya': 'DEU',
  'Fransa': 'FRA',
  'France': 'FRA',
  'Poland': 'POL',
  'Singapore': 'SGP',
  'İngiltere': 'GBR',
  'United Kingdom': 'GBR',
  'İtalya': 'ITA',
  'Amerika': 'USA',
  'United States': 'USA',
  'Kanada': 'CAN',
  'Brezilya': 'BRA',
  'Arjantin': 'ARG',
  'Meksika': 'MEX',
  'Japonya': 'JPN',
  'Çin': 'CHN',
  'Hindistan': 'IND',
  'Güney Kore': 'KOR',
  'Avustralya': 'AUS',
  'Rusya': 'RUS',
  'Ukrayna': 'UKR',
  'Polonya': 'POL',
  'Hollanda': 'NLD',
  'Belçika': 'BEL',
  'İspanya': 'ESP',
  'Portekiz': 'PRT',
  'Yunanistan': 'GRC',
  'İsveç': 'SWE',
  'Norveç': 'NOR',
  'Danimarka': 'DNK',
  'Finlandiya': 'FIN',
  'İsviçre': 'CHE',
  'Avusturya': 'AUT',
  'Çekya': 'CZE',
  'Macaristan': 'HUN',
  'Romanya': 'ROU',
  'Bulgaristan': 'BGR',
  'Hırvatistan': 'HRV',
  'Sırbistan': 'SRB',
  'Slovakya': 'SVK',
  'Slovenya': 'SVN',
  'Estonya': 'EST',
  'Letonya': 'LVA',
  'Litvanya': 'LTU',
  'Diğer': 'OTHER'
};

// ISO2 -> ISO3 eşlemesi artık gerekmiyor; sadece isimleri ISO2'ye çevirmek için normalizeToISO2 kullanıyoruz

function normalizeToISO2(input: string | undefined): string | undefined {
  if (!input) return undefined;
  const trimmed = input.trim();
  // Önce TR/EN isimlerini ISO3'e çevir, sonra ISO2'ye indir
  const iso3 = countryCodeMap[trimmed] || (/^[A-Z]{3}$/i.test(trimmed) ? trimmed.toUpperCase() : undefined);
  if (iso3 && iso3To2[iso3]) return iso3To2[iso3];
  // Eğer zaten ISO2 ise kullan
  if (/^[A-Z]{2}$/i.test(trimmed)) return trimmed.toUpperCase();
  return undefined;
}

// react-svg-worldmap kendi renk skalasını üretebilir; özel tema geçiyoruz

export default function GeographicHeatmap({ data }: GeographicHeatmapProps) {
  const source = Array.isArray(data) ? data : (data as any)?.countryBreakdown || [];
  const hasData = source && source.length > 0;
  // Debug incoming overview geo data
  // Konsol spam'ini engelle: sadece veri değişip dolduğunda logla
  const lastLenRef = useRef<number>(-1);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const len = Array.isArray(source) ? source.length : 0;
    if (len > 0 && len !== lastLenRef.current) {
      // @ts-ignore
      lastLenRef.current = len;
    }
  }, [source]);

  // react-svg-worldmap datası: [{ country: 'US', value: 10 }]
  const worldmapData = useMemo(() => {
    const rows: Array<{ country: string; value: number }> = [];
    const sums: Record<string, number> = {};
    for (const item of source || []) {
      const iso2 = normalizeToISO2(String(item.country || ''));
      if (!iso2) continue;
      const v = Number(item.count) || 0;
      const codeUpper = iso2.toUpperCase();
      sums[codeUpper] = (sums[codeUpper] || 0) + v;
    }
    for (const [k, v] of Object.entries(sums)) rows.push({ country: k, value: v });
    // worldmapData logunu yalnızca yukarıdaki effect basıyor
    return rows;
  }, [source]);

  const countByIso2 = useMemo(() => {
    const map: Record<string, number> = {};
    for (const row of worldmapData) {
      map[row.country.toUpperCase()] = row.value;
      map[row.country.toLowerCase()] = row.value;
    }
    // countByIso2 logunu yalnızca yukarıdaki effect tetikliyor
    return map;
  }, [worldmapData]);
  // Tema algılama (Tailwind dark class)
  const [isDark, setIsDark] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = typeof document !== 'undefined' ? document.documentElement : null;
    const update = () => setIsDark(!!el?.classList.contains('dark'));
    update();
    const observer = new MutationObserver(update);
    if (el) observer.observe(el, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  // SVG kenarlık rengini tema ile uyumlu hale getir (CSS ile zorunlu)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    // Trigger re-apply after render changes
  }, [isDark, worldmapData]);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-3 sm:p-4 lg:p-6 shadow-sm">
      <div className="mb-4 sm:mb-6">
        <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white mb-1 sm:mb-2">Coğrafi Dağılım</h3>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Tıklamaların dünya haritasındaki dağılımı</p>
      </div>
      
      {hasData ? (
        <>
          <div ref={containerRef} className="geo-map w-full h-64 sm:h-80 md:h-96 lg:h-[30rem] overflow-hidden rounded-lg">
            <WorldMap
              color={isDark ? '#3b82f6' : '#2563eb'}
              data={worldmapData}
              size="responsive"
              style={{ height: '100%', width: '100%' }}
              valueSuffix=" tıklama"
              tooltipTextFunction={(countryName: any, iso2: any) => {
                const name = typeof countryName === 'string' ? countryName : (countryName?.name || countryName?.countryName || String(iso2 || ''));
                let code = typeof iso2 === 'string' ? iso2 : (iso2?.code || iso2?.country || iso2?.alpha2Code || '');
                code = String(code || normalizeToISO2(name) || '');
                const up = code.toUpperCase();
                const low = code.toLowerCase();
                let val = (countByIso2[up] ?? countByIso2[low] ?? 0);
                if (!val) {
                  const byName = normalizeToISO2(String(name || ''));
                  if (byName) {
                    val = (countByIso2[byName.toUpperCase()] ?? countByIso2[byName.toLowerCase()] ?? 0);
                  }
                }
                return `${name}: ${val} tıklama`;
              }}
              backgroundColor="transparent"
            />
          </div>

          {/* Legend */}
          <div className="mt-3 sm:mt-4 grid grid-cols-2 sm:grid-cols-3 lg:flex lg:items-center lg:justify-between gap-2 sm:gap-3 text-xs text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-1 sm:gap-2"><div className="w-2 h-2 sm:w-3 sm:h-3 rounded" style={{ backgroundColor: isDark ? '#1e293b' : '#e2e8f0' }}></div><span className="text-xs">Veri yok</span></div>
            <div className="flex items-center gap-1 sm:gap-2"><div className="w-2 h-2 sm:w-3 sm:h-3 rounded" style={{ backgroundColor: '#93c5fd' }}></div><span className="text-xs">Düşük</span></div>
            <div className="flex items-center gap-1 sm:gap-2"><div className="w-2 h-2 sm:w-3 sm:h-3 rounded" style={{ backgroundColor: '#60a5fa' }}></div><span className="text-xs">Orta</span></div>
            <div className="flex items-center gap-1 sm:gap-2"><div className="w-2 h-2 sm:w-3 sm:h-3 rounded" style={{ backgroundColor: '#3b82f6' }}></div><span className="text-xs">Yüksek</span></div>
            <div className="flex items-center gap-1 sm:gap-2"><div className="w-2 h-2 sm:w-3 sm:h-3 rounded" style={{ backgroundColor: '#1d4ed8' }}></div><span className="text-xs">Çok Yüksek</span></div>
          </div>
        </>
      ) : (
        <div className="h-64 sm:h-80 flex items-center justify-center">
          <div className="text-center px-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white mb-2">Henüz veri yok</h4>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Bu link için henüz coğrafi veri bulunmuyor</p>
          </div>
        </div>
      )}

      {/* Harita sınır çizgileri için tema uyumlu global stil */}
      <style jsx global>{`
        .geo-map svg path { stroke: #cbd5e1 !important; stroke-width: 0.5 !important; }
        .dark .geo-map svg path { stroke: #e2e8f0 !important; stroke-width: 0.6 !important; }
        @media (max-width: 640px) {
          .geo-map svg path { stroke-width: 0.4 !important; }
          .dark .geo-map svg path { stroke-width: 0.5 !important; }
        }
      `}</style>
    </div>
  );
}
