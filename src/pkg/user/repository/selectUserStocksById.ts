import { pool } from '../../../database/pool';
import { Stock } from '../../../models/Stock';
import { camelize } from '../../../utils/transforms';

const baseQuery =
  'select count, symbol, name, logo, website, country, ' +
  'exchange, ipo, market_capitalization, phone, ' +
  'share_outstanding, industry from users_stock ' +
  'join stocks s on s.symbol = users_stock.stock_symbol';
const selectByIdQuery = `${baseQuery} where user_id = $1`;

export const selectUserStocksById = async (
  id: number | undefined,
): Promise<(Stock & { count: number })[]> => {
  if (!id) {
    return Promise.resolve(null);
  }

  const { rows } = await pool.query(selectByIdQuery, [id]);
  return Promise.resolve(camelize(rows) as (Stock & { count: number })[]);
};
