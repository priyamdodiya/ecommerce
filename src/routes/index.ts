import {Router} from "express"
import authRoutes from "./auth.ts";
import productsRoutes from "./products.ts";
import usersRoutes from "./users.ts";
import cartRoutes from "./cart.ts";
import orderRoutes from "./orders.ts";
import paymentRoutes from "./payment.ts"
import wishlistRoutes from "./wishlist.ts";
import userRoutes from "./user.ts";


const rootRouter = Router();

rootRouter.use("/auth",authRoutes);
rootRouter.use("/user",userRoutes)
rootRouter.use("/products",productsRoutes);
rootRouter.use("/users",usersRoutes);
rootRouter.use("/carts",cartRoutes);
rootRouter.use("/orders",orderRoutes);
rootRouter.use("/payment",paymentRoutes);
rootRouter.use("/wishlist",wishlistRoutes)

export default rootRouter;
