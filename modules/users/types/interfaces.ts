import { Main, Player } from "../classes"

//---------------------------------------- INTERFACES

export type T_ContructorPlayer = {
    id: number,
    user_id: number,
    tournament_info?: T_TournamentInfo
}

export type T_Opponent = {
    opponent: Player,
    color: number,
    win: boolean,
    lose: boolean,
    round: number
}

export type T_Info = {
    user: Main,
    points: number,
    buch: number
}

export type T_TournamentInfo = {
    has_bay: boolean
    last_color: boolean | null
    white_times: number
    black_times: number
    points: number
    opponents: Array<T_Opponent>
}

export type T_Buch = () => number
export type T_PlayedWith = (id: number) => boolean
export type T_PlayedAndWinWith = (id: number) => boolean