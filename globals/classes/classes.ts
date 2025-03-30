import { updateGlobal } from '../data';
import { logError } from '../functions';
import { T_CheckIfExistModel, T_HelperConstructor, T_ManagePromiseError, T_manageResponseData, T_ManageWriteJSONError, T_ResetTempData, T_SearchId, T_SetResponse, T_UpdateDataWithoutTrashed } from '../types';
import { I_HelperController, I_Response } from './../interfaces';

export class ManageResponse implements I_Response {
    key_fails = ""
    message_error: string | null = null
    successful = false
    data = [] as Array<any>
    
    constructor(successful?: boolean, message?: string, data?: Array<any>){
        if(successful) this.successful = successful
        if(message) this.message_error = message
        if(data) this.data = data
    }

    resetTempData: T_ResetTempData = () => {
        this.key_fails = ""
        this.message_error = null
        this.successful = false
        this.data = []
    }

    getResponse: T_SetResponse = () => {
        return {
            successful: this.successful,
            message: this.message_error ?? "", 
            data: this.data
        }
    }
}

export class Helpers implements I_HelperController{

    module_name = ""
    module_data_json = ""
    has_multiple_files = false
    collection
    indexCollection
    getJSON
    getIndexJSON
    writeJSON

    constructor({module_name, module_data_json, has_multiple_files, collection, indexCollection, getJSON, getIndexJSON, writeJSON}: T_HelperConstructor) {
        this.module_name = module_name
        this.module_data_json = module_data_json
        this.has_multiple_files = has_multiple_files
        this.collection = collection
        this.indexCollection = indexCollection
        this.getJSON = getJSON
        this.getIndexJSON = getIndexJSON
        this.writeJSON = writeJSON
    }

    updateDataWithoutTrashed: T_UpdateDataWithoutTrashed = async () => {
        return new Promise(async (resolve, reject) => {
            try {
                if(!this.has_multiple_files) updateGlobal(this.module_data_json, this.collection(await this.getJSON()))
                else updateGlobal(this.module_data_json, this.indexCollection(await this.getIndexJSON()))
                resolve(true)
            }
            catch(error: any) {
                logError(`Error loading GLOBAL DATA in module ${this.module_name}: ${error}`)
                console.error(`Error loading GLOBAL DATA in module ${this.module_name}: ${error}`)
                resolve(false)
            }
        })
    }
    
    manageWriteJSONError: T_ManageWriteJSONError = async (mr, collectionModel, file_name?) => {
        return new Promise(async (resolve, reject) => {
            try {
                mr.successful = await this.writeJSON(collectionModel, file_name)
                await this.updateDataWithoutTrashed()
                resolve(true)
            }
            catch (error: any) {
                mr.message_error = `Error al escribir el JSON de ${this.module_name}`
                await logError(`----${this.module_name}---- ERROR WRITTING JSON DATA: ${String(error.message)}`)
                console.log(`----${this.module_name}---- ERROR WRITTING JSON DATA: ${String(error.message)}`)
                resolve(false)
            }
        })
    }
    
    manageResponseData: T_manageResponseData = (mr, status, data) => {
        if (!status) return false
        else {
            mr.data = data
            return true
        }
    }
    
    managePromiseError: T_ManagePromiseError = async (fun, mr, type) => {
        return await new Promise(async (resolve, reject) => {
            try {
                resolve(await fun())
            }
            catch(error: any){
                mr.message_error = `Error ${type} ${this.module_name}`
                await logError(`----${this.module_name}---- ERROR ${type}: ${error}`)
                console.error(`----${this.module_name}---- ERROR ${type}: ${error}`)
                resolve(false)
            }
        })
    }
    
    checkIfExistsModel: T_CheckIfExistModel = async (cM, id, mr, with_all = null) => {
        return new Promise(async (resolve, reject) => {
            try {
                let data = [] as Array<any>
                data = this.searchId(cM, mr, id, with_all)
                if(!Array.isArray(data)) resolve(false)
                resolve(data[0])
            }
            catch(error: any) { 
                logError(`Error checking if exist in module ${this.module_name}: ${error}`)
                console.error(`Error checking if exist in module ${this.module_name}: ${error}`)
                mr.message_error = `Error searching ${this.module_name} at row ${id}`
                resolve(false)
            }
        })
    }
    
    searchId: T_SearchId = (data, mr, id, with_all = null) => {
        const temp_outcome = data.filter((model) => model.id == id)
        if(temp_outcome.length) {
            if (with_all ? false : !temp_outcome[0].visible) {
                mr.message_error = `The module ${this.module_name} has row ${id} but disabled`
                return false;
            }
            return temp_outcome
        }
        else mr.message_error = `The module ${this.module_name} hasn't row ${id}`
        return false
    }

}