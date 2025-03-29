import { I_Index, I_Model } from '../interfaces';
import { T_IndexModel, T_Model } from '../types';

export class Main implements I_Model {

    model = {} as {[index: string]: any}

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

export default Main