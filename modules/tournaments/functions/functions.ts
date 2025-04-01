import { T_DefaultControllerFunctionWithRow, T_UpdateDataWithoutTrashed } from '../types/functions';

import { BasicControllerFunctions, GLOBALS, ManageResponse } from '../../../globals';
import { Main } from '../model';
import { T_Model } from '../types';
import { T_Model as T_ModelPlayer } from '../../players/types';

import { Main as Player } from '../../players/model';
import { Main as User } from '../../users/model';
import { MODULE_DATA_JSON } from '../config';

export const updateDataWithoutTrashed: T_UpdateDataWithoutTrashed = async () => Main.BM.helpers.updateDataWithoutTrashed()
const basic_controller_functions = new BasicControllerFunctions(
    {
        BM: Main.BM,
        addModelExtraFunction: async (row: T_Model, mr: ManageResponse) => {
            if (row.players.length) {

                const uniques = row.players.filter((user_id: number) => row.players.indexOf(user_id) === row.players.lastIndexOf(user_id))
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
                    console.log({item, index})
                    const new_player_resource = new Player({id: index, user_id: item}).model
                    new_player_resource.user = User.BM.resource(new_player_resource.user.model)
                    console.log(new_player_resource)
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
        const user_id = parseInt(row.user_id)

        const exists_user = (await User.BM.find(user_id, true)).successful
        if(!exists_user) {
            mr.message_error = `The user with the id ${user_id} doesn't exists`
            return false
        }

        //------------------------------------------------------- CHECK IF EXISTS THE TOURNAMENT
        const model_index_id = parseInt(req.params.id)
        const exists_model = (await Main.BM.find(model_index_id)).successful
        if(!exists_model) return false

        const { file_name } = GLOBALS[MODULE_DATA_JSON][model_index_id]
        const tournament_array = Main.BM.collection(await Main.BM.driver.getJSON(file_name))

        const tournament = tournament_array[0]
        const players = tournament.players

        if(players.filter((player: T_ModelPlayer) => player.user_id == user_id).length) {
            mr.message_error = `The user with the id ${user_id} is duplicated`
            return false
        }
        //---------------------------------------------------------------------- PREPARE THE DATA FOR DB (REMOVE THE MODEL)
        const new_player = new Player({id:  players.length, user_id: user_id})
        const transformed_player_to_db_row: {[index:string]: any} = {
            ...new_player.model
        }
        transformed_player_to_db_row.user = new_player.model.user.model
        tournament.players.push(transformed_player_to_db_row)

        const status = await Main.BM.helpers.manageWriteJSONError(mr, Main.BM.collection([tournament]), file_name)
        return Main.BM.helpers.manageResponseData(mr, status, Main.BM.transformCollection([tournament]))

    }, mr, "ADD PLAYER TO MODEL")
}