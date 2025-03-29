import { FILE_PATH, INDEX_SUB_PATH, MAIN_DB_PATH_NAME, MAIN_INDEX_PATH_NAME, MODULE_NAME } from '../../config';
import { collection, indexCollection } from '../models/models';
import { T_CollectionIndexModel, T_CollectionModel, T_GetIndexes, T_getJSON, T_WriteJSON} from "../../types";
import { indexModelStructure, modelStructure } from '../structures';
import { logError } from '../../../../globals';

const fs = require('fs');

export const getJSON: T_getJSON = async (file_name) => {
    return new Promise(async (resolve, reject) => {
        const path = `${FILE_PATH}${file_name ? file_name : MAIN_DB_PATH_NAME}`
        try {
            const data = fs.readFileSync(path, 'utf8')
            const response: T_CollectionModel = collection(JSON.parse(data))
            resolve(response)
        } catch (error: any) {
            await logError(`Error DRIVER ${MODULE_NAME} getJSON route ${path}: ${error}`)
            console.error(`Error DRIVER ${MODULE_NAME} getJSON route ${path}: ${error}`)
            reject([])
        }
    })
}

export const writeJSON: T_WriteJSON = (rows, file_name) => {
    return new Promise(async (resolve, reject) => {
        const path = `${FILE_PATH}${file_name ? file_name : MAIN_DB_PATH_NAME}`
        fs.writeFile(path, JSON.stringify(rows, null, 2), 'utf8', (error: Error) => {
            if (error) {
                logError(`Error DRIVER ${MODULE_NAME} writeJSON route ${path}: ${error}`)
                console.error(`Error DRIVER ${MODULE_NAME} writeJSON route ${path}: ${error}`)
                reject(false) 
            }
            resolve(true)
        });
    });
}

export const getIndexJSON: T_getJSON = async () => {
    return new Promise(async (resolve, reject) => {
        const path = `${FILE_PATH}${INDEX_SUB_PATH}${MAIN_INDEX_PATH_NAME}`
        try {
            const data = fs.readFileSync(path, 'utf8')
            const response: T_CollectionIndexModel = indexCollection(JSON.parse(data))
            resolve(response)
        } catch (error: any) {
            await logError(`Error DRIVER ${MODULE_NAME} getIndexJSON route ${path}: ${error}`)
            console.error(`Error DRIVER ${MODULE_NAME} getIndexJSON route ${path}: ${error}`)
            reject([])
        }
    })
}