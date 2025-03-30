export type T_HelperConstructor = {
    module_name: string,
    module_data_json: string,
    has_multiple_files: boolean,
    collection: Function,
    indexCollection: Function,
    getJSON: Function,
    getIndexJSON: Function,
    writeJSON: Function
}