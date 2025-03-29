import { T_CollectionModel } from "./models";

//---------------------------------------- FUNCTIONS

export type T_getJSON = (file_name?: string) => Promise<T_CollectionModel>
export type T_WriteJSON = (rows: T_CollectionModel, file_name?: string) => Promise<boolean>
export type T_GetIndexes = () => Promise<Array<string>>