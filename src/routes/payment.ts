import { Router } from "express";
import { errorHandler } from "../error-handler.ts";
import { createCheckoutSession } from "../controllers/payment.ts";
import  authMiddleware  from "../middlewares/auth"; 
const paymentRoutes = Router();

paymentRoutes.post("/checkout",[authMiddleware],errorHandler(createCheckoutSession));

export default paymentRoutes;