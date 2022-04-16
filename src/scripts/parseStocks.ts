import dotenv from 'dotenv';

import { getStocksFromRemote } from '../pkg/stock/usecase';
import { logger } from '../utils';

dotenv.config();

const symbols = process.env.SYMBOLS.split(',');
let success = true;

symbols.forEach((symbol) => {
  getStocksFromRemote(symbol).then((res) => {
    if (!res) {
      success = false;
    }
  });
});

if (success) {
  logger.info('Stocks parse successfully');
} else {
  logger.error('Failed to parse stocks');
}
