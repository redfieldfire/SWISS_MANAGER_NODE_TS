import { Request } from "express"
import { ManageResponse } from "../../../globals/classes"
import { T_CollectionModel, T_Model } from "./models"

export type T_UpdateDataWithoutTrashed = () => Promise<boolean>
export type T_ManageWriteJSONError = (mr: ManageResponse, collection: T_CollectionModel, file_name?: string) => Promise<boolean>
export type T_manageResponseData = (mr: ManageResponse, status: boolean, data: Array<any>) => boolean

export type T_DefaultControllerFunction = (req: Request, mr: ManageResponse) => Promise<any>
export type T_DefaultControllerFunctionWithRow = (req: Request, mr: ManageResponse, row: T_Model) => Promise<boolean>
export type T_ManagePromiseError = (fun: Function, mr: ManageResponse, type: string) => Promise<boolean>
export type T_CheckIfExistModel = (cM: T_CollectionModel, row: number, mr: ManageResponse, visible?: boolean | null) => Promise<any>
export type T_SearchId = (data: Array<any>, mr: ManageResponse, id: number, with_all?: boolean | null) => any