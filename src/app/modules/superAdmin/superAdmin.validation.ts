import * as z from "zod"
import { phoneSchema } from "../user/user.validation"
import { Role, UserStatus } from "../../../generated/prisma/enums"

export const updateSuperAdminZodSchema = z.object({
    name: z.string(),
    email: z.email(),
    profilePhoto: z.url(),
    contactNumber: phoneSchema,
    isActive: z.boolean(),
    isDeleted: z.boolean(),
    user: z.object({
        role: z.enum(Role),
        status: z.enum(UserStatus)
    })
})