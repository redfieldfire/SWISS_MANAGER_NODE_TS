import { Response, Router } from "express"
import { T_RequestResponse } from "./requests"
import { ManageResponse } from "../classes"
import { T_GenericAsyncController } from "./classes"

export type T_SetResponse = () => T_RequestResponse
export type T_ValidateRequest = (request: any, validator: any, res: Response) => ManageResponse

export type T_ResetTempData = () => void
export type T_LogError = (error: string) => Promise<boolean>

export type T_initReturnFunction = (module_path: string, module: string) => Promise<any>
export type T_InitFiles = (fun: T_initReturnFunction, folder: string, file: string) => void
export type T_InitGLOBALS = () => void
export type T_InitROUTES = (fun: T_initReturnFunction) => void

export type T_CreateBasicRoutes = (router: Router, add: T_GenericAsyncController, get: T_GenericAsyncController, getAll: T_GenericAsyncController, update: T_GenericAsyncController, disable: T_GenericAsyncController, enable: T_GenericAsyncController) => void