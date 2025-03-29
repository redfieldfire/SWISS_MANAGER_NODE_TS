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

router.put('/:id', async (req: Request, res: Response) => {
    res.json(await update(req, res))
})

router.put('/enable/:id', async (req: Request, res: Response) => {
    res.json(await enable(req, res))
})

router.delete('/disable/:id', async (req: Request, res: Response) => {
    res.json(await disable(req, res))
})

export default router;