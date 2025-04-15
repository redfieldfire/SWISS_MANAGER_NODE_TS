import { Request, Response, Router } from 'express'
import multer from 'multer'
import path from 'path'
import { add, disable, enable, get, getAll, update, uploadImage } from '../controllers'
import { createBasicRoutes } from '../../../globals'

const router = Router()

createBasicRoutes(router, add, get, getAll, update, disable, enable)


//------------------------------------------------------------------------------FOR UPLOAD A FILE (IMAGE)

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

router.post('/image', upload.single('image'), async (req: Request, res: Response) => {
    res.json(await uploadImage(req, res))
});

export default router;