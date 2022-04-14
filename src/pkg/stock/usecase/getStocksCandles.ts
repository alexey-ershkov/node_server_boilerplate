import type { Request, Response } from 'express';

import { toUnixTimestamp } from '../../../utils';
import { fetchStockCandle } from '../repository/fetchStockCandle';

export const getStocksCandles = async (req: Request, resp: Response) => {
  await fetchStockCandle('AAPL', 'W', toUnixTimestamp('2022-03-01'));
  return resp.sendStatus(200);
};
