import { T_Model } from "../types";
import { T_Request } from "../../../globals/types";
import { validateRequest } from "../../../globals";
import { Response } from "express";
import { modelStructure } from "../DB/structures";

export const modelRequest: T_Request = (row: T_Model, res: Response) => {
    const {id, visible, ...rest} = modelStructure
    return validateRequest(row, rest, res)
}

export const addPlayerRequest: T_Request = (row: T_Model, res: Response) => {
    return validateRequest(row, {user_id: 0}, res)
}