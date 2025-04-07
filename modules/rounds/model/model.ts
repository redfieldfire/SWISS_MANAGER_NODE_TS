import { Main as Player } from '../../players/model';
import { modelStructure as emptyPlayer } from '../../players/DB/structures';
import { I_Index, I_Model } from '../interfaces';
import { T_IndexModel,  T_Model, T_Pair } from '../types';
import { BasicDirectModel, BasicModel } from '../../../globals';
import { FILE_PATH, HAS_MULTIPLE_FILES, INDEX_SUB_PATH, MAIN_DB_PATH_NAME, MAIN_INDEX_PATH_NAME, MODULE_DATA_JSON, MODULE_NAME } from '../config';
import { indexModelStructure, modelStructure } from '../DB/structures';

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
        this.BDM = new BasicDirectModel({BM: Main.BM, model: () => this.model})
    }

    makePairings(players: Array<Player>) {
        const unpaired: Array<Player> = [...players]
        const pairings: Array<T_Pair> = []

        //----------------------------CHECK IF NEEDS BYE
        if(unpaired.length % 2 !== 0){
            let byePlayerIndex = unpaired
            .slice()
            .sort(
                (a: Player, b: Player) => 
                            a.model.tournament_info.points - b.model.tournament_info.points
                            || 
                            a.model.tournament_info.buch - b.model.tournament_info.buch
            )
            .findIndex(p => !p.model.tournament_info.has_bay);

            if (byePlayerIndex !== -1) {
                let byePlayer = unpaired.splice(byePlayerIndex, 1)[0];
                players[byePlayer.model.id].model.tournament_info.has_bay = true;
                pairings.push({ white: byePlayer.model.user.name , white_id: 0, black: "", black_id: 0, outcome: 1 });
            }
        }

        //--------------------------- PAIR

        do {
            if (unpaired.length > 1) {
                let player1 = unpaired.shift() ?? new Player(emptyPlayer);

                let opponentIndex = unpaired.findIndex((p: Player) => !player1.hasPlayedWith(p.model.id));
                if (opponentIndex === -1) opponentIndex = 0;
        
                let player2 = unpaired.splice(opponentIndex, 1)[0];
        
                let white, black;
                if (player1.model.tournament_info.white_times > player1.model.tournament_info.black_times) {
                    white = player2;
                    black = player1;
                } else {
                    white = player1;
                    black = player2;
                }
        
                pairings.push({ white: white.name(), white_id: white.model.id, black: black.name(), black_id: black.model.id, outcome: 0 });
            
                white.model.tournament_info.opponents.push(black.likeOponent(1, null, this.model.id));
                black.model.tournament_info.opponents.push(white.likeOponent(-1, null, this.model.id));

            }
            else break
        } while (true)

        this.model.pairings = pairings
    }

    finish() {
        this.model.finished = true
    }
}

export default Main