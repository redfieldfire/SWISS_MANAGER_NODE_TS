import { Router, Request, Response } from 'express';

import { add, disable, enable, get, getAll, update } from '../controllers';

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

router.post('/:id', async (req: Request, res: Response) => {
    res.json(await update(req, res))
})

router.post('/enable/:id', async (req: Request, res: Response) => {
    res.json(await enable(req, res))
})

router.post('/disable/:id', async (req: Request, res: Response) => {
    res.json(await disable(req, res))
})

export default router;