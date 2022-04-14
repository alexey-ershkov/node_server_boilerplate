import { pool } from '../../../database/pool';
import { logger } from '../../../utils';

const deleteQuery = 'delete from users_stock where user_id = $1 and stock_symbol = $2';

export const deleteUserStocksBySymbolAndId = async (
  symbol: string,
  userId: number,
): Promise<boolean> => {
  try {
    await pool.query(deleteQuery, [userId, symbol]);
    return true;
  } catch (e) {
    logger.error(`Error while deleting userStocks: ${e.message}`);
    return false;
  }
};
