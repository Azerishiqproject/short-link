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

// Ülke kodları mapping
const countryCodeMap: { [key: string]: string } = {
  'Türkiye': 'TUR',
  'Almanya': 'DEU',
  'Fransa': 'FRA',
  'İngiltere': 'GBR',
  'İtalya': 'ITA',
  'Amerika': 'USA',
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
  // Veriyi ülke kodlarına göre dönüştür
  const maxCount = Math.max(...data.map(d => d.count));
  const dataMap = data.reduce((acc, item) => {
    const countryCode = countryCodeMap[item.country];
    if (countryCode && countryCode !== 'OTHER') {
      acc[countryCode] = item.count;
    }
    return acc;
  }, {} as { [key: string]: number });

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Coğrafi Dağılım</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400">Tıklamaların dünya haritasındaki dağılımı</p>
      </div>
      
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
                  const countryCode = geo.properties.ISO_A3;
                  const count = dataMap[countryCode] || 0;
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
    </div>
  );
}
