import {Router} from "express"
import authRoutes from "./auth.ts";
import productsRoutes from "./products.ts";
import usersRoutes from "./users.ts";
import cartRoutes from "./cart.ts";
import orderRoutes from "./orders.ts";

const rootRouter = Router();

rootRouter.use("/auth",authRoutes);
rootRouter.use("/products",productsRoutes)
rootRouter.use("/users",usersRoutes)
rootRouter.use("/carts",cartRoutes)
rootRouter.use("/orders",orderRoutes)

export default rootRouter;