import { T_UpdateDataWithoutTrashed } from '../types/functions';

import { BasicControllerFunctions } from '../../../globals';
import { Main } from '../model';

export const updateDataWithoutTrashed: T_UpdateDataWithoutTrashed = async () => Main.BM.helpers.updateDataWithoutTrashed()
const basic_controller_functions = new BasicControllerFunctions({BM: Main.BM})

export const getModel = basic_controller_functions.getModel
export const getCollection = basic_controller_functions.getCollection
export const addModel = basic_controller_functions.addModel
export const updateModel = basic_controller_functions.updateModel
export const enableModel = basic_controller_functions.enableModel
export const disableModel = basic_controller_functions.disableModel