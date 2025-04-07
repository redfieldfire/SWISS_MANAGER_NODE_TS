import { BasicModel, Helpers } from "../classes"
import { Driver } from "../driver"
import { T_GetCollection, T_GetCollectionIndex, T_CheckIfExistModel, T_GetJSON, T_ManagePromiseError, T_manageResponseData, T_ManageWriteJSONError, T_ResetTempData, T_SearchId, T_SetResponse, T_UpdateDataWithoutTrashed, T_WriteJSON, T_GenericAsyncController, T_DefaultControllerFunction, T_DefaultControllerFunctionWithRow, T_Request, T_GetResource, T_BasicModelFunctionFind, T_BasicModelFunctionGet, T_BasicModelFunctionCreate, T_BasicModelFunctionUpdate, T_BasicModelFunctionEnable, T_BasicModelFunctionDisable, T_Collection, T_CollectionIndex, T_Model, T_IndexModel, T_TransformCollection, T_TransformResource, T_TransformIndexResource, freeObject, T_Save, T_BasicModelFunctionFindWithTrashed } from "../types"

export interface I_BasicModel {
    Main: any
    Index: any
    module_name: string, 
    module_data_json: string, 
    index_sub_path: string, 
    main_index_path_name: string, 
    has_multiple_files: boolean, 
    model_structure: T_Model, 
    index_model_structure: T_IndexModel, 
    resource: T_GetResource, 
    collection: T_GetCollection, 
    indexCollection: T_GetCollectionIndex, 
    transformCollection: T_TransformCollection, 
    transformResource: T_TransformResource, 
    transformIndexResource: T_TransformIndexResource, 
    helpers: Helpers, 
    driver: Driver

    find: T_BasicModelFunctionFind
    findWithTrashed: T_BasicModelFunctionFindWithTrashed
    get: T_BasicModelFunctionGet
    create: T_BasicModelFunctionCreate
    update: T_BasicModelFunctionUpdate
    enable: T_BasicModelFunctionEnable
    disable: T_BasicModelFunctionDisable
}

export interface I_BasicDirectModel {
    BM: BasicModel,
    model: Function,
    resource: Function,
    save: T_Save
}
export interface I_Response {
    key_fails: string
    message_error: string | null
    successful: boolean
    data: Array<any>
    resetTempData: T_ResetTempData
    getResponse: T_SetResponse
}

export interface I_Driver {
    module_name: string
    file_path: string
    main_db_path_name: string
    index_sub_path: string
    main_index_path_name: string
    collection: T_GetCollection
    indexCollection: T_GetCollectionIndex
    getJSON: T_GetJSON
    writeJSON: T_WriteJSON
    getIndexJSON: T_GetJSON
}

export interface I_HelperController {
    module_name: string
    module_data_json: string
    has_multiple_files: boolean
    collection: T_Collection,
    indexCollection: T_CollectionIndex,
    getJSON: T_GetJSON,
    getIndexJSON: T_GetJSON,
    writeJSON: T_WriteJSON,
    updateDataWithoutTrashed: T_UpdateDataWithoutTrashed
    manageWriteJSONError: T_ManageWriteJSONError
    manageResponseData: T_manageResponseData
    managePromiseError: T_ManagePromiseError
    checkIfExistsModel: T_CheckIfExistModel
    searchId: T_SearchId
}

export interface I_BasicControllers {
    modelRequest: T_Request
    getModel: T_DefaultControllerFunction
    getCollection: T_DefaultControllerFunction
    addModel: T_DefaultControllerFunctionWithRow
    updateModel: T_DefaultControllerFunctionWithRow
    disableModel: T_DefaultControllerFunction
    enableModel: T_DefaultControllerFunction
    getAll: T_GenericAsyncController
    get: T_GenericAsyncController
    add: T_GenericAsyncController
    update: T_GenericAsyncController
    enable: T_GenericAsyncController
    disable: T_GenericAsyncController
}

export interface I_BasicControllerFunctions {
    BM: BasicModel,
    helpers: Helpers
    getModel: T_DefaultControllerFunction
    getCollection: T_DefaultControllerFunction
    addModel: T_DefaultControllerFunctionWithRow
    updateModel: T_DefaultControllerFunctionWithRow
    disableModel: T_DefaultControllerFunction
    enableModel: T_DefaultControllerFunction

    getModelExtraFunction: Function
    getCollectionExtraFunction: Function
    addModelExtraFunction: Function
    updateModelExtraFunction: Function
    disableModeExtraFunction: Function
    enableModelExtraFunction: Function
}