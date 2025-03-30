import { logError } from "../functions";
import { I_Driver } from "../interfaces";
import { T_DriverConstructor, T_getJSON, T_WriteJSON } from "../types";

const fs = require('fs');

export class Driver implements I_Driver {

    module_name = ""
    file_path = ""
    main_db_path_name = ""
    index_sub_path = ""
    main_index_path_name = ""
    collection
    indexCollection

    constructor({module_name, file_path, main_db_path_name, index_sub_path, main_index_path_name, collection, indexCollection}: T_DriverConstructor){
        this.module_name = module_name
        this.file_path = file_path
        this.main_db_path_name = main_db_path_name
        this.index_sub_path = index_sub_path
        this.main_index_path_name = main_index_path_name
        this.collection = collection
        this.indexCollection = indexCollection
    }

    getJSON: T_getJSON = async (file_name) => {
        return new Promise(async (resolve, reject) => {
            const path = `${this.file_path}${file_name ? file_name : this.main_db_path_name}`
            try {
                const data = fs.readFileSync(path, 'utf8')
                const response = this.collection(JSON.parse(data))
                resolve(response)
            } catch (error: any) {
                await logError(`Error DRIVER ${this.module_name} getJSON route ${path}: ${error}`)
                console.error(`Error DRIVER ${this.module_name} getJSON route ${path}: ${error}`)
                reject([])
            }
        })
    }
    
    writeJSON: T_WriteJSON = (rows, file_name) => {
        return new Promise(async (resolve, reject) => {
            const path = `${this.file_path}${file_name ? file_name : this.main_db_path_name}`
            fs.writeFile(path, JSON.stringify(rows, null, 2), 'utf8', (error: Error) => {
                if (error) {
                    logError(`Error DRIVER ${this.module_name} writeJSON route ${path}: ${error}`)
                    console.error(`Error DRIVER ${this.module_name} writeJSON route ${path}: ${error}`)
                    reject(false) 
                }
                resolve(true)
            });
        });
    }
    
    getIndexJSON: T_getJSON = async () => {
        return new Promise(async (resolve, reject) => {
            const path = `${this.file_path}${this.index_sub_path}${this.main_index_path_name}`
            try {
                const data = fs.readFileSync(path, 'utf8')
                const response = this.indexCollection(JSON.parse(data))
                resolve(response)
            } catch (error: any) {
                await logError(`Error DRIVER ${this.module_name} getIndexJSON route ${path}: ${error}`)
                console.error(`Error DRIVER ${this.module_name} getIndexJSON route ${path}: ${error}`)
                reject([])
            }
        })
    }
}