import { freeObject, T_BasicControllerFunctionsContructor, T_BasicDirectConstructor, T_BasicModelConstructor, T_BasicModelFunctionCreate, T_BasicModelFunctionDisable, T_BasicModelFunctionEnable, T_BasicModelFunctionFind, T_BasicModelFunctionGet, T_BasicModelFunctionUpdate, T_CheckIfExistModel, T_CollectionIndexModel, T_CollectionModel, T_DefaultControllerFunction, T_DefaultControllerFunctionWithRow, T_RequestResponse, T_TransformCollection, T_TransformCollectionIndex, T_TransformIndexResource, T_TransformResource } from './../types';
import { T_BasicControllersConstructor, T_GenericAsyncController, T_GetCollection, T_GetCollectionIndex, T_GetIndexResource, T_GetResource, T_HelperConstructor, T_IndexModel, T_ManagePromiseError, T_manageResponseData, T_ManageWriteJSONError, T_Model, T_ResetTempData, T_SearchId, T_SetResponse, T_UpdateDataWithoutTrashed } from '../types';
import { I_HelperController, I_Response, I_BasicControllers, I_BasicModel, I_BasicControllerFunctions, I_BasicDirectModel } from './../interfaces';
import { GLOBALS, updateGlobal } from '../data';
import { logError } from '../functions';
import { Driver } from '../driver';

export class BasicModel implements I_BasicModel{

    Main
    Index
    module_name
    module_data_json
    index_sub_path
    main_index_path_name
    has_multiple_files
    model_structure
    index_model_structure
    helpers
    driver

    constructor({Main, Index, module_name, module_data_json, index_sub_path, file_path, main_db_path_name, main_index_path_name, has_multiple_files, model_structure, index_model_structure}: T_BasicModelConstructor){
        this.Main = Main
        this.Index = Index
        this.module_name = module_name
        this.module_data_json = module_data_json
        this.index_sub_path = index_sub_path
        this.main_index_path_name = main_index_path_name
        this.has_multiple_files = has_multiple_files
        this.model_structure = model_structure
        this.index_model_structure = index_model_structure
        this.driver = new Driver({module_name, file_path, main_db_path_name, index_sub_path, main_index_path_name, collection: this.collection, indexCollection: this.indexCollection})
        this.helpers = new Helpers({module_name, module_data_json, has_multiple_files, collection: this.collection, indexCollection: this.indexCollection, getJSON: this.driver.getJSON, getIndexJSON: this.driver.getIndexJSON, writeJSON: this.driver.writeJSON})
    }

    resource: T_GetResource = (row) => (
        Object.keys(this.model_structure).reduce((accum, key) => {
            accum[key] = row[key] ?? this.model_structure[key]
            return accum;
        }, {} as T_Model)
    )
    collection: T_GetCollection = (rows) => (rows.map((row) => this.resource(row)));

    indexResource: T_GetIndexResource = (row) => (
        Object.keys(this.index_model_structure).reduce((accum, key) => {
            accum[key] = row[key] ?? this.index_model_structure[key]
            return accum;
        }, {} as T_IndexModel)
    )
    indexCollection: T_GetCollectionIndex = (rows) => (rows.map((row) => this.indexResource(row)));

    transformResource: T_TransformResource = (row: T_Model) => new this.Main(row);
    transformCollection: T_TransformCollection = (rows: T_CollectionModel) => (rows.map((row) => this.transformResource(row)));

    transformIndexResource: T_TransformIndexResource = (row: T_IndexModel) => (new this.Index(row).model);
    transformCollectionIndex: T_TransformCollectionIndex = (rows: T_CollectionIndexModel) => (rows.map((row) => this.transformIndexResource(row)));
    
