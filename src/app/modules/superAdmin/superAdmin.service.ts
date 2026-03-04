import { StatusCodes } from "http-status-codes";
import AppError from "../../errors/AppError";
import { prisma } from "../../lib/prisma"
import { IUpdateSuperAdmin } from "./superAdmin.interface";

// ** Get all super admin

const getAllSuperAdmin = async () => {
    const superAdmin = await prisma.superAdmin.findMany({
        where: {
            isDeleted: false,
            isActive: true
        },
        include: {
            user: true
        }
    });
    return superAdmin;
}

// ** Get super admin by id

const getSuperAdmin = async (id: string) => {
    const superAdmin = await prisma.superAdmin.findUnique({
        where: { id },
        include: {
            user: true
        }
    });
    return superAdmin;
}


// ** Update super admin data

const updateSuperAdmin = async (id: string, payload: IUpdateSuperAdmin) => {

    // Check super admin data available
    const isExits = await prisma.superAdmin.findFirst({
        where: { id }
    });

    if (!isExits) {
        throw new AppError(
            StatusCodes.NOT_FOUND,
            "Admin data can not found!"
        )
    }

    const result = await prisma.$transaction(async (tx) => {
        const updateAdmin = await tx.superAdmin.update({
            where: { id },
            data: {
                name: payload?.name,
                email: payload?.email,
                profilePhoto: payload?.profilePhoto,
                contactNumber: payload?.contactNumber,
                isActive: payload?.isActive,
                isDeleted: payload?.isDeleted
            }
        });

        // Update user table
        await tx.user.update({
            where: { id: updateAdmin?.userId },
            data: {
                name: payload?.name,
                email: payload?.email,
                role: payload?.user.role,
                status: payload?.user.status,
                image: payload?.profilePhoto,
            }
        });

        const updateUserData = await tx.superAdmin.findFirst({
            where: { id: updateAdmin.id },
            include: {
                user: true
            }
        });
        return updateUserData;
    });
    return result;
}


// ** Soft delete admin data

const deleteSuperAdmin = async (id: string) => {
    const deleteData = await prisma.superAdmin.update({
        where: { id },
        data: {
            isDeleted: true
        }
    });
    return deleteData
}

export const superAdminServices = {
    getAllSuperAdmin,
    getSuperAdmin,
    updateSuperAdmin,
    deleteSuperAdmin
}