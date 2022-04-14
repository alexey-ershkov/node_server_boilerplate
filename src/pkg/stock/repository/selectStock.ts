import { Stock } from '../../../common/models';
import { camelize } from '../../../common/utils/transforms';
import { pool } from '../../../database/pool';

const baseQuery =
  'select symbol, name, logo, website, country, exchange, ipo, market_capitalization, phone, share_outstanding, industry from stocks';
const selectBySymbol = `${baseQuery} where symbol = $1`;

export const selectStockBySymbol = async (symbol: string): Promise<Stock | null> => {
  const { rows, rowCount } = await pool.query(selectBySymbol, [symbol]);
  return rowCount ? (camelize(rows[0]) as Stock) : null;
};

export const selectAllStocks = async (): Promise<Stock[]> => {
  const { rows } = await pool.query(baseQuery);
  return camelize(rows) as Stock[];
};
