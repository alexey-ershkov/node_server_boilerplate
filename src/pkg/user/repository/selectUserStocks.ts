import { Stock } from '../../../common/models';
import { camelize } from '../../../common/utils/transforms';
import { pool } from '../../../database/pool';

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
    return null;
  }

  const { rows } = await pool.query(selectByIdQuery, [userId]);
  return camelize(rows) as (Stock & { count: number })[];
};

export const selectUserStockCountBySymbolAndId = async (
  symbol: string,
  userId: number | undefined,
): Promise<number | null> => {
  if (!userId) {
    return null;
  }
  const { rows, rowCount } = await pool.query(selectUserStockCountBySymbolAndIdQuery, [
    userId,
    symbol,
  ]);
  return rowCount ? rows[0].count : null;
};
