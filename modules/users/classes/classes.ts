import { GLOBALS } from '../../../globals';
import { MODULE_DATA_JSON } from '../config';
import { modelStructure } from '../DB/structures';
import { I_Index, I_Model, I_Player } from '../interfaces';
import { T_ContructorPlayer, T_IndexModel, T_Model, T_Opponent, T_PlayedAndWinWith, T_PlayedWith, T_TournamentInfo } from '../types';

export class Main implements I_Model {

    model = {}

    constructor(model: T_Model) {
        this.model = model
    }
    
}

export class Index implements I_Index {
    
    model = {}

    constructor(model: T_IndexModel) {
        this.model = model
    }
}

export class Player implements I_Player {
    
    model = {
        id: 0,
        user_id: 0,
        user: new Main(modelStructure),
        tournament_info: {
            has_bay: false,
            last_color: null,
            white_times: 0,
            black_times: 0,
            points: 0,
            opponents: [] as Array<T_Opponent>
        } as T_TournamentInfo
    }

    constructor({id, user_id, tournament_info}: T_ContructorPlayer) {
        this.model.id = id
        this.model.user_id = user_id
        this.model.user = new Main(GLOBALS[MODULE_DATA_JSON][user_id])
        if(tournament_info) this.model.tournament_info = tournament_info
    }

    buch = () => {
        return this.model.tournament_info.opponents.reduce((accum, item) => accum + (item.win ? item.opponent.model.tournament_info.points : 0), 0)
    };

    hasPlayedWith: T_PlayedWith = (id) => {
       return Boolean(this.model.tournament_info.opponents.filter((item) => item.opponent.model.user_id == id).length)
    }

    hasPlayedAndWinWith: T_PlayedAndWinWith = (id) => {
        return Boolean(this.model.tournament_info.opponents.filter((item) => item.win && item.opponent.model.user_id == id).length)
    }
    
}

export default Main