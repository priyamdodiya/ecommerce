import { Router } from "express";
import { stripeWebhook } from "../controllers/paymentController.ts";
import bodyParser from "body-parser";

const webhookRoutes = Router();

webhookRoutes.post(
  "/stripe",
  bodyParser.raw({ type: "application/json" }),
  stripeWebhook
);

export default webhookRoutes;
