import { T_IndexModel, T_Model, T_ModelPlayer } from "../types"
import { Main } from "../classes"
import { T_Buch, T_PlayedWith, T_PlayedAndWinWith, T_TournamentInfo } from "../types"

export interface I_Model {
    model: T_Model
}

export interface I_Index {
    model: T_IndexModel
}

export interface I_Player {
    model: T_ModelPlayer
    buch: T_Buch
    hasPlayedWith: T_PlayedWith
    hasPlayedAndWinWith: T_PlayedAndWinWith
}