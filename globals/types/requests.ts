import { Response } from "express"
import { ManageResponse } from "../classes"

export const modelRequestResponse = {
    successful: true,
    message: "",
    data: [{}]
}

export type T_RequestResponse = typeof modelRequestResponse

export type T_Request = (row: any, res: Response) => ManageResponse
