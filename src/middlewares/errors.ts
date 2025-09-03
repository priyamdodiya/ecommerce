// import { NextFunction,Request, Response } from "express";
// import { HttpException } from "../exceptions/root.ts";

// export const errorMiddleware = (error : HttpException, req : Request, res : Response, next : NextFunction) =>{
//     res.status(error.statusCode).json({
//         message : error.message,
//         errorCode : error.errorCode,
//         errors : error.errors
//     })
// }


import { NextFunction, Request, Response, ErrorRequestHandler } from "express";
import { HttpException } from "../exceptions/root.ts";

export const errorMiddleware: ErrorRequestHandler = (error: HttpException, req, res, next) => {
  res.status(error.statusCode || 500).json({
    message: error.message,
    errorCode: error.errorCode,
    errors: error.errors
  });
};
