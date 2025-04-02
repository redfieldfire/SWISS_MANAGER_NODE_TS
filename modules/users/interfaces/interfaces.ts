import { BasicDirectModel } from "../../../globals"
import { T_IndexModel, T_Model } from "../types"

export interface I_Model {
    model: T_Model
    BDM: BasicDirectModel
}

export interface I_Index {
    model: T_IndexModel
}