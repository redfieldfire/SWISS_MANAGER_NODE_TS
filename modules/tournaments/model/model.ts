import { I_Index, I_Model } from '../interfaces';
import { T_IndexModel,  T_Model } from '../types';
import { BasicDirectModel, BasicModel, freeObject, GLOBALS } from '../../../globals';
import { FILE_PATH, HAS_MULTIPLE_FILES, INDEX_SUB_PATH, MAIN_DB_PATH_NAME, MAIN_INDEX_PATH_NAME, MODULE_DATA_JSON, MODULE_NAME } from '../config';
import { indexModelStructure, modelStructure } from '../DB/structures';

import { T_Model as T_Player } from '../../players/types';
import { T_Model as T_Round } from '../../rounds/types';

import { MODULE_DATA_JSON as users_data_json } from '../../users/config';

import { Main as Player } from '../../players/model';
import { Main as Round } from '../../rounds/model';

export class Index implements I_Index {
    
    model = {}

    constructor(model: T_IndexModel) {
        this.model = model
    }
}

export class Main implements I_Model {

    model = {} as T_Model
    static BM = new BasicModel({
        Main: this,
        Index,
        module_name: MODULE_NAME, 
        module_data_json: MODULE_DATA_JSON, 
        index_sub_path: INDEX_SUB_PATH, 
        file_path: FILE_PATH,
        main_db_path_name: MAIN_DB_PATH_NAME,
        main_index_path_name: MAIN_INDEX_PATH_NAME, 
        has_multiple_files: HAS_MULTIPLE_FILES, 
        model_structure: modelStructure, 
        index_model_structure: indexModelStructure
    })
    BDM

    constructor(model: T_Model) {
        this.model = model
        this.model.players = this.model.players.map((player: T_Player) => new Player(player))
        this.model.rounds = this.model.rounds.map((round: T_Round) => new Round(round))
        this.BDM = new BasicDirectModel({
            BM: Main.BM,
            model: () => this.model,
            resource: () => {
                return {
                    ...this.model,
                    players: this.model.players.map((player: Player) => player.BDM.resource()),
                    rounds: this.model.rounds.map((round: Round) => round.BDM.resource())
                }
            }
        })
    }

    searchPlayerBy(user_id: number) {
        return this.model.players.find((player: Player) => player.model.user_id == user_id)
    }

    playersWithoutTrashed() {
        return this.model.players.filter((player: Player) => player.model.visible)
    }

    searchPlayerWithoutTrashedBy(user_id: number) {
        return this.model.players.find((player: Player) => player.model.user_id == user_id && player.model.visible)
    }

    async orderPlayers() {
        return await this.model.players.sort(async (a: Player, b: Player) => a.model.tournament_info.points + b.model.tournament_info.points && (await a.buch()) + (await b.buch()))
    }

}

export default Main