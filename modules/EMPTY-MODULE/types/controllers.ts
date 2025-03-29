import { Request, Response } from "express"
import { T_RequestResponse } from "../../../globals"

//---------------------------------------- CONTROLLERS 

export type T_GenericController = (req: Request, res: Response) => T_RequestResponse
export type T_GenericAsyncController = (req: Request, res: Response) => Promise<T_RequestResponse>