    find: T_BasicModelFunctionFind = async (id, extraFunction) => {
        const mr = new ManageResponse()
        const exists_model = await this.helpers.checkIfExistsModel(GLOBALS[this.module_data_json], id, mr, false)
        if(!exists_model) return mr.getResponse()
    
        var data = []

        if(!this.has_multiple_files) data = this.transformCollection([exists_model])
        else {
            const { file_name } = exists_model
            data = this.transformCollection(await this.driver.getJSON(file_name))
        }

        if(extraFunction) {
            const response = await extraFunction(data, mr)
            if (!response) return mr.getResponse()
        }

        mr.successful = true
        mr.data = data
        return mr.getResponse()
    };
    findWithTrashed: T_BasicModelFunctionFind = async (id, extraFunction) => {
        const mr = new ManageResponse()
        const exists_model = await this.helpers.checkIfExistsModel(GLOBALS[this.module_data_json], id, mr, true)
        if(!exists_model) return mr.getResponse()
    
        var data = []

        if(!this.has_multiple_files) data = this.transformCollection([exists_model])
        else {
            const { file_name } = exists_model
            data = this.transformCollection(await this.driver.getJSON(file_name))
        }

        if(extraFunction) {
            const response = await extraFunction(data, mr)
            if (!response) return mr.getResponse()
        }

        mr.successful = true
        mr.data = data
        return mr.getResponse()
    };
    get: T_BasicModelFunctionGet = async (page, extraFunction) => {
        const mr = new ManageResponse()
        
        var data;

        if (!this.has_multiple_files) data = this.transformCollection(GLOBALS[this.module_data_json].filter((model) => model.visible).slice((page-1) * 20, page * 20))
        else data = this.transformCollectionIndex(GLOBALS[this.module_data_json].filter((model) => model.visible).slice((page-1) * 20, page * 20));
        
        if(extraFunction) {
            const response = await extraFunction(data, mr)
            if (!response) return mr.getResponse()
        }
        
        mr.successful = true
        mr.data = data
        return mr.getResponse()
    }
    create: T_BasicModelFunctionCreate = async (row, extraFunction) => {
        const mr = new ManageResponse()

        if(!this.has_multiple_files) {
            var collectionModel = GLOBALS[this.module_data_json]
            row.id = collectionModel.length
            row.visible = true

            if(extraFunction) {
                const response = await extraFunction(row, mr)
                if (!response) return mr.getResponse()
            }

            collectionModel.push(row)
            const status = await this.helpers.manageWriteJSONError(mr, collectionModel)
            this.helpers.manageResponseData(mr, status, this.transformCollection([row]))
        }
        else {
            //-------------------------------------------------------- CREATE INDEX FIRST
            var collectionIndexModel = GLOBALS[this.module_data_json]
            const new_index = this.index_model_structure
            new_index.id = collectionIndexModel.length
            new_index.file_name = `${new_index.id}_db.json`

            //------------------------------------------------------- CREATE NEW MODEL

            row.id = new_index.id
            row.visible = true

            if(extraFunction) {
                const response = await extraFunction(new_index, row, mr)
                if (!response) return mr.getResponse()
            }

            collectionIndexModel.push(new_index)

            //------------------------------------------------------- CREATE NEW FILE JSON
            const status_file = await this.helpers.manageWriteJSONError(mr, this.collection([row]), new_index.file_name)
            if (!status_file) {
                mr.message_error = `Error creating the data JSON for ${this.module_name}`
                return mr.getResponse()
            }

            //-------------------------------------------------------  CREATE ROW IN INDEX
            const status_index = await this.helpers.manageWriteJSONError(mr, this.indexCollection(collectionIndexModel), `${this.index_sub_path}${this.main_index_path_name}`)
            if (!status_index) {
                mr.message_error = `Error creating the index JSON for ${this.module_name}`
                return mr.getResponse()
            }
            this.helpers.manageResponseData(mr, status_file && status_index, [this.transformIndexResource(new_index), this.transformResource(row)]) 
        }

        mr.successful = true
        return mr.getResponse()
    };
    update: T_BasicModelFunctionUpdate = async (id, row, extraFunction) => {
        const mr = new ManageResponse()
        var collectionModel = GLOBALS[this.module_data_json]
        row.id = id
        const exists_model = await this.helpers.checkIfExistsModel(collectionModel, row.id, mr)
        if(!exists_model) {
            mr.successful = false
            return mr.getResponse()
        }
        var status = false

        if(extraFunction) {
            const response = await extraFunction(row, mr)
            if (!response) return mr.getResponse()
        }

        if(!this.has_multiple_files) {
            collectionModel[row.id] = row
            status = await this.helpers.manageWriteJSONError(mr, collectionModel)
        }
        else {
            const { file_name } = exists_model as T_IndexModel
            status = await this.helpers.manageWriteJSONError(mr, this.collection([row]), file_name)
        }
        mr.successful = status
        this.helpers.manageResponseData(mr, status, this.transformCollection([row]))
        return mr.getResponse()
    };
    enable: T_BasicModelFunctionEnable = async (id, extraFunction) => {
        const mr = new ManageResponse()
        var collectionModel = GLOBALS[this.module_data_json]
        const exists_model = await this.helpers.checkIfExistsModel(collectionModel, id, mr, true)
        if(!exists_model) {
            mr.successful = false
            return mr.getResponse()
        }
        collectionModel[id].visible = true

        if(extraFunction) {
            const response = await extraFunction(collectionModel, mr)
            if (!response) return mr.getResponse()
        }
        
        if(!this.has_multiple_files){
            const status = await this.helpers.manageWriteJSONError(mr, collectionModel)
            this.helpers.manageResponseData(mr, status, this.transformCollection([collectionModel[id]]))
        }
        else {
            const status = await this.helpers.manageWriteJSONError(mr, collectionModel,`${this.index_sub_path}${this.main_index_path_name}`)
            this.helpers.manageResponseData(mr, status, this.transformCollectionIndex([collectionModel[id]]))
        }

        return mr.getResponse()
    };
    disable: T_BasicModelFunctionDisable = async (id, extraFunction) => {
        const mr = new ManageResponse()
        var collectionModel = GLOBALS[this.module_data_json]
        const exists_model = await this.helpers.checkIfExistsModel(collectionModel, id, mr)
        if(!exists_model) {
            mr.successful = false
            return mr.getResponse()
        }
        collectionModel[id].visible = false

        if(extraFunction) {
            const response = await extraFunction(collectionModel, mr)
            if (!response) return mr.getResponse()
        }
        
        if(!this.has_multiple_files){
            const status = await this.helpers.manageWriteJSONError(mr, collectionModel)
            this.helpers.manageResponseData(mr, status, this.transformCollection([collectionModel[id]]))
        }
        else {
            const status = await this.helpers.manageWriteJSONError(mr, collectionModel,`${this.index_sub_path}${this.main_index_path_name}`)
            this.helpers.manageResponseData(mr, status, this.transformCollectionIndex([collectionModel[id]]))
        }

        return mr.getResponse()
    };
}

