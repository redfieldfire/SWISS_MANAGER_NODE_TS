import { Main } from "../../classes"

export const modelStructure: {[index: string]: any} = {
    id: 0,
    name: "",
    last_name: "",
    age: 0,
    elo: 0,
    visible: true
}

export const indexModelStructure: {[index: string]: any} = {
    id: 0,
    file_name: "",
    visible: true
}

export const modelPlayerStructure: {[index: string]: any} = {
        id: 0,
        user_id: 0,
        user: new Main(modelStructure),
        tournament_info: {
            has_bay: false,
            last_color: null,
            white_times: 0,
            black_times: 0,
            points: 0,
            opponents: []
        }
}