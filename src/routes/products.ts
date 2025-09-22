import { Router } from "express";
import { errorHandler } from "../error-handler.ts";
import { createProduct, deleteProduct, getProductById, listProducts, updateProduct } from "../controllers/products.ts";
import authMiddleware from "../middlewares/auth.ts";
import adminMiddleware from "../middlewares/admin.ts";
import { upload } from "../middlewares/upload.ts";
const productsRoutes : Router = Router();

productsRoutes.post("/",upload.single("image"),errorHandler(createProduct));
productsRoutes.put("/:id",[authMiddleware, adminMiddleware, upload.single("image")],errorHandler(updateProduct));

productsRoutes.delete("/:id",[authMiddleware,adminMiddleware],errorHandler(deleteProduct));
productsRoutes.get("/",errorHandler(listProducts));
productsRoutes.get("/:id",errorHandler(getProductById))

export default productsRoutes;