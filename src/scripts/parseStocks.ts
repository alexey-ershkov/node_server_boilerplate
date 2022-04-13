import { getStocksFromRemote } from '../pkg/stock/usecase/getStocks';
import { logger } from '../utils/logger';

const symbols = ['AAPL', 'IBM', 'dfsafksladgk'];
const success = getStocksFromRemote(symbols);

if (success) {
  logger.info('Stocks parse successfully');
} else {
  logger.error('Failed to parse stocks');
}