export class BasicDirectModel implements I_BasicDirectModel {

    BM
    model
    resource

    constructor({BM, model, resource}: T_BasicDirectConstructor) {
        this.BM = BM
        this.model = model
        if(resource) this.resource = resource
        else this.resource = () => model()
    }

    async save(mr: ManageResponse) {

        const exists_model = await this.BM.helpers.checkIfExistsModel(GLOBALS[this.BM.module_data_json], this.model().id, mr, true)

        if(!this.BM.has_multiple_files) {

            if (exists_model) {
                const collectionModel = GLOBALS[this.BM.module_data_json]
                collectionModel[this.model().id] = this.resource()
                return await this.BM.helpers.manageWriteJSONError(mr, collectionModel)
            }
            else return (await this.BM.create(this.resource())).successful
        
        }
        else {
            if (exists_model) {
                const index = GLOBALS[this.BM.module_data_json][this.resource().id]
                const { file_name } = index as T_IndexModel
                return await this.BM.helpers.manageWriteJSONError(mr, [this.resource()], file_name)
            }
            else return (await this.BM.create(this.resource())).successful
        }
    }

}

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
                console.error(`----${this.module_name}---- ERROR WRITTING JSON DATA: ${String(error.message)}`)
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

export class BasicControllers implements I_BasicControllers {

    modelRequest
    getModel
    getCollection
    addModel
    updateModel
    disableModel
    enableModel

    constructor({ modelRequest, getModel, getCollection, addModel, updateModel, disableModel, enableModel}: T_BasicControllersConstructor){
        this.modelRequest = modelRequest
        this.getModel = getModel
        this.getCollection = getCollection
        this.addModel = addModel
        this.updateModel = updateModel
        this.disableModel = disableModel
        this.enableModel = enableModel
    }

    getAll: T_GenericAsyncController = async (req, res) => {
        const mr = new ManageResponse()
        mr.successful = await this.getCollection(req, mr)
        return mr.getResponse()
    }
    
    get: T_GenericAsyncController = async (req, res) => {
        const mr = new ManageResponse()
        mr.successful = await this.getModel(req, mr)
        return mr.getResponse()
    }
    
    add: T_GenericAsyncController = async (req, res) => {
    
        //-------------------------------------------------REQUEST VALIDATOR
        const row = this.modelRequest(req.body, res)
        if (!row.successful) return row.getResponse()
        //-------------------------------------------------IF INVALID RETURN ERROR
    
        const mr = new ManageResponse()
        mr.successful = await this.addModel(req, mr, row.data[0])
        return mr.getResponse()
    }
    
    update: T_GenericAsyncController = async (req, res) => {
        
        //-------------------------------------------------REQUEST VALIDATOR
        const row = this.modelRequest(req.body, res)
        if (!row.successful) return row.getResponse()
        //-------------------------------------------------IF INVALID RETURN ERROR
    
        const mr = new ManageResponse()
        mr.successful = await this.updateModel(req, mr, row.data[0])
        return mr.getResponse()
    }
    
    enable: T_GenericAsyncController = async (req, res) => {
        const mr = new ManageResponse()
        mr.successful = await this.enableModel(req, mr)
        return mr.getResponse()
    }
    
    disable: T_GenericAsyncController = async (req, res) => {
        const mr = new ManageResponse()
        mr.successful = await this.disableModel(req, mr)
        return mr.getResponse()
    }
}

export class BasicControllerFunctions implements I_BasicControllerFunctions {

