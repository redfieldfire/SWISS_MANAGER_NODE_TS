import express from 'express'
import { init } from './init'

const app = express();
const cors = require('cors');

app.use(express.json());
app.use(cors())

const PORT: number = 3000;

init(async (module_path, module) => { 
    const router = await import(module_path);
    app.use(`/${module}`, router.default)
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
