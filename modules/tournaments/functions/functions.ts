import { T_DefaultControllerFunctionWithRow, T_UpdateDataWithoutTrashed } from '../types/functions';

import { BasicControllerFunctions, GLOBALS, ManageResponse, T_RequestResponse } from '../../../globals';
import { Main } from '../model';
import { T_Model } from '../types';
import { T_Model as T_ModelPlayer, T_CollectionModel as T_CollectionPlayer } from '../../players/types';

import { Main as Player } from '../../players/model';
import { Main as User } from '../../users/model';
import { MODULE_DATA_JSON } from '../config';

export const updateDataWithoutTrashed: T_UpdateDataWithoutTrashed = async () => Main.BM.helpers.updateDataWithoutTrashed()
const basic_controller_functions = new BasicControllerFunctions(
    {
        BM: Main.BM,
        addModelExtraFunction: async (row: T_Model, mr: ManageResponse) => {
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
                row.players = row.players.map((item: number, index: number) => {
                    const new_player_resource = new Player({id: index, user_id: item}).model
                    new_player_resource.user = new_player_resource.user.model
                    return new_player_resource
                })

                return true
            }
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

        const { file_name }: { file_name: string } = GLOBALS[MODULE_DATA_JSON][model_index_id]
        const tournament: T_Model = Main.BM.resource((await Main.BM.driver.getJSON(file_name))[0])

        const players: T_CollectionPlayer = tournament.players

        const repeated_player: T_ModelPlayer | undefined = players.find((player: T_ModelPlayer) => player.user_id == user_id)

        if(repeated_player) {

            if(!repeated_player.visible) {
                tournament.players.find((player: T_ModelPlayer) => player.id == user_id).visible = true
            }
            else {
                mr.message_error = `The user with the id ${user_id} is duplicated`
                return false
            }
        }
        else {
            //---------------------------------------------------------------------- PREPARE THE DATA FOR DB (REMOVE THE MODEL)
            const new_player = new Player({id:  players.length, user_id: user_id})
            const transformed_player_to_db_row: {[index:string]: any} = {
                ...new_player.model
            }
            transformed_player_to_db_row.user = new_player.model.user.model
            tournament.players.push(transformed_player_to_db_row)
        }

        const status = await Main.BM.helpers.manageWriteJSONError(mr, Main.BM.collection([tournament]), file_name)
        return Main.BM.helpers.manageResponseData(mr, status, Main.BM.transformCollection([tournament]))

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

        const { file_name }: { file_name: string } = GLOBALS[MODULE_DATA_JSON][model_index_id]
        const tournament: T_Model = Main.BM.resource((await Main.BM.driver.getJSON(file_name))[0])

        const players: T_CollectionPlayer = tournament.players
        const found_player: T_ModelPlayer | undefined = players.find((player: T_ModelPlayer) => player.user_id == user_id && player.visible)

        if(found_player) {
            tournament.players.find((player: T_ModelPlayer) => player.id == user_id && player.visible).visible = false
        }
        else {
            mr.message_error = `The user with the id ${user_id} isn't in this tournament`
            return false
        }

        const status = await Main.BM.helpers.manageWriteJSONError(mr, Main.BM.collection([tournament]), file_name)
        return Main.BM.helpers.manageResponseData(mr, status, Main.BM.transformCollection([tournament]))

    }, mr, "REMOVE PLAYER TO MODEL")
}