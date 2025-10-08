"use client";

import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';

interface GeographicHeatmapProps {
  data: Array<{
    country: string;
    count: number;
    percentage: string;
  }>;
}

// Dünya haritası için TopoJSON URL
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// Ülke kodları mapping (Türkçe ve yaygın İngilizce adlar)
const countryCodeMap: { [key: string]: string } = {
  'Türkiye': 'TUR',
  'Almanya': 'DEU',
  'Fransa': 'FRA',
  'France': 'FRA',
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

// ISO2 -> ISO3 dönüştürme için minimal eşleme (gerektikçe genişletilebilir)
const iso2To3: { [key: string]: string } = {
  TR: 'TUR', DE: 'DEU', FR: 'FRA', GB: 'GBR', IT: 'ITA', US: 'USA', CA: 'CAN',
  BR: 'BRA', AR: 'ARG', MX: 'MEX', JP: 'JPN', CN: 'CHN', IN: 'IND', KR: 'KOR',
  AU: 'AUS', RU: 'RUS', UA: 'UKR', PL: 'POL', NL: 'NLD', BE: 'BEL', ES: 'ESP',
  PT: 'PRT', GR: 'GRC', SE: 'SWE', NO: 'NOR', DK: 'DNK', FI: 'FIN', CH: 'CHE',
  AT: 'AUT', CZ: 'CZE', HU: 'HUN', RO: 'ROU', BG: 'BGR', HR: 'HRV', RS: 'SRB',
  SK: 'SVK', SI: 'SVN', EE: 'EST', LV: 'LVA', LT: 'LTU'
};

function normalizeToISO3(input: string | undefined): string | undefined {
  if (!input) return undefined;
  const trimmed = input.trim();
  // Doğrudan sözlükten (TR adları / İngilizce adlar)
  if (countryCodeMap[trimmed]) return countryCodeMap[trimmed];
  const upper = trimmed.toUpperCase();
  // Zaten ISO3 ise
  if (/^[A-Z]{3}$/.test(upper)) return upper;
  // ISO2 ise ISO3'e çevir
  if (/^[A-Z]{2}$/.test(upper) && iso2To3[upper]) return iso2To3[upper];
  return undefined;
}

// Renk skalası
const getColor = (count: number, maxCount: number) => {
  if (count === 0) return '#e2e8f0'; // Gri - veri yok
  const intensity = count / maxCount;
  if (intensity > 0.8) return '#dc2626'; // Kırmızı - yüksek
  if (intensity > 0.6) return '#ea580c'; // Turuncu
  if (intensity > 0.4) return '#d97706'; // Sarı-turuncu
  if (intensity > 0.2) return '#ca8a04'; // Sarı
  return '#65a30d'; // Yeşil - düşük
};

export default function GeographicHeatmap({ data }: GeographicHeatmapProps) {
  const hasData = data && data.length > 0;
  
  // Veriyi ülke kodlarına göre dönüştür
  const maxCount = hasData ? Math.max(...data.map(d => d.count)) : 0;
  const dataMap = hasData ? data.reduce((acc, item) => {
    const normalized = normalizeToISO3(item.country);
    if (normalized && normalized !== 'OTHER') {
      acc[normalized] = (acc[normalized] || 0) + item.count;
    }
    return acc;
  }, {} as { [key: string]: number }) : {};

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Coğrafi Dağılım</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400">Tıklamaların dünya haritasındaki dağılımı</p>
      </div>
      
      {hasData ? (
        <>
          <div className="h-80 w-full">
            <ComposableMap
              projection="geoMercator"
              projectionConfig={{
                scale: 100,
                center: [20, 50]
              }}
              style={{
                width: "100%",
                height: "100%"
              }}
            >
              <ZoomableGroup>
                <Geographies geography={geoUrl}>
                  {({ geographies }) =>
                    geographies.map((geo) => {
                      const props: any = geo.properties || {};
                      // Bazı topojson sürümlerinde ISO alan adları farklı olabiliyor
                      const codeA3 = props.ISO_A3 || props.ISO3 || props.A3 || undefined;
                      const codeA2 = props.ISO_A2 || props.ISO2 || props.A2 || undefined;
                      const name = props.NAME || props.NAME_LONG || props.name || undefined;
                      // Önce ISO3 ile bak, yoksa ISO2, yoksa isim üzerinden normalize et
                      const key = codeA3 || (codeA2 ? (iso2To3[String(codeA2).toUpperCase()] || undefined) : undefined) || normalizeToISO3(String(name || '')) || undefined;
                      const count = key ? (dataMap[key] || 0) : 0;
                      const color = getColor(count, maxCount);
                      
                      return (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          fill={color}
                          stroke="#64748b"
                          strokeWidth={0.5}
                          style={{
                            default: {
                              fill: color,
                              stroke: "#64748b",
                              strokeWidth: 0.5,
                              outline: "none",
                            },
                            hover: {
                              fill: "#3b82f6",
                              stroke: "#1e40af",
                              strokeWidth: 1,
                              outline: "none",
                            },
                            pressed: {
                              fill: "#1d4ed8",
                              stroke: "#1e40af",
                              strokeWidth: 1,
                              outline: "none",
                            },
                          }}
                        />
                      );
                    })
                  }
                </Geographies>
              </ZoomableGroup>
            </ComposableMap>
          </div>
          
          {/* Legend */}
          <div className="mt-4 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: '#e2e8f0' }}></div>
              <span>Veri yok</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: '#65a30d' }}></div>
              <span>Düşük</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: '#ca8a04' }}></div>
              <span>Orta</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: '#ea580c' }}></div>
              <span>Yüksek</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: '#dc2626' }}></div>
              <span>Çok Yüksek</span>
            </div>
          </div>
        </>
      ) : (
        <div className="h-80 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Henüz veri yok</h4>
            <p className="text-slate-600 dark:text-slate-400">Bu link için henüz coğrafi veri bulunmuyor</p>
          </div>
        </div>
      )}
    </div>
  );
}
