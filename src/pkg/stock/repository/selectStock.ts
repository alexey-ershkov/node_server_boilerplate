import { pool } from '../../../database/pool';
import { Stock } from '../../../models/Stock';
import { camelize } from '../../../utils/transforms';

const baseQuery =
  'select symbol, name, logo, website, country, exchange, ipo, market_capitalization, phone, share_outstanding, industry from stocks';
const selectBySymbol = `${baseQuery} where symbol = $1`;

export const selectStockBySymbol = async (symbol: string): Promise<Stock | null> => {
  const { rows, rowCount } = await pool.query(selectBySymbol, [symbol]);
  return Promise.resolve(rowCount ? (camelize(rows[0]) as Stock) : null);
};

export const selectAllStocks = async (): Promise<Stock[]> => {
  const { rows } = await pool.query(baseQuery);
  return Promise.resolve(camelize(rows) as Stock[]);
};
