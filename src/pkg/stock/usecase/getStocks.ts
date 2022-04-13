import axios from 'axios';
import dotenv from 'dotenv';
import type { Request, Response } from 'express';
import { isEmpty } from 'lodash';

import { AppResponse } from '../../../models/AppResponse';
import { FinnhubStock, Stock } from '../../../models/Stock';
import { logger } from '../../../utils/logger';
import { insertStock } from '../repository/insertStock';
import { selectAllStocks, selectStockBySymbol } from '../repository/selectStock';

dotenv.config();
const baseUrl = `https://finnhub.io/api/v1/stock/profile2?token=${process.env.FINNHUB_KEY}&symbol=`;

export const getStocksFromRemote = (symbols: string[]): boolean => {
  let success = true;

  symbols.forEach(async (symbol) => {
    const { data } = await axios.get<FinnhubStock>(baseUrl + symbol);
    if (!isEmpty(data)) {
      const { ticker, weburl, finnhubIndustry, ...rest } = data;
      const stock: Stock = {
        symbol: ticker,
        website: weburl,
        industry: finnhubIndustry,
        ...rest,
      };

      const { error, exists } = await insertStock(stock);
      if (exists) {
        logger.warn(`Stock with symbol ${symbol} already exists`);
      }
      if (error) {
        success = false;
        logger.error(`Error when insert stock with symbol ${symbol}`);
      }
    }
  });

  return success;
};

export const getAllStocks = async (req: Request, resp: Response) => {
  const allStocks = await selectAllStocks();
  resp.send(allStocks);
};

export const getStockBySymbol = async (req: Request<{ symbol?: string }>, resp: Response) => {
  if (req.params.symbol) {
    const stock = await selectStockBySymbol(req.params.symbol);
    if (!stock) {
      return resp.status(404).send(<AppResponse<never>>{
        errors: [`Stock with symbol ${req.params.symbol} not found`],
      });
    }

    return resp.send(<AppResponse<Stock>>{
      data: stock,
    });
  }

  return resp.status(400).send(<AppResponse<never>>{
    errors: ['Invalid request'],
  });
};
