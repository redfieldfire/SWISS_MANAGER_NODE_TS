import { T_DefaultControllerFunction, T_DefaultControllerFunctionWithRow, T_UpdateDataWithoutTrashed } from '../types/functions';

import { BasicControllerFunctions, freeObject, ManageResponse, T_RequestResponse } from '../../../globals';

import { T_IndexModel, T_Model } from '../types';
import { T_Model as T_ModelPlayer } from '../../players/types';

import { Main as Player } from '../../players/model';
import { Main as User } from '../../users/model';
import { Main as Round } from '../../rounds/model';
import { Main as Tournament} from '../model';

import { modelStructure as playerStructure } from '../../players/DB/structures';
import { modelStructure as roundStructure } from '../../rounds/DB/structures';

export const updateDataWithoutTrashed: T_UpdateDataWithoutTrashed = async () => Tournament.BM.helpers.updateDataWithoutTrashed()
const basic_controller_functions = new BasicControllerFunctions(
    {
        BM: Tournament.BM,
        addModelExtraFunction: async (index: T_IndexModel, row: T_Model, mr: ManageResponse) => {

            index.name = row.head.name

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

                //---------------------------------------------------------------------- CREATE INTERNAL PLAYERS
                row.players = await row.players.map((item: number, index: number) => new Player({...playerStructure, id: index, tournament_id: row.id, user_id: item}).BDM.resource())
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
    return Tournament.BM.helpers.managePromiseError(async () => {

        //------------------------------------------------------- CHECK IF EXISTS USER WITH ID
        const user_id: number = parseInt(row.user_id)

        const exists_user: T_RequestResponse = await User.BM.find(user_id)
        if(!exists_user.successful) {
            mr.message_error = exists_user.message
            return false
        }

        //------------------------------------------------------- CHECK IF EXISTS THE TOURNAMENT
        const model_index_id: number = parseInt(req.params.id)
        const exists_model: T_RequestResponse = await Tournament.BM.find(model_index_id)
        if(!exists_model.successful) {
            mr.message_error = exists_model.message
            return false
        }

        const tournament: Tournament = exists_model.data[0] as Tournament

        const repeated_player: T_ModelPlayer | undefined = tournament.searchPlayerBy(user_id)

        if(repeated_player) {
            if(!repeated_player.model.visible) tournament.searchPlayerBy(user_id).model.visible = true
            else {
                mr.message_error = `The user with the id ${user_id} is duplicated`
                return false
            }
        }

        else {

            const new_player = new Player({...playerStructure, id: tournament.model.players.lentgh, tournament_id: tournament.model.id, user_id: user_id})
            tournament.model.players.push(new_player)

        }


        const status = await tournament.BDM.save(mr)
        return Tournament.BM.helpers.manageResponseData(mr, status, [tournament.BDM.resource()])

    }, mr, "ADD PLAYER TO MODEL")
}

export const removePlayerFromModel: T_DefaultControllerFunctionWithRow = async (req, mr, row) => {
    return Tournament.BM.helpers.managePromiseError(async () => {

        //------------------------------------------------------- CHECK IF EXISTS USER WITH ID
        const user_id: number = parseInt(row.user_id)
        const exists_user: T_RequestResponse = await User.BM.find(user_id)
        if(!exists_user.successful) {
            mr.message_error = exists_user.message
            return false
        }

        //------------------------------------------------------- CHECK IF EXISTS THE TOURNAMENT
        const model_index_id: number = parseInt(req.params.id)
        const exists_model: T_RequestResponse = await Tournament.BM.findWithTrashed(model_index_id)
        if(!exists_model.successful) {
            mr.message_error = exists_model.message
            return false
        }

        const tournament: Tournament = exists_model.data[0] as Tournament

        const found_player: T_ModelPlayer | undefined = tournament.searchPlayerWithoutTrashedBy(user_id)
        if(found_player)  tournament.searchPlayerWithoutTrashedBy(user_id).model.visible = false
        else {
            mr.message_error = `The user with the id ${user_id} isn't in this tournament`
            return false
        }

        const status = await tournament.BDM.save(mr)
        return Tournament.BM.helpers.manageResponseData(mr, status, [tournament.BDM.resource()])

    }, mr, "REMOVE PLAYER TO MODEL")
}

export const addRoundToModel: T_DefaultControllerFunction = async (req, mr) => {
    return Tournament.BM.helpers.managePromiseError(async () => {


        //------------------------------------------------------- CHECK IF EXISTS THE TOURNAMENT
        const model_index_id: number = parseInt(req.params.id)
        const exists_model: T_RequestResponse = await Tournament.BM.find(model_index_id)
        if(!exists_model.successful) {
            mr.message_error = exists_model.message
            return false
        }

        //------------------------------------------------------- ADD EMPTY ROUND

        const tournament: Tournament = exists_model.data[0] as Tournament

        const new_round: Round = new Round(roundStructure)
        new_round.makePairings(await tournament.orderPlayers())

        tournament.model.rounds.push(new_round)

        const status = await tournament.BDM.save(mr)
        return Tournament.BM.helpers.manageResponseData(mr, status, [tournament.BDM.resource()])

    }, mr, "ADD ROUND TO MODEL")
}

export const getPlayerFromModel: T_DefaultControllerFunction = async (req, mr) => {
    return Tournament.BM.helpers.managePromiseError(async () => {


        //------------------------------------------------------- CHECK IF EXISTS THE TOURNAMENT
        const model_index_id: number = parseInt(req.params.id)
        const exists_model: T_RequestResponse = await Tournament.BM.find(model_index_id)
        if(!exists_model.successful) {
            mr.message_error = exists_model.message
            return false
        }

        const tournament = (exists_model.data[0] as Tournament)

        //------------------------------------------------------- CHECK IF EXISTS THE PLAYER INTO THE TOURNAMENT
        const player_id: number = parseInt(req.params.idplayer)
        const exists_player_in_model: Player = tournament.searchPlayerBy(player_id)
        if(!exists_player_in_model) {
            mr.message_error = `The player with the id ${player_id} doesn't exists`
            return false
        }

        const player = exists_player_in_model

        player.model.tournament_info.opponents = (await player.opponents()).map((opponent: freeObject) => opponent.player.BDM.resource())
        player.model.tournament_info.rounds = tournament.roundsByPlayer(player.model.id)

        return Tournament.BM.helpers.manageResponseData(mr, true, [exists_player_in_model.BDM.resource()])

    }, mr, "GET PLAYER FROM MODEL")
}