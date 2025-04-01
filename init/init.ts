import { initGLOBALS, initROUTES, logError, T_Constructor } from "../globals";

export const init: T_Constructor = async (routes_fun) => {
    try {
        initGLOBALS()
        initROUTES(routes_fun)
    }
    catch (error: any) {
        await logError(`Error in init: ${error}`)
        console.error(`Error in init: ${error}`)
    }
}