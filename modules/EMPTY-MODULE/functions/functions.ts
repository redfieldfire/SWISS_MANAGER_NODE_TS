import { transformedIndexResource, transformedCollectionIndex } from '../DB/transformers/transformers';
import { GLOBALS } from '../../../globals';
import { collection, indexCollection } from '../DB/models/models';
import { transformedCollection, transformedResource } from '../DB/transformers/transformers';
import { T_DefaultControllerFunction, T_DefaultControllerFunctionWithRow, T_UpdateDataWithoutTrashed } from '../types/functions';
import { HAS_MULTIPLE_FILES, INDEX_SUB_PATH, MAIN_INDEX_PATH_NAME, MODULE_DATA_JSON, MODULE_NAME } from '../config';
import { T_IndexModel } from '../types';
import { indexModelStructure } from '../DB/structures';

import { driver } from '../DB/driver';
import { helpers } from '../helpers';

export const updateDataWithoutTrashed: T_UpdateDataWithoutTrashed = async () => helpers.updateDataWithoutTrashed()

//-------------------------------------------------------------------------------

export const getModel: T_DefaultControllerFunction = async(req, mr) => {
    return helpers.managePromiseError(async () => {
        const exists_model = await helpers.checkIfExistsModel(GLOBALS[MODULE_DATA_JSON], parseInt(req.params.id), mr)
        if(!exists_model) return false

        if(!HAS_MULTIPLE_FILES) mr.data = transformedCollection([exists_model])
        else {
            const { file_name } = exists_model as T_IndexModel
            const model = transformedCollection(await driver.getJSON(file_name))
            mr.data = model
        }
        return true
    }, mr, "GET MODEL")
}
export const getCollection: T_DefaultControllerFunction = async (req, mr) => {
    return helpers.managePromiseError(async () => {
        const page = parseInt(req.params.page)
        mr.data = transformedCollection(GLOBALS[MODULE_DATA_JSON].filter((model) => model.visible).slice((page-1) * 20, page * 20))
        return true
    }, mr, "GET COLLECTION")
}
export const addModel: T_DefaultControllerFunctionWithRow = async (req, mr, row) => {
    return helpers.managePromiseError(async () => {
        if(!HAS_MULTIPLE_FILES) {
            var collectionModel = GLOBALS[MODULE_DATA_JSON]
            row.id = collectionModel.length
            row.visible = true
            collectionModel.push(row)
            const status = await helpers.manageWriteJSONError(mr, collectionModel)
            return helpers.manageResponseData(mr, status, transformedCollection([row]))
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
            const status_file = await helpers.manageWriteJSONError(mr, collection([row]), new_index.file_name)
            if (!status_file) {
                mr.message_error = `Error creating the data JSON for ${MODULE_NAME}`
                return false
            }

            //-------------------------------------------------------  CREATE ROW IN INDEX
            const status_index = await helpers.manageWriteJSONError(mr, indexCollection(collectionIndexModel), `${INDEX_SUB_PATH}${MAIN_INDEX_PATH_NAME}`)
            if (!status_index) {
                mr.message_error = `Error creating the index JSON for ${MODULE_NAME}`
                return false
            }
            return helpers.manageResponseData(mr, status_file && status_index, [transformedIndexResource(new_index), transformedResource(row)]) 
        }
    }, mr, "ADD MODEL")
}
export const updateModel: T_DefaultControllerFunctionWithRow = async (req, mr, row) => {
    return helpers.managePromiseError(async () => {
        var collectionModel = GLOBALS[MODULE_DATA_JSON]
        row.id = parseInt(req.params.id)
        const exists_model = await helpers.checkIfExistsModel(collectionModel, row.id, mr)
        if(!exists_model) return false
        var status = false
        if(!HAS_MULTIPLE_FILES) {
            collectionModel[row.id] = row
            status = await helpers.manageWriteJSONError(mr, collectionModel)
        }
        else {
            const { file_name } = exists_model as T_IndexModel
            status = await helpers.manageWriteJSONError(mr, collection([row]), file_name)
        }
        return helpers.manageResponseData(mr, status, transformedCollection([row]))
    }, mr, "UPDATE MODEL")
}
export const disableModel: T_DefaultControllerFunction = async (req, mr) => {
    return helpers.managePromiseError(async () => {

        var collectionModel = GLOBALS[MODULE_DATA_JSON]
        const exists_model = await helpers.checkIfExistsModel(collectionModel, parseInt(req.params.id), mr)
        if(!exists_model) return false
        collectionModel[parseInt(req.params.id)].visible = false
        
        if(!HAS_MULTIPLE_FILES){
            const status = await helpers.manageWriteJSONError(mr, collectionModel)
            return helpers.manageResponseData(mr, status, transformedCollection([collectionModel[parseInt(req.params.id)]]))
        }
        else {
            const status = await helpers.manageWriteJSONError(mr, collectionModel,`${INDEX_SUB_PATH}${MAIN_INDEX_PATH_NAME}`)
            return helpers.manageResponseData(mr, status, transformedCollectionIndex([collectionModel[parseInt(req.params.id)]]))
        }

    }, mr, "DISABLE MODEL")
}
export const enableModel: T_DefaultControllerFunction = async (req, mr) => {
    return helpers.managePromiseError(async () => {

        var collectionModel = GLOBALS[MODULE_DATA_JSON]
        const exists_model = await helpers.checkIfExistsModel(collectionModel, parseInt(req.params.id), mr, true)
        if(!exists_model) return false
        collectionModel[parseInt(req.params.id)].visible = true
        
        if(!HAS_MULTIPLE_FILES){
            const status = await helpers.manageWriteJSONError(mr, collectionModel)
            return helpers.manageResponseData(mr, status, transformedCollection([collectionModel[parseInt(req.params.id)]]))
        }
        else {
            const status = await helpers.manageWriteJSONError(mr, collectionModel, `${INDEX_SUB_PATH}${MAIN_INDEX_PATH_NAME}`)
            return helpers.manageResponseData(mr, status, transformedCollectionIndex([collectionModel[parseInt(req.params.id)]]))
        }

    }, mr, "ENABLE MODEL")
}