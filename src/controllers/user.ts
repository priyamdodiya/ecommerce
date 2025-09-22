import {Request, Response, NextFunction} from "express"
import prisma from "../config/index.ts"

export const updateProfile = async (req : Request,res : Response, next : NextFunction) => {
    try {
        const userId = (req as any).user?.id;
        const {fullName,email, username,gender} = req.body;
        const updatedUser = await prisma.user.update({
            where : {id : userId},
            data : {fullName,email,username,gender},
        })
        res.json({
            message : "Profile updated successfully",
            user : updatedUser,
        })
    } catch (err) {
        next(err)
    }
}

export const updatedProfilePhoto = async (req : Request,res : Response, next : NextFunction) => {
    try {
        const userId = (req as any).user?.id;
        if(!req.file){
            return res.status(400).json({ message: "No file uploaded" });
        }
        const photoUrl = `/uploads/${req.file.filename}`;
        const updatedUser = await prisma.user.update({
            where : {id : userId},
            data : {
                profilePhoto : photoUrl
            }
        })
        res.json({
            message : "Profile photo updated successfully",
            user : updatedUser,
        })
    } catch (err) {
        next()
    }
}

export const removeProfilePhoto = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { username: true, gender: true },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const gender = user.gender?.toLowerCase() ?? "male";

    const defaultAvatar =
      gender === "male"
        ? `https://avatar.iran.liara.run/public/boy?username=${user.username}`
        : `https://avatar.iran.liara.run/public/girl?username=${user.username}`;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { profilePhoto: defaultAvatar },
    });

    res.json({
      message: "Profile photo removed successfully",
      user: updatedUser,
    });
  } catch (err) {
    next(err);
  }
};