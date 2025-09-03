import {Request,Response} from "express"
import prisma from "../config/index.ts";
import { NotFoundException } from "../exceptions/not-found.ts";
import { ErrorCode } from "../exceptions/root.ts";

export const createProduct = async(req : Request, res : Response) =>{
    const product = await prisma.product.create({
        data : {
            ...req.body,
            tags : req.body.tags.join(",")
        }
    })
    res.json(product)
}

export const updateProduct = async (req : Request,res : Response) =>{
    try{
        const product = req.body;
        if(product.tags){
            product.tags = product.tags.join(",")
        }
        const updateProduct = await prisma.product.update({
            where : {
                id : +req.params.id
            },
            data : product
        })
        res.json(updateProduct)
    }catch{
        throw new NotFoundException("product not found", ErrorCode.PRODUCT_NOT_FOUND)
    }
}

export const deleteProduct = async (req : Request,res : Response) =>{
try {
    const deleteProduct = await prisma.product.delete({
        where : {
            id : +req.params.id
        }
    })
    res.json({
        message : "Product deleted successfully..!",
        product : deleteProduct
    })
} catch (error) {
    throw new NotFoundException("product not found",ErrorCode.PRODUCT_NOT_FOUND)
}
}

export const listProducts = async (req: Request, res: Response) => {
  const skip = Number(req.query.skip ?? 0);
  const take = 5;

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      skip,
      take,
    }),
    prisma.product.count(),
  ]);

  res.json({
    total,
    data: products,
  });
};

export const getProductById = async (req : Request,res : Response) =>{
    try{
        const product = await prisma.product.findFirstOrThrow({
            where : {
                id : +req.params.id
            }
        })
        res.json(product)
    }catch(error){
            throw new NotFoundException("product not found",ErrorCode.PRODUCT_NOT_FOUND)
    }
}
