import { Router } from "express";
import { removeProfilePhoto, updatedProfilePhoto, updateProfile } from "../controllers/user";
import authMiddleware from "../middlewares/auth";
import { errorHandler } from "../error-handler";
import { upload } from "../middlewares/upload";

const userRoutes = Router();

userRoutes.put("/update",[authMiddleware],errorHandler(updateProfile));

userRoutes.put("/update-photo",[authMiddleware],upload.single("profilePhoto"),updatedProfilePhoto);

userRoutes.put("/remove-photo", [authMiddleware], errorHandler(removeProfilePhoto));

export default userRoutes;