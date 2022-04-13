import Router from 'express';

import { authMiddleware } from '../../middlewares/auth';
import { addUserStock, addUserStockValidation } from './usecase/addUserStock';
import { authUser, authValidation } from './usecase/authUser';
import { createUser, createUserValidation } from './usecase/createUser';
import { getUser } from './usecase/getUser';
import { getUserStocks } from './usecase/getUserStocks';

const router = Router();

router.get('/userStocks', authMiddleware, getUserStocks);
router.get('/', authMiddleware, getUser);

router.post('/', createUserValidation(), createUser);
router.post('/auth', authValidation(), authUser);
router.post('/addStock', authMiddleware, addUserStockValidation(), addUserStock);

export default router;
