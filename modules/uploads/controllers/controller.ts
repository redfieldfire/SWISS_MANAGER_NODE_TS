import { BasicControllers, ManageResponse } from "../../../globals/classes";
import { addModel, disableModel, enableModel, getCollection, getModel, updateModel, uploadImageToModel } from "../functions";
import { modelRequest } from "../requests";
import { T_GenericAsyncController } from "../types";

const basic_controllers = new BasicControllers({ modelRequest, getModel, getCollection, addModel, updateModel, disableModel, enableModel})

export const get = basic_controllers.get
export const getAll = basic_controllers.getAll
export const add = basic_controllers.add
export const update = basic_controllers.update
export const disable = basic_controllers.disable
export const enable = basic_controllers.enable

//-------------------------------------------------- EXTRA CONTROLLERS

export const uploadImage: T_GenericAsyncController = async (req, res) => {

    const mr = new ManageResponse()
    mr.successful = await uploadImageToModel(req, mr) //-------------THAT JUST RETURNS THE NAME
    return mr.getResponse()

}