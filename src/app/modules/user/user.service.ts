import { Role, Speciality } from "../../../generated/prisma/client";
import AppError from "../../errors/AppError";
import { prisma } from "../../lib/prisma";
import { auth } from "../../lib/auth";
import { StatusCodes } from "http-status-codes";
import { ICreateAdmin, IDoctorPayload } from "../../types/user.interface";

// ** Create doctor

const createDoctor = async (payload: IDoctorPayload) => {
    const specialities: Speciality[] = [];

    for (const specialityId of payload.specialities) {
        const speciality = await prisma.speciality.findUnique({
            where: {
                id: specialityId
            }
        });
        if (!speciality) {
            throw new AppError(
                StatusCodes.BAD_REQUEST,
                "Speciality with id " + specialityId + " not found"
            )
        };
        specialities.push(speciality);
    }

    // If doctor already exists
    const doctorExists = await prisma.doctor.findFirst({
        where: {
            OR: [
                { email: payload?.doctor?.email },
                { registrationNumber: payload?.doctor?.registrationNumber }
            ]
        }
    });
    if (doctorExists) {
        throw new AppError(
            StatusCodes.BAD_REQUEST,
            `Doctor with email ${payload?.doctor?.email} & ${payload?.doctor?.registrationNumber} already exists`
        )
    }

    // Create user account for doctor
    const userData = await auth.api.signUpEmail({
        body: {
            name: payload?.doctor?.name,
            email: payload?.doctor?.email,
            password: payload?.password,
            role: Role.DOCTOR,
            changePassword: true
        }
    });

    // Create doctor with doctor specialities
    try {
        const result = await prisma.$transaction(async (tx) => {
            const doctorData = await tx.doctor.create({
                data: {
                    userId: userData.user.id,
                    ...payload.doctor,
                }
            });
            // Create doctor specialities
            const doctorSpecialitiesData = specialities.map((speciality) => {
                return {
                    doctorId: doctorData?.id,
                    specialityId: speciality?.id
                }
            })
            // Create doctor specialities in bulk
            await tx.doctorSpeciality.createMany({
                data: doctorSpecialitiesData
            })
            const doctor = await tx.doctor.findUnique({
                where: {
                    id: doctorData?.id
                },
                include: {
                    user: true,
                    specialities: true
                }
            });
            return doctor;
        });
        return result;
    }
    catch (error) {
        console.log(error)
        //  If doctor creation fails, delete auth user for advance safety
        await prisma.user.delete({
            where: {
                id: userData.user.id
            }
        })
    }
}

// ** Create admin

const createAdmin = async (payload: ICreateAdmin) => {
    // Check user already exists
    const userExists = await prisma.user.findFirst({
        where: {
            email: payload.admin.email
        }
    })
    if (userExists) {
        throw new AppError(
            StatusCodes.BAD_REQUEST,
            "Admin with this email already exists"
        );
    }

    // Create user account with Better Auth
    const userData = await auth.api.signUpEmail({
        body: {
            email: payload.admin.email,
            password: payload.password,
            role: Role.ADMIN,
            name: payload.admin.name,
            changePassword: true,
        }
    });

    // Create admin profile in transaction
    try {
        const result = await prisma.$transaction(async (tx) => {
            const adminData = await tx.admin.create({
                data: {
                    userId: userData?.user?.id,
                    ...payload.admin
                }
            });

            // Fetch created admin with user data
            const admin = await tx.admin.findFirst({
                where: { id: adminData.id },
                include: {
                    user: true,
                }
            });
            return admin;
        });
        return result;
    }
    catch (err) {
        // Delete user if admin creation fails
        await prisma.user.delete({
            where: { id: userData?.user.id }
        });
        throw new AppError(
            StatusCodes.BAD_REQUEST,
            "Failed to create admin"
        );
        console.log(err)
    }
}

// ** Create super admin

const createSuperAdmin = async (payload: ICreateAdmin) => {
    // Check existing super admin

    const existSuperAdmin = await prisma.superAdmin.findFirst({
        where: { email: payload.admin.email }
    });

    if (existSuperAdmin) {
        throw new AppError(
            StatusCodes.BAD_REQUEST,
            "Super admin already created"
        )
    };

    // Create user account with Better Auth
    const userData = await auth.api.signUpEmail({
        body: {
            email: payload.admin.email,
            password: payload.password,
            role: Role.SUPER_ADMIN,
            name: payload.admin.name,
            changePassword: true,
        }
    });

    try {
        const result = await prisma.$transaction(async (tx) => {
            const createSuperAdmin = await tx.superAdmin.create({
                data: {
                    userId: userData.user.id,
                    ...payload.admin
                }
            });

            // Fetch current super admin
            const superAdmin = await tx.superAdmin.findFirst({
                where: { id: createSuperAdmin.id },
                include: {
                    user: true
                }
            });

            return superAdmin;
        });

        return result
    }
    catch (err) {
        // Delete user if admin creation fails
        await prisma.user.delete({
            where: { id: userData?.user.id }
        });
        throw new AppError(
            StatusCodes.BAD_REQUEST,
            "Failed to create super admin"
        );
        console.log(err)
    }

}


export const userService = {
    createDoctor,
    createAdmin,
    createSuperAdmin
}