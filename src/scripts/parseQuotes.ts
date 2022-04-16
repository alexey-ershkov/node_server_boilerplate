import dotenv from 'dotenv';

import { getQuotesFromRemote } from '../pkg/stock/usecase/getQuotesFromRemote';
import { logger } from '../utils';

dotenv.config();

const symbols = process.env.SYMBOLS.split(',');
let success = true;

symbols.forEach((symbol) => {
  getQuotesFromRemote(symbol).then((res) => {
    if (!res) {
      success = false;
    }
  });
});

if (success) {
  logger.info('Quotes parse successfully');
} else {
  logger.error('Failed to parse stocks');
}
