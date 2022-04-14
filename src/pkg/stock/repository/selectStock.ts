import { Quote, Stock } from '../../../common/models';
import { camelize } from '../../../common/utils/transforms';
import { pool } from '../../../database/pool';

const baseQuery =
  'select stocks.symbol as symbol, name, logo, description, website, country, ' +
  'exchange, ipo, market_capitalization, phone, share_outstanding, industry, ' +
  'current_price, change, percent_change, high, low, open, prev_close, updated_at ' +
  'from stocks join quote q on stocks.symbol = q.symbol';
const selectBySymbol = `${baseQuery} where stocks.symbol = $1`;

export const selectStockBySymbol = async (symbol: string): Promise<(Stock & Quote) | null> => {
  const { rows, rowCount } = await pool.query(selectBySymbol, [symbol]);
  return rowCount ? (camelize(rows[0]) as Stock & Quote) : null;
};

export const selectAllStocks = async (): Promise<(Stock & Quote)[]> => {
  const { rows } = await pool.query(baseQuery);
  return camelize(rows) as (Stock & Quote)[];
};
