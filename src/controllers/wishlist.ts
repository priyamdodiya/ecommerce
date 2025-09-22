import { Request, Response } from "express";
import prisma from "../config/index.ts";
import { UnauthorizedException } from "../exceptions/unauthorized.ts";
import { ErrorCode } from "../exceptions/root.ts";

export const getWishlist = async (req: Request, res: Response) => {
  if (!req.user) {
    throw new UnauthorizedException("User not authenticated", ErrorCode.UNAUTHORIZED);
  }

  try {
    const wishlist = await prisma.wishlistItem.findMany({
      where: { userId: req.user.id },
      include: { product: true },
    });
    res.json(wishlist.map(w => w.product));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const addWishlist = async (req: Request, res: Response) => {
  if (!req.user) {
    throw new UnauthorizedException("User not authenticated", ErrorCode.UNAUTHORIZED);
  }
  try {
    const { productId } = req.body;
    const item = await prisma.wishlistItem.create({
      data: { userId: req.user.id, productId },
    });

    res.json(item);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Product already in wishlist or invalid product" });
  }
};

export const deleteWishlist = async (req: Request, res: Response) => {
  if (!req.user) {
    throw new UnauthorizedException("User not authenticated", ErrorCode.UNAUTHORIZED);
  }

  try {
    const { productId } = req.params;

    await prisma.wishlistItem.deleteMany({
      where: { userId: req.user.id, productId: Number(productId) },
    });

    res.json({ message: "Removed from wishlist" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
