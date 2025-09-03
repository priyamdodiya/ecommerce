import { NextFunction, Request, Response } from "express"
import { compareSync, hashSync } from "bcrypt";
import prisma from "../config/index.ts";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { BadRequestsException } from "../exceptions/bad-requests.ts";
import { ErrorCode } from "../exceptions/root.ts";
import { SignUpSchema } from "../schema/users.ts";
import { NotFoundException } from "../exceptions/not-found.ts";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET as string;

export const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    SignUpSchema.parse(req.body);

    const { fullName, username, email, password, gender } = req.body;

    let user = await prisma.user.findFirst({ where: { OR: [{ email }, { username }] } });
    if (user) {
      throw new BadRequestsException("User already exists!", ErrorCode.USER_ALREADY_EXISTS);
    }

    const profilePhoto =
      gender === "male"
        ? `https://avatar.iran.liara.run/public/boy?username=${username}`
        : `https://avatar.iran.liara.run/public/girl?username=${username}`;

    user = await prisma.user.create({
      data: {
        fullName,
        username,
        email,
        gender,
        profilePhoto,
        password: hashSync(password, 10),
      },
    });

    res.status(201).json({ message: "User registered successfully", user });
  } catch (err) {
    next(err);
  }
};


export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, username, password } = req.body;
    const user = await prisma.user.findFirst({
      where: { AND: [{ email }, { username }] },
    });

    if (!user) {
      throw new NotFoundException("User not found.", ErrorCode.USER_NOTFOUND);
    }

    if (!compareSync(password, user.password)) {
      throw new BadRequestsException("Incorrect password", ErrorCode.INCORRECT_PASSWORD);
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1d" });

    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        gender: user.gender,
        profilePhoto: user.profilePhoto,
        role:user.role
      },
      token,
    });
  } catch (err) {
    next(err);
  }
};
export const me = async (req : Request, res : Response) =>{
    res.json(req.user)
}