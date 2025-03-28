import { T_ResetTempData, T_SetResponse } from '../types';
import { I_Response } from './../interfaces/interfaces';

export class ManageResponse implements I_Response {
    key_fails = ""
    message_error: string | null = null
    successful = false
    data = [] as Array<any>
    
    constructor(successful?: boolean, message?: string, data?: Array<any>){
        if(successful) this.successful = successful
        if(message) this.message_error = message
        if(data) this.data = data
    }

    resetTempData: T_ResetTempData = () => {
        this.key_fails = ""
        this.message_error = null
        this.successful = false
        this.data = []
    }

    getResponse: T_SetResponse = () => {
        return {
            successful: this.successful,
            message: this.message_error ?? "", 
            data: this.data
        }
    }
}