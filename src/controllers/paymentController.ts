import { Request, Response } from "express";
import prisma from "../config/index.ts";
import { stripe } from "../config/stripe";

export const stripeWebhook = async (req: Request, res: Response) => {
  console.log("💡 Webhook endpoint hit");
  const sig = req.headers["stripe-signature"] as string;
  console.log("🔑 Stripe signature:", sig);

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
    console.log("✅ Webhook signature verified successfully");
  } catch (err: any) {
    console.error("❌ Webhook signature verification failed.", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log("📦 Event type:", event.type);

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any;
    console.log("🛒 Checkout session object:", session);

    const userId = Number(session.metadata.userId);
    console.log("👤 User ID from session metadata:", userId);

    await prisma.$transaction(async (tx) => {
      const cartItems = await tx.cartItem.findMany({
        where: { userId },
        include: { product: true },
      });
      console.log("🛍️ Cart items fetched:", cartItems);

      if (cartItems.length === 0) {
        console.log("⚠️ Cart is empty, nothing to create");
        return;
      }

      const netAmount = cartItems.reduce(
        (sum, item) => sum + item.quantity * Number(item.product.price),
        0
      );
      console.log("💰 Calculated net amount:", netAmount);

      const order = await tx.order.create({
        data: {
          userId,
          netAmount,
          address: "",
          products: {
            create: cartItems.map((c) => {
              console.log("📄 Creating order product:", {
                productId: c.productId,
                quantity: c.quantity,
              });
              return {
                productId: c.productId,
                quantity: c.quantity,
              };
            }),
          },
        },
      });
      console.log("✅ Order created:", order);

      const deletedCart = await tx.cartItem.deleteMany({
        where: { userId },
      });
      console.log("🗑️ Cart items deleted:", deletedCart);
    });
  }

  console.log("🎉 Webhook processed successfully");
  res.json({ received: true });
};