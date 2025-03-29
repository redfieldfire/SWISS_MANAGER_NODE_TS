import { indexModelStructure, modelStructure } from "../DB/structures"

//---------------------------------------- MODELS

export type T_Model = typeof modelStructure
export type T_CollectionModel = Array<T_Model>

export type T_IndexModel = typeof indexModelStructure
export type T_CollectionIndexModel = Array<T_IndexModel>

//---------------------------------------- MODEL TRANFORM

export type T_Resource = (row: any) => T_Model
export type T_Collection = (rows: any) => T_CollectionModel

export type T_IndexResource = (row: any) => T_IndexModel
export type T_CollectionIndex = (rows: any) => T_CollectionIndexModel
