import { Request, Response } from "express";
import { stripe } from "../config/stripe";
import { UnauthorizedException } from "../exceptions/unauthorized";
import { ErrorCode } from "../exceptions/root";

export const createCheckoutSession = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      throw new UnauthorizedException("User not authenticated", ErrorCode.UNAUTHORIZED);
    }

    const { cartItems, orderSummary } = req.body;
    console.log("orderSummary::: ", orderSummary);

    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({ message: "Cart items are required" });
    }

    let coupon;
    if (orderSummary.discount > 0) {
      coupon = await stripe.coupons.create({
        amount_off: orderSummary.discount * 100,
        currency: "inr",
        duration: "once",
      });
    }
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],

      line_items: cartItems.map((item: any) => ({
        price_data: {
          currency: "inr",
          product_data: {
            name: item.product?.name || item.name,
            images: item.product?.image
              ? [`${process.env.IMAGE_CDN_URL}${item.product.image}`]
              : [],
          },
          unit_amount: Number(item.price) * 100,
        },
        quantity: item.quantity,
      })),

      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/success`,
      cancel_url: `${process.env.FRONTEND_URL}/cart`,
      customer_email: req.user.email,

      discounts: coupon ? [{ coupon: coupon.id }] : [],

      metadata: {
        userId: req.user.id.toString(),
      },
    });

    return res.json({ id: session.id, url: session.url });
  } catch (error: any) {
    console.error("Stripe Error:", error);
    return res.status(500).json({ error: error.message });
  }
};
