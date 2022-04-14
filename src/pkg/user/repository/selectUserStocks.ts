import { pool } from '../../../database/pool';
import { Stock } from '../../../models/Stock';
import { camelize } from '../../../utils/transforms';

const baseQuery =
  'select count, symbol, name, logo, website, country, ' +
  'exchange, ipo, market_capitalization, phone, ' +
  'share_outstanding, industry from users_stock ' +
  'join stocks s on s.symbol = users_stock.stock_symbol';
const selectByIdQuery = `${baseQuery} where user_id = $1`;

const selectUserStockCountBySymbolAndIdQuery =
  'select count from users_stock where user_id = $1 and stock_symbol = $2';

export const selectUserStocksById = async (
  userId: number | undefined,
): Promise<(Stock & { count: number })[]> => {
  if (!userId) {
    return Promise.resolve(null);
  }

  const { rows } = await pool.query(selectByIdQuery, [userId]);
  return Promise.resolve(camelize(rows) as (Stock & { count: number })[]);
};

export const selectUserStockCountBySymbolAndId = async (
  symbol: string,
  userId: number | undefined,
): Promise<number | null> => {
  if (!userId) {
    return Promise.resolve(null);
  }

  const { rows, rowCount } = await pool.query(selectUserStockCountBySymbolAndIdQuery, [userId]);
  return Promise.resolve(rowCount ? rows[0].count : null);
};
