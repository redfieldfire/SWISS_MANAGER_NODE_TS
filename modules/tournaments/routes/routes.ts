import { Request, Response, Router } from 'express';
import { add, addPlayer, addRound, disable, enable, get, getAll, getPlayer, removePlayer, update } from '../controllers';
import { createBasicRoutes } from '../../../globals';

const router = Router();

createBasicRoutes(router, add, get, getAll, update, disable, enable)

router.put('/:id/add-player', async (req: Request, res: Response) => {
    res.json(await addPlayer(req, res))
})

router.put('/:id/add-next-round', async (req: Request, res: Response) => {
    res.json(await addRound(req, res))
})

router.get('/:id/players', async (req: Request, res: Response) => {
    //res.json(await addRound(req, res))
})

router.get('/:id/players/:idplayer', async (req: Request, res: Response) => {
    res.json(await getPlayer(req, res))
})

router.put('/:id/add-next-round', async (req: Request, res: Response) => {
    res.json(await addRound(req, res))
})

export default router;