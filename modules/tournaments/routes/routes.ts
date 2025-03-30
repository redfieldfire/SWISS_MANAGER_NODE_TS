import { Router, Request, Response } from 'express';

import { add, addPlayer, disable, enable, get, getAll, removePlayer, update } from '../controllers';

const router = Router();

router.get('/paginated/:page', async (req: Request, res: Response) => {
    res.json(await getAll(req, res));
});

router.get('/:id', async (req: Request, res: Response) => {
    res.json(await get(req, res));
});

router.post('/', async (req: Request, res: Response) => {
    res.json(await add(req, res))
})

router.put('/:id', async (req: Request, res: Response) => {
    res.json(await update(req, res))
})

router.put('/enable/:id', async (req: Request, res: Response) => {
    res.json(await enable(req, res))
})

router.delete('/disable/:id', async (req: Request, res: Response) => {
    res.json(await disable(req, res))
})

router.put('/:id/add-player/', async (req: Request, res: Response) => {
    res.json(await addPlayer(req, res))
})

router.put('/:id/remove-player/', async (req: Request, res: Response) => {
    res.json(await removePlayer(req, res))
})

export default router;