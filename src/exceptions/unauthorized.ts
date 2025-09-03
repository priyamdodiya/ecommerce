import { HttpException } from "./root.ts";

export class UnauthorizedException extends HttpException{
    constructor(message : string,errorCode : number, errors?:any){
        super(message,errorCode,400,errors)
    }
}