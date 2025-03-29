import { ManageResponse } from "../../../globals/classes";
import { addModel, addPlayerToModel, disableModel, enableModel, getCollection, getModel, updateModel } from "../functions";
import { addPlayerRequest, modelRequest } from "../requests";
import { T_GenericAsyncController } from "../types";

export const getAll: T_GenericAsyncController = async (req, res) => {
    const mr = new ManageResponse()
    mr.successful = await getCollection(req, mr)
    return mr.getResponse()
}

export const get: T_GenericAsyncController = async (req, res) => {
    const mr = new ManageResponse()
    mr.successful = await getModel(req, mr)
    return mr.getResponse()
}

export const add: T_GenericAsyncController = async (req, res) => {

    //-------------------------------------------------REQUEST VALIDATOR
    const row = modelRequest(req.body, res)
    if (!row.successful) return row.getResponse()
    //-------------------------------------------------IF INVALID RETURN ERROR

    const mr = new ManageResponse()
    await addModel(req, mr, row.data[0])
    return mr.getResponse()
}

export const update: T_GenericAsyncController = async (req, res) => {
    
    //-------------------------------------------------REQUEST VALIDATOR
    const row = modelRequest(req.body, res)
    if (!row.successful) return row.getResponse()
    //-------------------------------------------------IF INVALID RETURN ERROR

    const mr = new ManageResponse()
    await updateModel(req, mr, row.data[0])
    return mr.getResponse()
}

export const enable: T_GenericAsyncController = async (req, res) => {
    const mr = new ManageResponse()
    await enableModel(req, mr)
    return mr.getResponse()
}

export const disable: T_GenericAsyncController = async (req, res) => {
    const mr = new ManageResponse()
    await disableModel(req, mr)
    return mr.getResponse()
}

export const addPlayer: T_GenericAsyncController = async (req, res) => {
    
    //-------------------------------------------------REQUEST VALIDATOR
    const row = addPlayerRequest(req.body, res)
    if (!row.successful) return row.getResponse()
    //-------------------------------------------------IF INVALID RETURN ERROR

    const mr = new ManageResponse()
    await addPlayerToModel(req, mr, row.data[0])
    return mr.getResponse()
}
