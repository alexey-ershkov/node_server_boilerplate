import axios from 'axios';
import dotenv from 'dotenv';
import type { Request, Response } from 'express';
import { isEmpty } from 'lodash';

import { AppResponse, FinnhubStock, Quote, Stock } from '../../../common/models';
import { decamelize } from '../../../common/utils/transforms';
import { getCookieUserId, logger } from '../../../utils';
import { selectUserStockBySymbolAndId } from '../../user/repository';
import { insertStock, selectAllStocks, selectStockBySymbol } from '../repository';

dotenv.config();
const baseUrl = `https://finnhub.io/api/v1/stock/profile2?token=${process.env.FINNHUB_KEY}&symbol=`;

export const getStocksFromRemote = async (symbol: string): Promise<boolean> => {
  try {
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
        logger.error(`Error when insert stock with symbol ${symbol}`);
        return false;
      }
    }
  } catch (e) {
    logger.error(`Error while stock ${symbol} req: ${e.message}`);
    return false;
  }

  return true;
};

export const getAllStocks = async (req: Request, resp: Response) => {
  const allStocks = await selectAllStocks();
  resp.send(<AppResponse<(Stock & Quote)[]>>{
    data: decamelize(allStocks),
  });
};

export const getStockBySymbol = async (req: Request<{ symbol?: string }>, resp: Response) => {
  if (req.params.symbol) {
    const userId = getCookieUserId(req);

    if (!userId) {
      const stock = await selectStockBySymbol(req.params.symbol);
      if (!stock) {
        return resp.status(404).send(<AppResponse<never>>{
          errors: [`Stock with symbol ${req.params.symbol} not found`],
        });
      }

      return resp.send(<AppResponse<Stock & Quote>>{
        data: decamelize(stock),
      });
    }

    if (req.params.symbol) {
      const userStock = await selectUserStockBySymbolAndId(req.params.symbol, userId);
      if (!userStock) {
        const stock = (await selectStockBySymbol(req.params.symbol)) as Stock &
          Quote & { count: number };
        if (!stock) {
          return resp.status(404).send(<AppResponse<never>>{
            errors: [`Stock with symbol ${req.params.symbol} not found`],
          });
        }

        stock.count = 0;
        return resp.send(<AppResponse<Stock & Quote & { count: number }>>{
          data: decamelize(stock),
        });
      }

      return resp.send(<AppResponse<Stock & { count: number }>>{
        data: decamelize(userStock),
      });
    }
  }

  return resp.status(400).send(<AppResponse<never>>{
    errors: ['Invalid request'],
  });
};
