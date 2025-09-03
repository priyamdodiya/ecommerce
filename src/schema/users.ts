import {z} from "zod"

export const SignUpSchema = z.object({
  fullName: z.string(),
  username: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
  gender: z.enum(["male", "female"])
})

export const AddressSchema = z.object({
    lineOne : z.string(),
    lineTwo : z.string().nullable(),
    pincode : z.string().length(6),
    country : z.string(),
    city : z.string()
})

export const UpdateUserSchema = z.object({
    name : z.string().optional(),
    defaultShippingAddress : z.number().optional(),
    defaultBillingAddress : z.number().optional()
})