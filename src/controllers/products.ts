import { Request, Response } from "express"
import prisma from "../config/index.ts";
import { NotFoundException } from "../exceptions/not-found.ts";
import { ErrorCode } from "../exceptions/root.ts";
import { Prisma } from "@prisma/client";
export const createProduct = async (req: Request, res: Response) => {
  console.log("req.body:", req.body);
  console.log("req.file:", req.file);
  try {
    const { name, description, price,discountPrice, stock } = req.body;
    if (!name || !description || !price) {
      return res.status(400).json({
        message: "Product name, description, and price are required",
      });
    }
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: Number(price),
        discountPrice: discountPrice ? Number(discountPrice) : null,
        stock: stock ? Number(stock) : 0,
        image: imagePath,
        isAvailable: stock && Number(stock) > 0 ? true : false,
      },
    });
    res.status(201).json(product);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      message: "Something went wrong while creating product",
      error: error.message,
    });
  }
}

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const product = req.body;
    if (product.tags) {
      product.tags = product.tags.join(",")
    }
    const updateProduct = await prisma.product.update({
      where: {
        id: +req.params.id
      },
      data: product
    })
    res.json(updateProduct)
  } catch {
    throw new NotFoundException("product not found", ErrorCode.PRODUCT_NOT_FOUND)
  }
}

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const deleteProduct = await prisma.product.delete({
      where: {
        id: +req.params.id
      }
    })
    res.json({
      message: "Product deleted successfully..!",
      product: deleteProduct
    })
  } catch (error) {
    throw new NotFoundException("product not found", ErrorCode.PRODUCT_NOT_FOUND)
  }
}

export const listProducts = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany();
    const total = await prisma.product.count();

    res.json({
      total,
      data: products,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      message: "Something went wrong while fetching products",
      error: error.message,
    });
  }
};



export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await prisma.product.findFirstOrThrow({
      where: {
        id: +req.params.id
      }
    })
    res.json(product)
  } catch (error) {
    throw new NotFoundException("product not found", ErrorCode.PRODUCT_NOT_FOUND)
  }
}
