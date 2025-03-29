import { MODULE_DATA_JSON as users_MODULE_DATA_JSON } from './../../users/config/config';
import { transformedIndexResource, transformedCollectionIndex } from './../DB/transformers/transformers';
import { GLOBALS, logError, updateGlobal } from '../../../globals';
import { collection, indexCollection } from '../DB/models/models';
import { getIndexJSON, getJSON, writeJSON } from '../DB/driver/driver';
import { transformedCollection, transformedResource } from '../DB/transformers/transformers';
import { T_CheckIfExistModel, T_DefaultControllerFunction, T_DefaultControllerFunctionWithRow, T_ManagePromiseError, T_manageResponseData, T_ManageWriteJSONError, T_SearchId, T_UpdateDataWithoutTrashed } from '../types/functions';
import { HAS_MULTIPLE_FILES, INDEX_SUB_PATH, MAIN_INDEX_PATH_NAME, MODULE_DATA_JSON, MODULE_NAME } from '../config';
import { T_IndexModel, T_Model } from '../types';
import { indexModelStructure } from '../DB/structures';
import { Player } from '../../users/classes';

export const updateDataWithoutTrashed: T_UpdateDataWithoutTrashed = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            if(!HAS_MULTIPLE_FILES) updateGlobal(MODULE_DATA_JSON, collection(await getJSON()))
            else updateGlobal(MODULE_DATA_JSON, indexCollection(await getIndexJSON()))
            resolve(true)
        }
        catch(error: any) {
            logError(`Error loading GLOBAL DATA in module ${MODULE_NAME}: ${error}`)
            console.error(`Error loading GLOBAL DATA in module ${MODULE_NAME}: ${error}`)
            resolve(false)
        }
    })
}

export const manageWriteJSONError: T_ManageWriteJSONError = async (mr, collectionModel, file_name?) => {
    return new Promise(async (resolve, reject) => {
        try {
            mr.successful = await writeJSON(collectionModel, file_name)
            await updateDataWithoutTrashed()
            resolve(true)
        }
        catch (error: any) {
            mr.message_error = `Error al escribir el JSON de ${MODULE_NAME}`
            await logError(`----${MODULE_NAME}---- ERROR WRITTING JSON DATA: ${String(error.message)}`)
            console.log(`----${MODULE_NAME}---- ERROR WRITTING JSON DATA: ${String(error.message)}`)
            resolve(false)
        }
    })
}

export const manageResponseData: T_manageResponseData = (mr, status, data) => {
    if (!status) return false
    else {
        mr.data = data
        return true
    }
}

export const managePromiseError: T_ManagePromiseError = async (fun, mr, type) => {
    return await new Promise(async (resolve, reject) => {
        try {
            resolve(await fun())
        }
        catch(error: any){
            mr.message_error = `Error ${type} ${MODULE_NAME}`
            await logError(`----${MODULE_NAME}---- ERROR ${type}: ${error}`)
            console.error(`----${MODULE_NAME}---- ERROR ${type}: ${error}`)
            resolve(false)
        }
    })
}

export const checkIfExistsModel: T_CheckIfExistModel = async (cM, id, mr, with_all = null) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = [] as Array<any>
            data = searchId(cM, mr, id, with_all)
            if(!Array.isArray(data)) resolve(false)
            resolve(data[0])
        }
        catch(error: any) { 
            logError(`Error checking if exist in module ${MODULE_NAME}: ${error}`)
            console.error(`Error checking if exist in module ${MODULE_NAME}: ${error}`)
            mr.message_error = `Error searching ${MODULE_NAME} at row ${id}`
            resolve(false)
        }
    })
}

export const searchId: T_SearchId = (data, mr, id, with_all = null) => {
    const temp_outcome = data.filter((model) => model.id == id)
    if(temp_outcome.length) {
        if (with_all ? false : !temp_outcome[0].visible) {
            mr.message_error = `The module ${MODULE_NAME} has row ${id} but disabled`
            return false;
        }
        return temp_outcome
    }
    else mr.message_error = `The module ${MODULE_NAME} hasn't row ${id}`
    return false
}
//-------------------------------------------------------------------------------

