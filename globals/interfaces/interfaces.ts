import { T_CheckIfExistModel, T_Collection, T_getJSON, T_ManagePromiseError, T_manageResponseData, T_ManageWriteJSONError, T_ResetTempData, T_SearchId, T_SetResponse, T_UpdateDataWithoutTrashed, T_WriteJSON } from "../types"

export interface I_Response {
    key_fails: string
    message_error: string | null
    successful: boolean
    data: Array<any>
    resetTempData: T_ResetTempData
    getResponse: T_SetResponse
}

export interface I_HelperController {
    module_name: string
    module_data_json: string
    has_multiple_files: boolean
    collection: Function,
    indexCollection: Function,
    getJSON: Function,
    getIndexJSON: Function,
    writeJSON: Function,
    updateDataWithoutTrashed: T_UpdateDataWithoutTrashed
    manageWriteJSONError: T_ManageWriteJSONError
    manageResponseData: T_manageResponseData
    managePromiseError: T_ManagePromiseError
    checkIfExistsModel: T_CheckIfExistModel
    searchId: T_SearchId
}

export interface I_Driver {
    module_name: string
    file_path: string
    main_db_path_name: string
    index_sub_path: string
    main_index_path_name: string
    collection: T_Collection
    indexCollection: T_Collection
    getJSON: T_getJSON
    writeJSON: T_WriteJSON
    getIndexJSON: T_getJSON
}