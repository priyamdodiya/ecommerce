import express from "express";
import type { Express } from "express";
import dotenv from "dotenv";
import rootRouter from "./routes/index.ts";
import cors from "cors";
import { errorMiddleware } from "./middlewares/errors.ts";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import cookieParser from "cookie-parser";
import Stripe from "stripe";

dotenv.config();
const app: Express = express();
const PORT = 3001;

app.get("/", (req, res) => {
  res.send(" Backend is running on Render!");
});


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

app.post(
  "/api/webhook/stripe",
  express.raw({ type: "application/json" }),
  (req, res) => {
    console.log("🔥 Stripe webhook received:", req.body.toString());
    const sig = req.headers["stripe-signature"];
    let event;
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig!,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err: any) {
      console.error(" Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log("💰 Payment success for session:", session.id);
        break;
      }
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        break;
      }
      case "charge.succeeded":
        const charge = event.data.object as Stripe.Charge;
        break;
      case "charge.updated":
        const updatedCharge = event.data.object as Stripe.Charge;
        break;

      default:
    }

    res.json({ received: true });
  }
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,POST,HEAD,PUT,DELETE,OPTIONS",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use("/api", rootRouter);
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use(errorMiddleware);

app.listen(PORT, async () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
