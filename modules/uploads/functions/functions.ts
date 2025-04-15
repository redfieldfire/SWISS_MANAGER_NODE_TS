import { T_DefaultControllerFunction, T_UpdateDataWithoutTrashed } from '../types/functions';

import { BasicControllerFunctions } from '../../../globals';
import { Main as Upload } from '../model';
import { modelStructure } from '../DB/structures';

export const updateDataWithoutTrashed: T_UpdateDataWithoutTrashed = async () => Upload.BM.helpers.updateDataWithoutTrashed()
const basic_controller_functions = new BasicControllerFunctions({BM: Upload.BM})

export const getModel = basic_controller_functions.getModel
export const getCollection = basic_controller_functions.getCollection
export const addModel = basic_controller_functions.addModel
export const updateModel = basic_controller_functions.updateModel
export const enableModel = basic_controller_functions.enableModel
export const disableModel = basic_controller_functions.disableModel

//----------------------------------------------------------------------------

export const uploadImageToModel: T_DefaultControllerFunction = async (req, mr) => {
    return Upload.BM.helpers.managePromiseError(async () => {

        if(!req.file) {
            mr.message_error = `Image don't uploaded!`
            return false
        }
    
        const outcome = await Upload.BM.create({
            ...modelStructure,
            name: req.file.filename
        })
    
        mr.data = outcome.data
        return true

    }, mr, 'Error Uploading an Image')
}