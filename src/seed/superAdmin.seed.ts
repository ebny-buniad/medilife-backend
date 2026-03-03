import { StatusCodes } from "http-status-codes";
import AppError from "../app/errors/AppError";
import { prisma } from "../app/lib/prisma";
import { envVars } from "../config/env";
import { auth } from "../app/lib/auth";
import { Role } from "../generated/prisma/enums";



async function createSuperAdmin() {

    const seedSuperAdmin = {
        name: envVars.NAME,
        email: envVars.SUPER_ADMIN_EMAIL,
        profilePhoto: envVars.PROFILE_PHOTO,
        contactNumber: envVars.CONTACT_NUMBER
    }

    const existSuperAdmin = await prisma.superAdmin.findFirst({
        where: { email: envVars.SUPER_ADMIN_EMAIL }
    })

    if (existSuperAdmin) {
        throw new AppError(
            StatusCodes.BAD_REQUEST,
            "Already created seed super admin"
        )
    }

    const superAdmin = await auth.api.signUpEmail({
        body: {
            email: envVars.SUPER_ADMIN_EMAIL,
            password: envVars.SUPER_ADMIN_PASSWORD,
            role: Role.SUPER_ADMIN,
            name: seedSuperAdmin?.name,
            changePassword: true,
        }
    });

    try {
        const result = await prisma.$transaction(async (tx) => {
            const superAdminData = await tx.superAdmin.create({
                data: {
                    userId: superAdmin.user.id,
                    ...seedSuperAdmin
                }
            });

            // Fetch created seed super admin with user data
            const superAdminRes = await tx.superAdmin.findFirst({
                where: { id: superAdminData.id },
                include: {
                    user: true,
                }
            });
            return superAdminRes;
        });

        return result;
    }
    catch (err) {
        console.log(err)
    }
}

createSuperAdmin();