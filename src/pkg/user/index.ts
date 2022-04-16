import Router from 'express';

import { api } from '../../api';
import { generateRouterPaths } from '../../utils/generateRouterPaths';

const router = Router();

const { user } = api;

generateRouterPaths(user.paths, router);

export default router;
