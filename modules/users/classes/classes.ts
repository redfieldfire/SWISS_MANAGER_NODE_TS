import { modelStructure } from '../DB/structures';
import { I_Index, I_Model, I_Player } from '../interfaces';
import { T_IndexModel, T_Model, T_Opponent } from '../types';

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

/*export class Player implements I_Player {
    
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
        }
    }

    constructor(model: any) {
        this.model = model
    }

    buch = () => {
        return this.tournament_info.opponents.reduce((accum, item) => accum + (item.win ? item.opponent.tournament_info.points : 0), 0)
    };

    hasPlayedWith: T_PlayedWith = (id) => {
       return Boolean(this.tournament_info.opponents.filter((item) => item.opponent.user.id == id).length)
    }

    hasPlayedAndWinWith: T_PlayedAndWinWith = (id) => {
        return Boolean(this.tournament_info.opponents.filter((item) => item.win && item.opponent.user.id == id).length)
    }

    printInfo: T_PrintInfo = () => {
        return {
            user: this.user,
            points: this.tournament_info.points,
            buch: this.buch()
        }
    }

    printOpponents: T_PrintOpponents = () => {
        return this.tournament_info.opponents
    }
    
}*/

export default Main