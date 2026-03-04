import { Role, UserStatus } from "../../../generated/prisma/enums"

export interface IUpdateSuperAdmin {
    name?: string,
    email?: string,
    profilePhoto?: string,
    contactNumber?: string,
    isActive?: boolean,
    isDeleted?: boolean,
    user: {
        role?: Role,
        status?: UserStatus
    }
}