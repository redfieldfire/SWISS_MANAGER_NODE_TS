import { T_RequestResponse } from "../../../globals"
import { indexModelStructure, modelStructure } from "../DB/structures"
import { Main } from "../model"
import { Main as User } from "../../users/model"

//---------------------------------------- MODELS

export type T_Model = typeof modelStructure
export type T_CollectionModel = Array<T_Model>
export type T_IndexModel = typeof indexModelStructure
export type T_CollectionIndexModel = Array<T_IndexModel>

//---------------------------------------- MODEL TRANFORM

export type T_Resource = (row: any) => T_Model
export type T_Collection = (rows: any) => T_CollectionModel
export type T_IndexResource = (row: any) => T_IndexModel
export type T_CollectionIndex = (rows: any) => T_CollectionIndexModel

//--------------------------------------- BASIC CONTROLLER

export type T_BasicModelFunctionFind = (id: number) => Promise<T_RequestResponse>
export type T_BasicModelFunctionGet = (page: number) => T_RequestResponse
export type T_BasicModelFunctionCreate = (row: T_Model) => Promise<T_RequestResponse>
export type T_BasicModelFunctionUpdate = (id: number, row: T_Model) => Promise<T_RequestResponse>
export type T_BasicModelFunctionEnable = (id: number) => Promise<T_RequestResponse>
export type T_BasicModelFunctionDisable = (id: number) => Promise<T_RequestResponse>

//--------------------------------------- EXTRA

export type T_Constructor = {
    id: number,
    user_id: number,
    visible?: boolean,
    tournament_info?: T_TournamentInfo
}

export type T_Opponent = {
    opponent: Main,
    color: number,
    win: boolean,
    lose: boolean,
    round: number
}

export type T_Info = {
    user: User,
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

