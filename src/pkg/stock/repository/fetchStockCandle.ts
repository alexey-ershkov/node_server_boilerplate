import axios from 'axios';

import { FinnhubCandles, StockResolution } from '../../../common/models';
import { toUnixTimestamp } from '../../../utils';

const baseUrl = `https://finnhub.io/api/v1/stock/candle?`;

export const fetchStockCandle = async (
  symbol: string,
  resolution: StockResolution,
  from: number,
  to: number = toUnixTimestamp(Date.now()),
) => {
  const params = `token=${process.env.FINNHUB_KEY}&symbol=${symbol}&resolution=${resolution}&from=${from}&to=${to}`;

  const { data } = await axios.get<FinnhubCandles>(baseUrl + params);
  console.log(data);
};
