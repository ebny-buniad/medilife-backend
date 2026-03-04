import { StatusCodes } from "http-status-codes";
import AppError from "../../errors/AppError";
import { prisma } from "../../lib/prisma"
import { IUpdateAdmin } from "./admin.interface";

// ** Get all admins

const getAllAdmins = async () => {
    const admins = await prisma.admin.findMany({
        where: {
            isActive: true,
            isDeleted: false
        },
        include: {
            user: true
        }
    });

    if (!admins) {
        throw new AppError(
            StatusCodes.NOT_FOUND,
            "No admin here!"
        )
    }

    return admins;
}

// ** Get admin by Id

const getAdmin = async (id: string) => {
    const admin = await prisma.admin.findUnique({
        where: { id: id },
        include: {
            user: true
        }
    });

    if (!admin) {
        throw new AppError(
            StatusCodes.NOT_FOUND,
            "No admin here!"
        )
    }
    return admin;
}

// ** Update admin data

const updateAdmin = async (id: string, payload: IUpdateAdmin) => {

    // Check admin data available
    const isExits = await prisma.admin.findFirst({
        where: { id }
    });

    if(!isExits){
        throw new AppError(
            StatusCodes.NOT_FOUND,
            "Admin data can not found!"
        )
    }

    const result = await prisma.$transaction(async (tx) => {
        const updateAdmin = await tx.admin.update({
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

        const updateUserData = await tx.admin.findFirst({
            where: { id: updateAdmin.id },
            include: {
                user: true
            }
        });
        return updateUserData;
    });
    return result;
}

// ** Delete admin data

const deleteAdmin = async (id: string) => {
    const deleteData = await prisma.admin.delete({
        where: { id }
    });
    return deleteData
}

export const adminServices = {
    getAllAdmins,
    getAdmin,
    updateAdmin,
    deleteAdmin
}






