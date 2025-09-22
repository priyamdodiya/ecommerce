import { Request, Response } from "express";
import { changeQuantitySchema, CreateCartSchema } from "../schema/cart.ts";
import prisma from "../config/index.ts";
import { NotFoundException } from "../exceptions/not-found.ts";
import { ErrorCode } from "../exceptions/root.ts";
import { Product } from "@prisma/client";
import { UnauthorizedException } from "../exceptions/unauthorized.ts";

export const addItemToCart = async (req: Request, res: Response) => {
    console.log("Authorization Header:", req.headers.authorization);
    console.log("User after decode:", req.user);
    if (!req.user) {
        throw new UnauthorizedException("User not authenticated", ErrorCode.UNAUTHORIZED);
    }
    const validatedData = CreateCartSchema.parse(req.body)
    console.log(req.body)
    let product: Product;
    try {
        product = await prisma.product.findFirstOrThrow({
            where: {
                id: validatedData.productId
            }
        })
    } catch (error) {
        throw new NotFoundException("product not found", ErrorCode.PRODUCT_NOT_FOUND)
    }
    const cart = await prisma.cartItem.create({
        data: {
            userId: req.user.id,
            productId: product.id,
            quantity: validatedData.quantity
        }

    })
    res.json(cart)
}
export const deleteItemFromCart = async (req: Request, res: Response) => {
    try {
        const cartId = +req.params.id;
        const deletedItem = await prisma.cartItem.delete({
            where: {
                id: cartId,
            },
        });
        res.json({ success: true, id: deletedItem.id });
    } catch (error: any) {
        console.error(" Error deleting cart item:", error);
        res.status(500).json({ success: false, message: "Failed to delete cart item" });
    }
};

export const changeQuantity = async (req: Request, res: Response) => {
    const validatedData = changeQuantitySchema.parse(req.body)
    const updatedCart = await prisma.cartItem.update({
        where: {
            id: +req.params.id
        },
        data: {
            quantity: validatedData.quantity
        }
    })
    res.json(updatedCart)
}

export const getCart = async (req: Request, res: Response) => {
    if (!req.user) {
        throw new UnauthorizedException("User not authenticated", ErrorCode.UNAUTHORIZED);
    }
    try {
        const cart = await prisma.cartItem.findMany({
            where: {
                userId: req.user.id
            },
            include: {
                product: true
            }
        })
        res.json(cart)
    } catch (error) {
        console.log("error", error);
    }
}