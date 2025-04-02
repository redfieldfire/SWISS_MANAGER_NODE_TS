import { T_DefaultControllerFunctionWithRow, T_UpdateDataWithoutTrashed } from '../types/functions';

import { BasicControllerFunctions, ManageResponse, T_RequestResponse } from '../../../globals';
import { Main } from '../model';
import { T_IndexModel, T_Model } from '../types';
import { T_Model as T_ModelPlayer } from '../../players/types';

import { Main as Player } from '../../players/model';
import { Main as User } from '../../users/model';

import { modelStructure as playerStructure } from '../../players/DB/structures';

export const updateDataWithoutTrashed: T_UpdateDataWithoutTrashed = async () => Main.BM.helpers.updateDataWithoutTrashed()
const basic_controller_functions = new BasicControllerFunctions(
    {
        BM: Main.BM,
        addModelExtraFunction: async (index: T_IndexModel, row: T_Model, mr: ManageResponse) => {
            if (row.players.length) {

                const uniques: Array<number> = row.players.filter((user_id: number) => row.players.indexOf(user_id) === row.players.lastIndexOf(user_id))
                if (uniques.length != row.players.length) {
                    mr.message_error = `The players contains repeated ids`
                    return false
                }

                for (const user_id of row.players) {
                    if (!((await User.BM.find(user_id)).successful)) {
                        mr.message_error = `The user with the id ${user_id} doesn't exists`
                        return false
                    }
                }

                //---------------------------------------------------------------------- PREPARE THE DATA FOR DB (REMOVE THE MODEL)
                row.players = row.players.map((item: number, index: number) => 
                    new Player(
                        {
                            ...playerStructure,
                            id: index, 
                            user_id: item
                        }
                    ).BDM.resource()
                )
            }
            return true
        }
    }
)

export const getModel = basic_controller_functions.getModel
export const getCollection = basic_controller_functions.getCollection
export const addModel = basic_controller_functions.addModel
export const updateModel = basic_controller_functions.updateModel
export const enableModel = basic_controller_functions.enableModel
export const disableModel = basic_controller_functions.disableModel


//------------------------------------------------------------

export const addPlayerToModel: T_DefaultControllerFunctionWithRow = async (req, mr, row) => {
    return Main.BM.helpers.managePromiseError(async () => {

        //------------------------------------------------------- CHECK IF EXISTS USER WITH ID
        const user_id: number = parseInt(row.user_id)

        const exists_user: T_RequestResponse = await User.BM.find(user_id)
        if(!exists_user.successful) {
            mr.message_error = exists_user.message
            return false
        }

        //------------------------------------------------------- CHECK IF EXISTS THE TOURNAMENT
        const model_index_id: number = parseInt(req.params.id)
        const exists_model: T_RequestResponse = await Main.BM.find(model_index_id)
        if(!exists_model.successful) {
            mr.message_error = exists_model.message
            return false
        }

        const tournament: Main = exists_model.data[0] as Main

        const repeated_player: T_ModelPlayer | undefined = tournament.searchPlayerBy(user_id)

        if(repeated_player) {
            if(!repeated_player.visible) tournament.searchPlayerBy(user_id).visible = true
            else {
                mr.message_error = `The user with the id ${user_id} is duplicated`
                return false
            }
        }
        else tournament.model.players.push(new Player({id: tournament.model.players.length, user_id: user_id}))

        const status = await tournament.BDM.save(mr)
        return Main.BM.helpers.manageResponseData(mr, status, [tournament])

    }, mr, "ADD PLAYER TO MODEL")
}

export const removePlayerFromModel: T_DefaultControllerFunctionWithRow = async (req, mr, row) => {
    return Main.BM.helpers.managePromiseError(async () => {

        //------------------------------------------------------- CHECK IF EXISTS USER WITH ID
        const user_id: number = parseInt(row.user_id)
        const exists_user: T_RequestResponse = await User.BM.find(user_id)
        if(!exists_user.successful) {
            mr.message_error = exists_user.message
            return false
        }

        //------------------------------------------------------- CHECK IF EXISTS THE TOURNAMENT
        const model_index_id: number = parseInt(req.params.id)
        const exists_model: T_RequestResponse = await Main.BM.find(model_index_id)
        if(!exists_model.successful) {
            mr.message_error = exists_model.message
            return false
        }

        const tournament: Main = exists_model.data[0] as Main

        const found_player: T_ModelPlayer | undefined = tournament.searchPlayerWithoutTrashedBy(user_id)
        if(found_player)  tournament.searchPlayerWithoutTrashedBy(user_id).visible = false
        else {
            mr.message_error = `The user with the id ${user_id} isn't in this tournament`
            return false
        }

        const status = await tournament.BDM.save(mr)
        return Main.BM.helpers.manageResponseData(mr, status, [tournament])

    }, mr, "REMOVE PLAYER TO MODEL")
}