import { Request, Response } from "express"
import { T_GetJSON, T_WriteJSON } from "./driver"
import { T_CollectionModel, T_Model, T_Collection, T_CollectionIndex } from "./models"
import { T_Request, T_RequestResponse } from "./requests"
import { BasicModel, Helpers, ManageResponse } from "../classes"

//------------------------------------------ CONSTRUCTORS

export type T_HelperConstructor = {
    module_name: string,
    module_data_json: string,
    has_multiple_files: boolean,
    collection: T_Collection,
    indexCollection: T_CollectionIndex,
    getJSON: T_GetJSON,
    getIndexJSON: T_GetJSON,
    writeJSON: T_WriteJSON
}

export type T_BasicControllersConstructor = {
    modelRequest: T_Request
    getModel: T_DefaultControllerFunction
    getCollection: T_DefaultControllerFunction
    addModel: T_DefaultControllerFunctionWithRow
    updateModel: T_DefaultControllerFunctionWithRow
    disableModel: T_DefaultControllerFunction
    enableModel: T_DefaultControllerFunction
}

export type T_BasicControllerFunctionsContructor = {
    BM: BasicModel
    getModelExtraFunction?: Function
    getCollectionExtraFunction?: Function
    addModelExtraFunction?: Function
    updateModelExtraFunction?: Function
    disableModeExtraFunction?: Function
    enableModelExtraFunction?: Function
}

//------------------------------------------ FUNCTIONS

//HELPERS
export type T_UpdateDataWithoutTrashed = () => Promise<boolean>
export type T_ManageWriteJSONError = (mr: ManageResponse, collectionModel: T_CollectionModel, file_name?: string) => Promise<boolean>
export type T_manageResponseData = (mr: ManageResponse, status: boolean, data: Array<any>) => boolean
export type T_ManagePromiseError = (fun: Function, mr: ManageResponse, type: string) => Promise<boolean>
export type T_CheckIfExistModel = (cM: Array<any>, row: number, mr: ManageResponse, visible?: boolean | null) => Promise<any>
export type T_SearchId = (data: Array<any>, mr: ManageResponse, id: number, with_all?: boolean | null) => any


//BASIC CONSTROLLERS
export type T_GenericController = (req: Request, res: Response) => T_RequestResponse
export type T_GenericAsyncController = (req: Request, res: Response) => Promise<T_RequestResponse>

//BASIC CONTROLLER FUNCTIONS
export type T_DefaultControllerFunction = (req: Request, mr: ManageResponse) => Promise<any>
export type T_DefaultControllerFunctionWithRow = (req: Request, mr: ManageResponse, row: T_Model) => Promise<boolean>