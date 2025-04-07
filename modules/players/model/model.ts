import { I_Index, I_Model } from '../interfaces';
import { T_IndexModel,  T_LikeOpponent,  T_Model, T_Opponent, T_PlayedAndWinWith, T_PlayedWith } from '../types';
import { BasicDirectModel, BasicModel, freeObject, GLOBALS } from '../../../globals';
import { FILE_PATH, HAS_MULTIPLE_FILES, INDEX_SUB_PATH, MAIN_DB_PATH_NAME, MAIN_INDEX_PATH_NAME, MODULE_DATA_JSON, MODULE_NAME } from '../config';
import { indexModelStructure, modelStructure } from '../DB/structures';

import { MODULE_DATA_JSON as user_module_data_json } from '../../users/config';
import { Main as Tournament } from '../../tournaments/model';

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
        this.BDM = new BasicDirectModel({
            BM: Main.BM,
            model: () => this.model,
            resource: () => {
                return {
                    ...this.model,
                    user: GLOBALS[user_module_data_json][this.model.user_id]
                }
            }
        })
    }

    //-------------------------------------   RELATIONS/CONVERTIONS

    user() {
        return GLOBALS[user_module_data_json][this.model.user_id]
    }

    name() {
        return this.user().name
    }

    async tournament() {
        return (await Tournament.BM.find(this.model.tournament_id)).data[0] as Tournament
    }

    async buch () {
        return (await this.opponents()).reduce((accum: number, item: freeObject) => accum + (item.win ? item.player.tournament_info.points : 0), 0)
    };

    async opponents() {

        const tournament = await this.tournament()

        if(this.model.tournament_info.opponents) {
            return this.model.tournament_info.opponents.map(async (opponent: T_Opponent) => {
                return {
                    ...opponent,
                    user: this.user(),
                    player: tournament.searchPlayerBy(opponent.player_id)
                }
            })
        }
        return []
    }

    //-------------------------------------------------------------

    likeOponent: T_LikeOpponent = (color, win, round) => {
        return {
            player_id: this.model.id,
            user_id: this.model.user_id,
            color: color,
            win: win,
            round: round
        }
    }

    hasPlayedWith: T_PlayedWith = (id) => {
       return Boolean(this.model.tournament_info.opponents.filter((item: T_Opponent) => item.user_id == id).length)
    }

    hasPlayedAndWinWith: T_PlayedAndWinWith = (id) => {
        return Boolean(this.model.tournament_info.opponents.filter((item: T_Opponent) => item.win && item.user_id == id).length)
    }

}

export default Main