import { ErrorCode, HttpException } from "./root.ts";
export class BadRequestsException extends HttpException {
    constructor(message : string, errorCode : ErrorCode){
        super(message,errorCode, 400, null)
    }
}