export const getModel: T_DefaultControllerFunction = async(req, mr) => {
    return managePromiseError(async () => {
        const exists_model = await checkIfExistsModel(GLOBALS[MODULE_DATA_JSON], parseInt(req.params.id), mr)
        if(!exists_model) return false

        if(!HAS_MULTIPLE_FILES) mr.data = transformedCollection([exists_model])
        else {
            const { file_name } = exists_model as T_IndexModel
            const model = transformedCollection(await getJSON(file_name))
            mr.data = model
        }
        return true
    }, mr, "GET MODEL")
}
export const getCollection: T_DefaultControllerFunction = async (req, mr) => {
    return managePromiseError(async () => {
        const page = parseInt(req.params.page)
        mr.data = transformedCollection(GLOBALS[MODULE_DATA_JSON].filter((model) => model.visible).slice((page-1) * 20, page * 20))
        return true
    }, mr, "GET COLLECTION")
}
export const addModel: T_DefaultControllerFunctionWithRow = async (req, mr, row) => {
    return managePromiseError(async () => {
        if(!HAS_MULTIPLE_FILES) {
            var collectionModel = GLOBALS[MODULE_DATA_JSON]
            row.id = collectionModel.length
            row.visible = true
            collectionModel.push(row)
            const status = await manageWriteJSONError(mr, collectionModel)
            return manageResponseData(mr, status, transformedCollection([row]))
        }
        else {
            //-------------------------------------------------------- CREATE INDEX FIRST
            var collectionIndexModel = GLOBALS[MODULE_DATA_JSON]
            const new_index = indexModelStructure
            new_index.id = collectionIndexModel.length
            new_index.file_name = `${new_index.id}_db.json`
            collectionIndexModel.push(new_index)

            //------------------------------------------------------- CREATE NEW MODEL

            row.id = new_index.id
            row.visible = true

            //------------------------------------------------------- CREATE NEW FILE JSON

            if (row.players.length) {
                const uniques = row.players.filter((user_id: number) => row.players.indexOf(user_id) === row.players.lastIndexOf(user_id))
                if (uniques.length != row.players.length) {
                    mr.message_error = `The players contains repeated ids`
                    return false
                }
                for (const user_id of row.players) {
                    if (!(await checkIfExistsModel(GLOBALS[users_MODULE_DATA_JSON], user_id, mr))) {
                        mr.message_error = `The user with the id ${user_id} doesn't exists`
                        return false
                    }
                }
                row.players = row.players.map((item: number, index: number) => new Player({id: index, user_id: item}))
            }

            const status_file = await manageWriteJSONError(mr, collection([row]), new_index.file_name)
            if (!status_file) {
                mr.message_error = `Error creating the data JSON for ${MODULE_NAME}`
                return false
            }

            //-------------------------------------------------------  CREATE ROW IN INDEX
            const status_index = await manageWriteJSONError(mr, indexCollection(collectionIndexModel), `${INDEX_SUB_PATH}${MAIN_INDEX_PATH_NAME}`)
            if (!status_index) {
                mr.message_error = `Error creating the index JSON for ${MODULE_NAME}`
                return false
            }
            return manageResponseData(mr, status_file && status_index, [transformedIndexResource(new_index), transformedResource(row)]) 
        }
    }, mr, "ADD MODEL")
}
export const updateModel: T_DefaultControllerFunctionWithRow = async (req, mr, row) => {
    return managePromiseError(async () => {
        var collectionModel = GLOBALS[MODULE_DATA_JSON]
        row.id = parseInt(req.params.id)
        const exists_model = await checkIfExistsModel(collectionModel, row.id, mr)
        if(!exists_model) return false
        var status = false
        if(!HAS_MULTIPLE_FILES) {
            collectionModel[row.id] = row
            status = await manageWriteJSONError(mr, collectionModel)
        }
        else {
            const { file_name } = exists_model as T_IndexModel
            status = await manageWriteJSONError(mr, collection([row]), file_name)
        }
        return manageResponseData(mr, status, transformedCollection([row]))
    }, mr, "UPDATE MODEL")
}
export const disableModel: T_DefaultControllerFunction = async (req, mr) => {
    return managePromiseError(async () => {

        var collectionModel = GLOBALS[MODULE_DATA_JSON]
        const exists_model = await checkIfExistsModel(collectionModel, parseInt(req.params.id), mr)
        if(!exists_model) return false
        collectionModel[parseInt(req.params.id)].visible = false
        
        if(!HAS_MULTIPLE_FILES){
            const status = await manageWriteJSONError(mr, collectionModel)
            return manageResponseData(mr, status, transformedCollection([collectionModel[parseInt(req.params.id)]]))
        }
        else {
            const status = await manageWriteJSONError(mr, collectionModel,`${INDEX_SUB_PATH}${MAIN_INDEX_PATH_NAME}`)
            return manageResponseData(mr, status, transformedCollectionIndex([collectionModel[parseInt(req.params.id)]]))
        }

    }, mr, "DISABLE MODEL")
}
export const enableModel: T_DefaultControllerFunction = async (req, mr) => {
    return managePromiseError(async () => {

        var collectionModel = GLOBALS[MODULE_DATA_JSON]
        const exists_model = await checkIfExistsModel(collectionModel, parseInt(req.params.id), mr, true)
        if(!exists_model) return false
        collectionModel[parseInt(req.params.id)].visible = true
        
        if(!HAS_MULTIPLE_FILES){
            const status = await manageWriteJSONError(mr, collectionModel)
            return manageResponseData(mr, status, transformedCollection([collectionModel[parseInt(req.params.id)]]))
        }
        else {
            const status = await manageWriteJSONError(mr, collectionModel, `${INDEX_SUB_PATH}${MAIN_INDEX_PATH_NAME}`)
            return manageResponseData(mr, status, transformedCollectionIndex([collectionModel[parseInt(req.params.id)]]))
        }

    }, mr, "ENABLE MODEL")
}
export const addPlayerToModel: T_DefaultControllerFunctionWithRow = async (req, mr, row) => {
    return managePromiseError(async () => {

        const user_id = parseInt(row.user_id)
        const exists_user = await checkIfExistsModel(GLOBALS[users_MODULE_DATA_JSON], user_id, mr, true)
        if(!exists_user) {
            mr.message_error = `The user with the id ${user_id} doesn't exists`
            return false
        }

        const model_index_id = parseInt(req.params.id)
        const exists_model = await checkIfExistsModel(GLOBALS[MODULE_DATA_JSON], model_index_id, mr)
        if(!exists_model) return false

        const { file_name } = GLOBALS[MODULE_DATA_JSON][model_index_id]
        const tournament_array = transformedCollection(await getJSON(file_name))

        const tournament = tournament_array[0]
        const players = tournament.model.players

        if(players.filter((player: {[index: string]: any}) => player.model.user_id == user_id).length) {
            mr.message_error = `The user with the id ${user_id} is duplicated`
            return false
        }

        tournament.model.players.push(new Player({id: players.length, user_id: user_id}))

        const status = await manageWriteJSONError(mr, collection([tournament.model]), file_name)
        return manageResponseData(mr, status, transformedCollection([tournament.model]))

    }, mr, "ADD PLAYER TO MODEL")
}