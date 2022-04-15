export interface Stock {
  symbol: string;
  name: string;
  logo: string;
  website: string;
  country: string;
  currency: string;
  exchange: string;
  ipo: string;
  marketCapitalization: number;
  phone: string;
  shareOutstanding: number;
  industry: string;
}

export interface Quote {
  symbol: string;
  currentPrice: number;
  change: number;
  percentChange: number;
  high: number;
  low: number;
  open: number;
  prevClose: number;
  updatedAt: string;
}

export interface StockCandle {
  close: number;
  open: number;
  high: number;
  low: number;
  time: number;
  value: number;
}

export type StockResolution = '1' | '5' | '15' | '30' | '60' | 'D' | 'W' | 'M';

export type StockCandleQuery = {
  symbols: string;
  resolution?: StockResolution;
  timeFrom?: string;
  timeTo?: string;
};

export type StockCandleResponse = {
  symbol: string;
  candles: StockCandle[] | 'Data not found';
};

export type FinnhubStock = Omit<Stock, 'symbol' | 'website' | 'industry'> & {
  ticker: string;
  weburl: string;
  finnhubIndustry: string;
};
export type FinnhubCandles = {
  c: number[];
  h: number[];
  l: number[];
  o: number[];
  s: 'ok' | 'no_data';
  t: number[];
  v: number[];
};

export type FinnhubQuote = {
  c: number;
  d: number;
  dp: number;
  h: number;
  l: number;
  o: number;
  pc: number;
  t: number;
};
