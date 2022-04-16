import { sub } from 'date-fns';
import type { Request, Response } from 'express';
import { query, validationResult } from 'express-validator';

import { AppResponse } from '../../../common';
import { StockCandleQuery, StockCandleResponse } from '../../../common/models';
import { toUnixTimestamp } from '../../../utils';
import { fetchStockCandle } from '../repository/fetchStockCandle';

export const stockCandlesValidation = () => [
  query('symbols')
    .exists()
    .withMessage('Symbols param is required')
    .isString()
    .withMessage('Symbols param must be string'),
];

export const getStocksCandle = async (
  req: Request<any, any, any, StockCandleQuery>,
  resp: Response,
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return resp.status(400).send(<AppResponse<never>>{
      errors: errors.array(),
    });
  }

  const {
    symbols,
    resolution = '30',
    timeFrom = sub(Date.now(), { days: 7 }),
    timeTo = Date.now(),
  } = req.query;

  const symbolArray = symbols.split(',');

  const promises: Promise<StockCandleResponse>[] = [];

  symbolArray.forEach((symbol) => {
    promises.push(
      new Promise<StockCandleResponse>((res) => {
        fetchStockCandle(
          symbol,
          resolution,
          toUnixTimestamp(timeFrom),
          toUnixTimestamp(timeTo),
        ).then((candles) => res({ symbol, candles: candles || 'Data not found' }));
      }),
    );
  });

  const data = await Promise.all(promises);

  return resp.status(200).send(<AppResponse<StockCandleResponse[]>>{
    data,
  });
};
