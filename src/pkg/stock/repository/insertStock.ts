import { Stock } from '../../../common/models';
import { pool } from '../../../database/pool';
import { logger } from '../../../utils';
import { selectStockBySymbol } from './selectStock';

const insertQuery =
  'insert into stocks (symbol, name, logo, website, country, exchange, ipo, market_capitalization, ' +
  'phone, share_outstanding, industry)  values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)';

interface InsertStockReturn {
  exists: boolean;
  error: boolean;
}

export const insertStock = async (stock: Stock): Promise<InsertStockReturn> => {
  const dbStock = await selectStockBySymbol(stock.symbol);
  if (dbStock) {
    return { error: false, exists: true };
  }
  try {
    await pool.query(insertQuery, [
      stock.symbol,
      stock.name,
      stock.logo,
      stock.website,
      stock.country,
      stock.exchange,
      stock.ipo,
      stock.marketCapitalization,
      stock.phone,
      stock.shareOutstanding,
      stock.industry,
    ]);
    return { error: false, exists: false };
  } catch (e) {
    logger.error(`Stock insert into DB error: ${e.message}`);
    return { error: true, exists: false };
  }
};
