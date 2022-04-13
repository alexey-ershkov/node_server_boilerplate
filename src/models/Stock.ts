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

export type FinnhubStock = Omit<Stock, 'symbol' | 'website' | 'industry'> & {
  ticker: string;
  weburl: string;
  finnhubIndustry: string;
};
