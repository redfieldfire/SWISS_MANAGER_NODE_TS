import { I_Index, I_Model } from '../interfaces';
import { T_IndexModel,  T_Model } from '../types';
import { BasicDirectModel, BasicModel } from '../../../globals';
import { FILE_PATH, HAS_MULTIPLE_FILES, INDEX_SUB_PATH, MAIN_DB_PATH_NAME, MAIN_INDEX_PATH_NAME, MODULE_DATA_JSON, MODULE_NAME } from '../config';
import { indexModelStructure, modelStructure } from '../DB/structures';

import { T_Model as T_ModelPlayer, T_Collection as T_Players } from '../../players/types';
import { Main as Player } from '../../players/model';

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
                    players: this.model.players.map((player: Player) => new Player(player.model).BDM.resource())
                }
            }
        })
        this.model.players = this.model.players.map((player: T_ModelPlayer) => new Player({id: player.id, user_id: player.user_id, visible: player.visible, tournament_info: player.tournament_info}))
    }

    searchPlayerBy(user_id: number) {
        return this.model.players.find((player: Player) => player.model.user_id == user_id)
    }

    searchPlayerWithoutTrashedBy(user_id: number) {
        return this.model.players.find((player: Player) => player.model.user_id == user_id && player.model.visible)
    }

}

export default Main