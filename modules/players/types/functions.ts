import { Request } from "express"
import { ManageResponse } from "../../../globals/classes"
import { T_Model } from "./model"

export type T_UpdateDataWithoutTrashed = () => Promise<boolean>

export type T_DefaultControllerFunction = (req: Request, mr: ManageResponse) => Promise<any>
export type T_DefaultControllerFunctionWithRow = (req: Request, mr: ManageResponse, row: T_Model) => Promise<boolean>
