import { T_IndexModel, T_Model } from "../types"
import { Main } from "../classes"
import { T_Buch, T_PlayedWith, T_PlayedAndWinWith, T_PrintInfo, T_PrintOpponents, T_TournamentInfo } from "../types"

export interface I_Model {
    model: T_Model
}

export interface I_Index {
    model: T_IndexModel
}

export interface I_Player {
    id: number
    user_id: number
    user: Main
    tournament_info: T_TournamentInfo
    buch: T_Buch
    hasPlayedWith: T_PlayedWith
    hasPlayedAndWinWith: T_PlayedAndWinWith
    printInfo: T_PrintInfo
    printOpponents: T_PrintOpponents
}