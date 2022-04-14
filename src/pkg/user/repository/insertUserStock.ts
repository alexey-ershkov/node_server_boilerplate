import { pool } from '../../../database/pool';
import { UserStock } from '../../../models/UserStock';
import { logger } from '../../../utils/logger';

const insertQuery =
  'insert into users_stock (user_id, stock_symbol, count)  values ($1, $2, $3) on conflict (user_id,stock_symbol) ' +
  'do update set count=excluded.count + users_stock.count returning count';

export const insertUserStock = async ({
  userId,
  stockSymbol,
  count,
}: UserStock): Promise<null | number> => {
  try {
    const { rows } = await pool.query(insertQuery, [userId, stockSymbol, count]);
    return Promise.resolve(rows[0].count);
  } catch (e) {
    logger.error(`UserStock insert into DB error: ${e.message}`);
    return Promise.resolve(null);
  }
};