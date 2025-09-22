import { Router } from "express";
import authMiddleware from "../middlewares/auth.ts";
import { errorHandler } from "../error-handler.ts";
import { addWishlist, deleteWishlist, getWishlist } from "../controllers/wishlist.ts";

const wishlistRoutes : Router = Router();

wishlistRoutes.get("/",[authMiddleware],errorHandler(getWishlist));
wishlistRoutes.post("/",[authMiddleware],errorHandler(addWishlist));
wishlistRoutes.delete("/:productId",[authMiddleware],errorHandler(deleteWishlist));

export default wishlistRoutes;