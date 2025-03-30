export type T_getJSON = (file_name?: string) => Promise<Array<object>>
export type T_WriteJSON = (rows: Array<object>, file_name?: string) => Promise<boolean>
export type T_GetIndexes = () => Promise<Array<string>>

export type T_DriverConstructor = {
    module_name: string, 
    file_path: string, 
    main_db_path_name: string, 
    index_sub_path: string, 
    main_index_path_name: string, 
    collection: T_Collection, 
    indexCollection: T_Collection
}

export type T_Collection = (rows: any) => Array<object>