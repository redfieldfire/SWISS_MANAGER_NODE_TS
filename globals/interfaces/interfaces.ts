import { T_ResetTempData, T_SetResponse } from "../types"

export interface I_Response {
    key_fails: string
    message_error: string | null
    successful: boolean
    data: Array<any>
    resetTempData: T_ResetTempData
    getResponse: T_SetResponse
}