import Router from 'express';

import { createUser, userValidation } from './controllers/createUser';
import { getUser } from './controllers/getUser';

const router = Router();

router.get('/', getUser);
router.post('/', userValidation(), createUser);

export default router;
