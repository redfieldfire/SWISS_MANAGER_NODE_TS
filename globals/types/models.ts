import { Helpers } from "../classes"
import { Driver } from "../driver"
import { T_RequestResponse } from "./requests"

export type freeObject = {[index: string]: any}

//---------------------------------------- MODELS

export type T_Model = freeObject
export type T_CollectionModel = Array<T_Model>
export type T_IndexModel = freeObject
export type T_CollectionIndexModel = Array<T_IndexModel>

//---------------------------------------- MODEL TRANSFORM

export type T_GetResource = (row: T_Model) => T_Model
export type T_GetCollection = (rows: T_CollectionModel) => T_CollectionModel
export type T_GetIndexResource = (row: T_IndexModel) => T_IndexModel
export type T_GetCollectionIndex = (row: T_CollectionIndexModel) => T_CollectionIndexModel

//---------------------------------------- COPIES FROM MODULES

export type T_Resource = (row: T_Model) => T_Model
export type T_Collection = (rows: T_CollectionModel) => T_CollectionModel
export type T_IndexResource = (row: T_IndexModel) => T_IndexModel
export type T_CollectionIndex = (row: T_CollectionIndexModel) => T_CollectionIndexModel

//---------------------------------------- TRANSFORMERS CLASSES

export type T_TransformResource = (row: T_Model) => object
export type T_TransformCollection = (rows: T_CollectionModel) => Array<object>
export type T_TransformIndexResource = (row: T_IndexModel) => object
export type T_TransformCollectionIndex = (rows: T_CollectionIndexModel) => Array<object>

//---------------------------------------- BASIC MODEL FUNCTIONS

export type T_BasicModelFunctionFind = (id: number, search_all?: boolean | null, extraFunction?: Function) => Promise<T_RequestResponse>
export type T_BasicModelFunctionGet = (page: number, extraFunction?: Function) => Promise<T_RequestResponse>
export type T_BasicModelFunctionCreate = (row: T_Model, extraFunction?: Function) => Promise<T_RequestResponse>
export type T_BasicModelFunctionUpdate = (id: number, row: T_Model, extraFunction?: Function) => Promise<T_RequestResponse>
export type T_BasicModelFunctionEnable = (id: number, extraFunction?: Function) => Promise<T_RequestResponse>
export type T_BasicModelFunctionDisable = (id: number, extraFunction?: Function) => Promise<T_RequestResponse>

export type T_BasicModelConstructor = {
    Main: any
    Index: any
    module_name: string, 
    module_data_json: string, 
    index_sub_path: string, 
    file_path: string,
    main_db_path_name: string,
    main_index_path_name: string, 
    has_multiple_files: boolean, 
    model_structure: T_Model, 
    index_model_structure: T_IndexModel, 
}