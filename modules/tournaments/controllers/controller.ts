import { BasicControllers, ManageResponse } from "../../../globals/classes";
import { addModel, addPlayerToModel, addRoundToModel, disableModel, enableModel, getCollection, getModel, getPlayerFromModel, removePlayerFromModel, updateModel } from "../functions";
import { addPlayerRequest, modelRequest, removePlayerRequest } from "../requests";
import { T_GenericAsyncController } from "../types";

const basic_controllers = new BasicControllers({ modelRequest, getModel, getCollection, addModel, updateModel, disableModel, enableModel})

export const get = basic_controllers.get
export const getAll = basic_controllers.getAll
export const add = basic_controllers.add
export const update = basic_controllers.update
export const disable = basic_controllers.disable
export const enable = basic_controllers.enable

//---------------------------------------------------

export const addPlayer: T_GenericAsyncController = async (req, res) => {
        
    //-------------------------------------------------REQUEST VALIDATOR
    const row = addPlayerRequest(req.body, res)
    if (!row.successful) return row.getResponse()
    //-------------------------------------------------IF INVALID RETURN ERROR

    const mr = new ManageResponse()
    await addPlayerToModel(req, mr, row.data[0])
    return mr.getResponse()
}

export const removePlayer: T_GenericAsyncController = async (req, res) => {
        
    //-------------------------------------------------REQUEST VALIDATOR
    const row = removePlayerRequest(req.body, res)
    if (!row.successful) return row.getResponse()
    //-------------------------------------------------IF INVALID RETURN ERROR

    const mr = new ManageResponse()
    await removePlayerFromModel(req, mr, row.data[0])
    return mr.getResponse()
}

export const addRound: T_GenericAsyncController = async (req, res) => {

    const mr = new ManageResponse()
    await addRoundToModel(req, mr)
    return mr.getResponse()
}

export const getPlayer: T_GenericAsyncController = async (req, res) => {

    const mr = new ManageResponse()
    await getPlayerFromModel(req, mr)
    return mr.getResponse()
}