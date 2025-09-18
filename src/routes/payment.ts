import { Router } from "express";
import { errorHandler } from "../error-handler.ts";
import { createCheckoutSession, getCheckoutSession } from "../controllers/payment.ts";

import  authMiddleware  from "../middlewares/auth"; 

const paymentRoutes = Router();

paymentRoutes.post("/checkout",[authMiddleware],errorHandler(createCheckoutSession));

paymentRoutes.get(
  "/session/:sessionId",
  [authMiddleware],
  errorHandler(getCheckoutSession)
);

export default paymentRoutes;