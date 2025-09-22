import { Request, Response } from "express"
import { AddressSchema, UpdateUserSchema } from "../schema/users.ts"
import prisma from "../config/index.ts";
import { NotFoundException } from "../exceptions/not-found.ts";
import { ErrorCode } from "../exceptions/root.ts";
import { BadRequestsException } from "../exceptions/bad-requests.ts";
import { User, Address } from "@prisma/client";
import { UnauthorizedException } from "../exceptions/unauthorized.ts";

export const addAddress = async (req: Request, res: Response) => {
    AddressSchema.parse(req.body)
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const address = await prisma.address.create({
        data: {
            ...req.body,
            userId: req.user.id
        }
    })
    res.json(address)
}

export const deleteAddress = async (req: Request, res: Response) => {
    try {
        await prisma.address.delete({
            where : {
                id : +req.params.id
            }
        })
        res.json({success : true})
    } catch (error) {
        throw new NotFoundException("address not found",ErrorCode.ADDRESS_NOT_FOUND)
    }
}

export const listAddress = async (req: Request, res: Response) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const address = await prisma.address.findMany({
        where : {
            userId : req.user.id
        }
    })
    res.json(address)
}


export const updateUser = async(req : Request,res : Response) =>{
    if (!req.user) {
    throw new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED);
  }
    const validatedData = UpdateUserSchema.parse(req.body)
    let shippingAddress : Address;
    let billingAddress : Address;
    if(validatedData.defaultShippingAddress){
        try{
            shippingAddress = await prisma.address.findFirstOrThrow({
                where : {
                    id : validatedData.defaultShippingAddress
                }
            })
        }
        catch(error){
            throw new NotFoundException("address not found",ErrorCode.ADDRESS_NOT_FOUND)
        }
        if(shippingAddress.userId != req.user.id){
                throw new BadRequestsException("address does not belong to user",ErrorCode.ADDRESS_DOES_NOT_BELONG)
            }
    }
    if(validatedData.defaultBillingAddress){
        try{
            billingAddress = await prisma.address.findFirstOrThrow({
                where : {
                    id : validatedData.defaultBillingAddress
                }
            })
        }
        catch(error){
            throw new NotFoundException("address not found",ErrorCode.ADDRESS_NOT_FOUND)
        }
        if(billingAddress.userId != req.user.id){
                throw new BadRequestsException("address does not belong to user",ErrorCode.ADDRESS_DOES_NOT_BELONG)
            }
    }
    const updateUser = await prisma.user.update({
        where : {
            id : req.user.id
        },
        data : validatedData
    })
    res.json(updateUser)
}


//admin side

export const listUsers = async(req : Request,res : Response)=>{
    const users = await prisma.user.findMany({
        skip : Number(req.query.skip ?? 0),
        take : 5
    })
    console.log("users",users)
    res.json(users)
}

export const getUserById = async(req : Request,res : Response)=>{
    try {
        const user = await prisma.user.findFirstOrThrow({
            where : {
                id : +req.params.id
            },
            include : {
                addresses : true
            }
        })
        res.json(user)
    } catch (error) {
        throw new NotFoundException("User not found.",ErrorCode.USER_NOTFOUND)
    }
}

export const changeUserRole = async(req : Request,res : Response)=>{
      try {
        const user = await prisma.user.update({
            where : {
                id : +req.params.id
            },
            data : {
                role : req.body.role
            }
        })
        res.json(user)
    } catch (error) {
        throw new NotFoundException("User not found.",ErrorCode.USER_NOTFOUND)
    }
}