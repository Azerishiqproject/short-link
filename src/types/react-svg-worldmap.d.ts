declare module 'react-svg-worldmap' {
  import * as React from 'react';

  export interface WorldMapDatum {
    country: string; // ISO2 code
    value: number;
  }

  export interface WorldMapProps {
    data: WorldMapDatum[];
    size?: 'responsive' | number;
    color?: string;
    valueSuffix?: string;
    style?: React.CSSProperties;
    tooltipTextFunction?: (countryName: string, isoCode: string, value: number) => string;
    backgroundColor?: string;
  }

  export default class WorldMap extends React.Component<WorldMapProps> {}
}


