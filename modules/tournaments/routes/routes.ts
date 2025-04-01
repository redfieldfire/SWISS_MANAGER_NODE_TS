import { Router } from 'express';
import { add, disable, enable, get, getAll, update } from '../controllers';
import { createBasicRoutes } from '../../../globals';

const router = Router();

createBasicRoutes(router, add, get, getAll, update, disable, enable)

export default router;