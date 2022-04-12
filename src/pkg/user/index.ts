import Router from 'express';

import { authUser, authValidation } from './usecase/authUser';
import { createUser, createUserValidation } from './usecase/createUser';
import { getUser } from './usecase/getUser';

const router = Router();

router.get('/', getUser);
router.post('/', createUserValidation(), createUser);
router.post('/auth', authValidation(), authUser);

export default router;
