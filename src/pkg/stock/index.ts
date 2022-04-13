import Router from 'express';

import { getAllStocks, getStockBySymbol } from './usecase/getStocks';

const router = Router();

router.get('/stocks', getAllStocks);
router.get('/stocks/:symbol', getStockBySymbol);

export default router;
