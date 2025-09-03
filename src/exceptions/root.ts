export class HttpException extends Error {
    message: string;
    errorCode:any;
    statusCode:number;
    errors:ErrorCode;
    constructor(message : string, errorCode : any, statusCode : number,error:any){
        super(message)
        this.message = message
        this.errorCode = errorCode
        this.statusCode = statusCode
        this.errors = error
    }
}
export enum ErrorCode {
    USER_NOTFOUND = 1001,
    USER_ALREADY_EXISTS = 1002,
    ADDRESS_NOT_FOUND = 1004,
    ADDRESS_DOES_NOT_BELONG = 1005,
    INCORRECT_PASSWORD = 1003,
    UNPROCESSABLEENTITY = 2001,
    INTERNAL_EXCEPTION=3001,
    UNAUTHORIZED=4001,
    PRODUCT_NOT_FOUND = 5001,
    ORDER_NOT_FOUND = 6001,
    PASSWORD_MISMATCH = 1006
}