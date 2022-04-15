import { FinnhubCandles } from '../common';
import { StockCandle } from '../common/models';

export const finnhubToStockCandles = (finnhubCandles: FinnhubCandles): StockCandle[] => {
  const len = finnhubCandles.t.length;
  const res: StockCandle[] = [];

  for (let i = 0; i < len; i += 1) {
    res.push({
      close: finnhubCandles.c[i],
      low: finnhubCandles.l[i],
      high: finnhubCandles.h[i],
      open: finnhubCandles.o[i],
      time: finnhubCandles.t[i],
      value: finnhubCandles.v[i],
    });
  }

  return res;
};
