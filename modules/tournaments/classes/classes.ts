import { Player } from '../../users/classes';
import { T_ModelPlayer } from '../../users/types';
import { I_Index, I_Model } from '../interfaces';
import { T_IndexModel, T_Model } from '../types';

export class Main implements I_Model {

    model = {} as {[index: string]: any}

    constructor(model: T_Model) {
        this.model = model
        this.model.players = this.model.players.map((player: T_ModelPlayer) => new Player({id: player.id, user_id: player.user_id, tournament_info: player.tournament_info}))
    }
    
}

export class Index implements I_Index {
    
    model = {}

    constructor(model: T_IndexModel) {
        this.model = model
    }
}

export default Main