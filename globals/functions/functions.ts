import { Request, Response } from 'express';
import { ManageResponse } from "../classes"
import { T_CreateBasicRoutes, T_InitFiles, T_InitGLOBALS, T_InitROUTES, T_LogError, T_ValidateRequest } from "../types"

import { readdir } from "fs/promises";
import { join } from "path";

const fs = require('fs');

export const validateRequest: T_ValidateRequest = (request: any, validator: any, res: Response) => {
    const mr: ManageResponse = new ManageResponse()
    mr.resetTempData()
    mr.successful = Object.keys(validator).every((key) => {
        mr.key_fails = key
        if (!(key in request)) {
            mr.message_error = `The field ${key} is required`
            return false
        }
        if (!(typeof request[key] === typeof validator[key])) {
            mr.message_error = `The field ${key} needs to be: ${typeof validator[key]}`
            return false
        }
        if (typeof request[key] == typeof "string") {
            if(!(request[key].trim().length)) {
                mr.message_error = `The field ${key} can't be empty`
                return false
            }
        }
        return true
    });
    if(mr.successful) {
       mr.data.push({})
       Object.keys(validator).forEach((key) => mr.data[0][key] = request[key])
    }
    return mr
}

export const logError: T_LogError = (error: string) => {
    return new Promise((resolve, reject) => {
        console.log("----------------------LOG ERROR CREATED!!!")
        fs.writeFile(`globals/logs/${Date.now()}_log.txt`, String(error), 'utf8', (err: Error) => err ? resolve(false) : resolve(true))
    });
}

export const initFiles: T_InitFiles = async (fun, folder, file) => {
    const base_path = join(__dirname, "../../modules");

    try {
        const modules = await readdir(base_path);
    
        for (const module of modules) {
        const module_path = join(base_path, module, folder, folder);
    
        try {
            await fun(module_path, module)
        } catch (error) {
            await logError(`Error to import the module ${module} in folder ${folder}: ${error}`)
            console.error(`Error to import the module ${module} in folder ${folder}:`, error);
        }
        }
    } catch (error) {
        await logError(`Error to read the modules: ${error}`)
        console.error("Error to read the modules:", error);
    }
}

export const initGLOBALS: T_InitGLOBALS = async () => {
    initFiles(async (module_path, module) => {
        const { updateDataWithoutTrashed } = await import(module_path);
        if (typeof updateDataWithoutTrashed === "function") {
            await updateDataWithoutTrashed();
            console.log(`GLOBALS ${module} started!`)
        }
    }, "functions", "functions.ts")
}

export const initROUTES: T_InitROUTES = async (fun) => {
    initFiles(async (module_path, module) => {
        await fun(module_path, module)
        console.log(`ROUTES ${module} started!`)
    }, "routes", "routes.ts")
}

//------------------------------------------------------ CREATE BASIC ROUTES

export const createBasicRoutes: T_CreateBasicRoutes = (router, add, get, getAll, update, disable, enable) => {
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
}