import { Role, Speciality } from "../../../generated/prisma/client";
import AppError from "../../errors/AppError";
import { prisma } from "../../lib/prisma";
import { auth } from "../../lib/auth";
import { StatusCodes } from "http-status-codes";
import { IDoctorPayload } from "../../types/user.interface";

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
    const doctorExists = await prisma.doctor.findUnique({
        where: {
            email: payload?.doctor?.email,
            registrationNumber: payload?.doctor?.registrationNumber
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

export const userService = {
    createDoctor
}