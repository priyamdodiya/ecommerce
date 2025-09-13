import { Request, Response } from "express"
import prisma from "../config/index.ts"
import { NotFoundException } from "../exceptions/not-found.ts";
import { ErrorCode } from "../exceptions/root.ts";

export const createOrder = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  return await prisma.$transaction(async (tx) => {
    const cartItems = await tx.cartItem.findMany({
      where: { userId: req.user!.id },
      include: { product: true },
    });

    if (cartItems.length === 0) {
      return res.json({ message: "cart is empty" });
    }

    const price = cartItems.reduce((prev, current) => {
      return prev + current.quantity * Number(current.product.price);
    }, 0);

    const address = await tx.address.findFirst({
      where: { id: req.user!.defaultShippingAddress ?? undefined },
    });

    const order = await tx.order.create({
      data: {
        userId: req.user!.id,
        netAmount: price,
        address: address?.formattedAddress ?? "",
        products: {
          create: cartItems.map((cart) => ({
            productId: cart.productId,
            quantity: cart.quantity,
          })),
        },
      },
    });

    await tx.orderEvent.create({
      data: { orderId: order.id, status: "PENDING" },
    });

    await tx.cartItem.deleteMany({
      where: { userId: req.user!.id },
    });

    return res.json(order);
  });
};


export const listOrders = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const orders = await prisma.order.findMany({
    where: { userId: req.user.id },
  });
  res.json(orders);
};


export const cancelOrder = async (req: Request, res: Response) => {
  try {
    const order = await prisma.$transaction(async (tx) => {
      const updatedOrder = await tx.order.update({
        where: { id: +req.params.id },
        data: { status: "CANCELLED" },
      });

      await tx.orderEvent.create({
        data: { orderId: updatedOrder.id, status: "CANCELLED" },
      });

      return updatedOrder;
    });

    res.json(order);
  } catch (error) {
    throw new NotFoundException("Order not found.", ErrorCode.ORDER_NOT_FOUND);
  }
};


export const getOrderById = async (req: Request, res: Response) => {
  try {
    const order = await prisma.order.findFirstOrThrow({
      where: { id: +req.params.id },
      include: { products: true, events: true },
    });

    res.json(order);
  } catch (error) {
    throw new NotFoundException("Order not found.", ErrorCode.ORDER_NOT_FOUND);
  }
};


//admin side

export const listAllOrders = async (req: Request, res: Response) => {
  let whereClause = {}
  const status = req.query.status
  if (status) {
    whereClause = {
      status
    }
  }
  const orders = await prisma.order.findMany({
    where: whereClause,
    skip: Number(req.query.skip ?? 0),
    take: 5
  })
  res.json(orders)
}

export const changeStatus = async (req: Request, res: Response) => {
  try {
    const order = await prisma.order.update({
      where: {
        id: +req.params.id
      },
      data : {
        status : req.body.status
      }
    });
    await prisma.orderEvent.create({
      data : {
        orderId : order.id,
        status : req.body.status
      }
    })
    res.json(order);
  } catch (error) {
    throw new NotFoundException("Order not found.", ErrorCode.ORDER_NOT_FOUND);
  }
}



export const listUserOrders = async (req: Request, res: Response) => {
    let whereClause : any = {
      userId : +req.params.id
    }
  const status = req.params.status
  if (status) {
    whereClause = {
      ...whereClause,
      status
    }
  }
  const orders = await prisma.order.findMany({
    where: whereClause,
    skip: Number(req.query.skip ?? 0),
    take: 5
  })
  res.json(orders)
}