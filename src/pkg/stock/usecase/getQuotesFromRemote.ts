import axios from 'axios';
import { formatISO } from 'date-fns';
import dotenv from 'dotenv';

import { FinnhubQuote, Quote } from '../../../common/models';
import { logger } from '../../../utils';
import { insertQuote, updateQuote } from '../repository/insertQuote';

dotenv.config();

const baseUrl = `https://finnhub.io/api/v1/quote?token=${process.env.FINNHUB_KEY}&symbol=`;

export const getQuotesFromRemote = async (symbol: string): Promise<boolean> => {
  try {
    const { data } = await axios.get<FinnhubQuote>(baseUrl + symbol);
    if (data.dp) {
      const quote: Quote = {
        symbol,
        high: data.h,
        low: data.l,
        currentPrice: data.c,
        percentChange: data.dp,
        prevClose: data.pc,
        updatedAt: formatISO(data.t * 1000),
        change: data.c,
        open: data.o,
      };

      const ok = await insertQuote(quote);
      if (!ok) {
        const updOk = await updateQuote(quote);
        if (!updOk) {
          return false;
        }
      }
    }
  } catch (e) {
    logger.error(`Error while quote ${symbol} req: ${e.message}`);
    return false;
  }

  return true;
};
