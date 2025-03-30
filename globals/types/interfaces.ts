import { ManageResponse } from "../classes"

export type T_UpdateDataWithoutTrashed = () => Promise<boolean>
export type T_ManageWriteJSONError = (mr: ManageResponse, collection: Array<any>, file_name?: string) => Promise<boolean>
export type T_manageResponseData = (mr: ManageResponse, status: boolean, data: Array<any>) => boolean
export type T_ManagePromiseError = (fun: Function, mr: ManageResponse, type: string) => Promise<boolean>
export type T_CheckIfExistModel = (cM: Array<any>, row: number, mr: ManageResponse, visible?: boolean | null) => Promise<any>
export type T_SearchId = (data: Array<any>, mr: ManageResponse, id: number, with_all?: boolean | null) => any