    BM
    helpers

    getModelExtraFunction
    getCollectionExtraFunction
    addModelExtraFunction
    updateModelExtraFunction
    disableModeExtraFunction
    enableModelExtraFunction

    constructor({BM, getModelExtraFunction, getCollectionExtraFunction, addModelExtraFunction, updateModelExtraFunction, disableModeExtraFunction, enableModelExtraFunction}: T_BasicControllerFunctionsContructor){
        this.BM = BM
        this.helpers = BM.helpers
        if(getModelExtraFunction) this.getModelExtraFunction = getModelExtraFunction
        else this.getModelExtraFunction = () => true
        if(getCollectionExtraFunction) this.getCollectionExtraFunction = getCollectionExtraFunction
        else this.getCollectionExtraFunction = () => true
        if(addModelExtraFunction) this.addModelExtraFunction = addModelExtraFunction
        else this.addModelExtraFunction = () => true
        if(updateModelExtraFunction) this.updateModelExtraFunction = updateModelExtraFunction
        else this.updateModelExtraFunction = () => true
        if(disableModeExtraFunction) this.disableModeExtraFunction = disableModeExtraFunction
        else this.disableModeExtraFunction = () => true
        if(enableModelExtraFunction) this.enableModelExtraFunction = enableModelExtraFunction
        else this.enableModelExtraFunction = () => true
    }

    getModel: T_DefaultControllerFunction = async(req, mr) => {
        return this.helpers.managePromiseError(async () => {
            const id: number = parseInt(req.params.id)
            const model: T_RequestResponse = await this.BM.find(id, this.getModelExtraFunction)
            var data = model.data
            if(model.successful) data = [(model.data[0] as typeof this.BM.Main).BDM.resource()]
            mr.data = data
            mr.message_error = model.message
            return model.successful
        }, mr, "GET MODEL")
    }
    getCollection: T_DefaultControllerFunction = async (req, mr) => {
        return this.helpers.managePromiseError(async () => {
            const page: number = parseInt(req.params.page)
            const collection: T_RequestResponse = await this.BM.get(page, this.getCollectionExtraFunction)
            var data = collection.data
            if(collection.successful) {
                if(!this.BM.has_multiple_files) data = collection.data.map((item: typeof this.BM.Main) => item.BDM.resource())
            }
            mr.data = data
            mr.message_error = collection.message
            return collection.successful
        }, mr, "GET COLLECTION")
    }
    addModel: T_DefaultControllerFunctionWithRow = async (req, mr, row) => {
        return this.helpers.managePromiseError(async () => {
            const added_model: T_RequestResponse = await this.BM.create(row, this.addModelExtraFunction)
            var data = added_model.data
            if(added_model.successful) {
                if(!this.BM.has_multiple_files) data = [(added_model.data[0] as typeof this.BM.Main).BDM.resource()]
                else data[1] = [(added_model.data[1] as typeof this.BM.Main).BDM.resource()]
            }
            mr.data = data
            mr.message_error = added_model.message
            return added_model.successful
        }, mr, "ADD MODEL")
    }
    updateModel: T_DefaultControllerFunctionWithRow = async (req, mr, row) => {
        return this.helpers.managePromiseError(async () => {
            const id: number = parseInt(req.params.id)
            const updated_model: T_RequestResponse = await this.BM.update(id, row, this.updateModelExtraFunction)
            var data = updated_model.data
            if(updated_model.successful) data = [(updated_model.data[0] as typeof this.BM.Main).BDM.resource()]
            mr.data = data
            mr.message_error = updated_model.message
            return updated_model.successful
        }, mr, "UPDATE MODEL")
    }
    disableModel: T_DefaultControllerFunction = async (req, mr) => {
        return this.helpers.managePromiseError(async () => {
            const id: number = parseInt(req.params.id)
            const disable_model: T_RequestResponse = await this.BM.disable(id, this.disableModeExtraFunction)
            var data = disable_model.data
            if(disable_model.successful) data = [(disable_model.data[0] as typeof this.BM.Main).BDM.resource()]
            mr.data = data
            mr.message_error = disable_model.message
            return disable_model.successful
        }, mr, "DISABLE MODEL")
    }
    enableModel: T_DefaultControllerFunction = async (req, mr) => {
        return this.helpers.managePromiseError(async () => {
            const id: number = parseInt(req.params.id)
            const enable_model: T_RequestResponse = await this.BM.enable(id, this.enableModelExtraFunction)
            var data = enable_model.data
            if(enable_model.successful) data = [(enable_model.data[0] as typeof this.BM.Main).BDM.resource()]
            mr.data = data
            mr.message_error = enable_model.message
            return enable_model.successful
        }, mr, "ENABLE MODEL")
    }
}