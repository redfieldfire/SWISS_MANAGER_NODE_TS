
import { Main as User } from "../../../users/model"
import { modelStructure as UserStructure } from "../../../users/DB/structures"

export const modelStructure: {[index: string]: any} = {
    id: 0,
    user_id: 0,
    user: new User(UserStructure),
    tournament_info: {
        has_bay: false,
        last_color: null,
        white_times: 0,
        black_times: 0,
        points: 0,
        opponents: []
    },
    visible: true
}

export const indexModelStructure: {[index: string]: any} = {
    id: 0,
    file_name: "",
    visible: true
}