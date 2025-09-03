import { NextFunction,Request,Response } from "express";
import { UnauthorizedException } from "../exceptions/unauthorized.ts";
import { ErrorCode } from "../exceptions/root.ts";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import prisma from "../config/index.ts";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET as string;
const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization;
  if (!token) {
    return next(new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED));
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    const user = await prisma.user.findFirst({ where: { id: payload.userId } });
    if (!user) {
      return next(new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED));
    }
    req.user = user;
    next();
  } catch (error) {
    next(new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED));
  }
};
export default authMiddleware;