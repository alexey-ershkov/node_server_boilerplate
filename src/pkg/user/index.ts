import Router from 'express';

import { authMiddleware } from '../../middlewares/auth';
import { addUserStock, userStockValidation } from './usecase/addUserStock';
import { authUser, authValidation } from './usecase/authUser';
import { createUser, createUserValidation } from './usecase/createUser';
import { getUser } from './usecase/getUser';
import { getUserStockCount, getUserStocks } from './usecase/getUserStocks';
import { removeUserStock } from './usecase/removeUserStock';

const router = Router();

router.get('/userStocks', authMiddleware, getUserStocks);
router.get('/', authMiddleware, getUser);
router.get('/userStocks/:symbol', authMiddleware, getUserStockCount);

router.post('/', createUserValidation(), createUser);
router.post('/auth', authValidation(), authUser);
router.post('/userStocks', authMiddleware, userStockValidation(), addUserStock);
router.delete('/userStocks', authMiddleware, userStockValidation(), removeUserStock);

export default router;
