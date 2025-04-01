import { I_Index, I_Model } from '../interfaces';
import { T_Buch, T_Constructor, T_IndexModel,  T_Model, T_Opponent, T_PlayedAndWinWith, T_PlayedWith } from '../types';
import { BasicModel, GLOBALS, logError } from '../../../globals';
import { FILE_PATH, HAS_MULTIPLE_FILES, INDEX_SUB_PATH, MAIN_DB_PATH_NAME, MAIN_INDEX_PATH_NAME, MODULE_DATA_JSON, MODULE_NAME } from '../config';
import { indexModelStructure, modelStructure } from '../DB/structures';

import { Main as User } from '../../users/model';
import { MODULE_DATA_JSON as user_module_data_json } from '../../users/config';

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

    constructor({id, user_id, visible, tournament_info}: T_Constructor) {
        this.model.id = id
        this.model.user_id = user_id
        this.model.user = new User(GLOBALS[user_module_data_json][user_id])
        if(tournament_info) this.model.tournament_info = tournament_info
        this.model.visible = visible ?? true 
    }

    buch: T_Buch = () => {
        return this.model.tournament_info.opponents.reduce((accum: number, item: T_Opponent) => accum + (item.win ? item.opponent.model.tournament_info.points : 0), 0)
    };

    hasPlayedWith: T_PlayedWith = (id) => {
       return Boolean(this.model.tournament_info.opponents.filter((item: T_Opponent) => item.opponent.model.user_id == id).length)
    }

    hasPlayedAndWinWith: T_PlayedAndWinWith = (id) => {
        return Boolean(this.model.tournament_info.opponents.filter((item: T_Opponent) => item.win && item.opponent.model.user_id == id).length)
    }
}

export default Main