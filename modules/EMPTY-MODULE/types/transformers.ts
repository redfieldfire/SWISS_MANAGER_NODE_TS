import { Index, Main } from "../classes"
import { T_CollectionIndexModel, T_CollectionModel, T_IndexModel, T_Model } from "./models"

//----------------------------------------  TRANFORM

export type T_TransformResource = (row: T_Model) => Main
export type T_TransformCollection = (rows: T_CollectionModel) => Array<Main>

export type T_TransformIndexResource = (row: T_IndexModel) => Index
export type T_TransformCollectionIndex = (rows: T_CollectionIndexModel) => Array<Index>