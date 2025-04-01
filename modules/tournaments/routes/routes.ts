import { Request, Response, Router } from 'express';
import { add, addPlayer, disable, enable, get, getAll, update } from '../controllers';
import { createBasicRoutes } from '../../../globals';

const router = Router();

createBasicRoutes(router, add, get, getAll, update, disable, enable)

router.put('/:id/add-player', async (req: Request, res: Response) => {
    res.json(await addPlayer(req, res))
})

export default router;