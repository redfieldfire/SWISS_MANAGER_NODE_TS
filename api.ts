import express from 'express'
import { init } from './init'

const app = express();
app.use(express.json());

const PORT: number = 3000;

init(async (module_path, module) => { 
    const router = await import(module_path);
    app.use(`/${module}`, router.default)
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
