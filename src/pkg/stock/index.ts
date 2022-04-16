import Router from 'express';

import { api } from '../../api';
import { generateRouterPaths } from '../../utils/generateRouterPaths';

const router = Router();

const { stock } = api;

generateRouterPaths(stock.paths, router);

export default router;
