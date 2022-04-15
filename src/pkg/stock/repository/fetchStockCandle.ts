import axios from 'axios';

import { FinnhubCandles, StockCandle, StockResolution } from '../../../common/models';
import { logger } from '../../../utils';
import { finnhubToStockCandles } from '../../../utils/finnhubToStockCandles';

const baseUrl = `https://finnhub.io/api/v1/stock/candle?`;

export const fetchStockCandle = async (
  symbol: string,
  resolution: StockResolution,
  from: number,
  to: number,
): Promise<StockCandle[] | null> => {
  const params = `token=${process.env.FINNHUB_KEY}&symbol=${symbol}&resolution=${resolution}&from=${from}&to=${to}`;

  try {
    const { data } = await axios.get<FinnhubCandles>(baseUrl + params);
    if (data.s === 'no_data') {
      return null;
    }
    return finnhubToStockCandles(data);
  } catch (e) {
    logger.error(
      `Error while req for candles symbol ${symbol}, res ${resolution} from ${from} to ${to}`,
    );
  }

  return null;
};
