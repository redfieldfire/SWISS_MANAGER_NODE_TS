import { T_Buch, T_IndexModel, T_Model, T_PlayedAndWinWith, T_PlayedWith } from "../types"

export interface I_Model {
    model: T_Model
    buch: T_Buch
    hasPlayedWith: T_PlayedWith
    hasPlayedAndWinWith: T_PlayedAndWinWith
}

export interface I_Index {
    model: T_IndexModel
}