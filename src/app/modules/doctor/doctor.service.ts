import { StatusCodes } from "http-status-codes";
import { Speciality } from "../../../generated/prisma/client";
import AppError from "../../errors/AppError";
import { prisma } from "../../lib/prisma"
import { IDoctorUpdatePayload } from "../../types/user.interface";

// ** Get all doctors
const getAllDoctors = async () => {
    const doctors = await prisma.doctor.findMany({
        where: {
            isDeleted: false
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                    role: true,
                    status: true,
                    emailVerified: true,
                    createdAt: true,
                }
            },
            specialities: {
                include: {
                    speciality: {
                        select: {
                            id: true,
                            title: true,
                            description: true,
                            icon: true
                        }
                    }
                }
            }
        }
    })
    return doctors;
}

// ** Get doctor by id
const getDoctorById = async (doctorId: string) => {
    const doctor = await prisma.doctor.findUnique({
        where: {
            id: doctorId
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                    role: true,
                    status: true,
                    emailVerified: true,
                    createdAt: true,
                }
            },
            specialities: {
                include: {
                    speciality: {
                        select: {
                            id: true,
                            title: true,
                            description: true,
                            icon: true
                        }
                    }
                }
            }
        }
    });
    return doctor
}

// ** Update doctor by id
const updateDoctorById = async (doctorId: string, payload: IDoctorUpdatePayload) => {

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

    try {
        const result = await prisma.$transaction(async (tx) => {
            // Update doctor data
            await tx.doctor.update({
                where: {
                    id: doctorId
                },
                data: {
                    ...payload.doctor,
                }
            })

            // Update doctor specialities
            const updatedDoctorSpecialities = specialities.map((speciality) => {
                return {
                    doctorId: doctorId,
                    specialityId: speciality?.id
                }
            })

            // Delete existing doctor specialities
            await tx.doctorSpeciality.deleteMany({
                where: {
                    doctorId: doctorId,
                }
            })
            // create doctor specialities in bulk
            await tx.doctorSpeciality.createMany({
                data: updatedDoctorSpecialities
            })

            // Return updated doctor data
            const updatedDoctor = await tx.doctor.findUnique({
                where: {
                    id: doctorId
                },
                include: {
                    specialities: {
                        include: {
                            speciality: true
                        }
                    }
                }
            });

            return updatedDoctor;
        });

        return result;

    } catch (error) {
        console.log(error)
        throw new AppError(
            StatusCodes.BAD_REQUEST,
            "Doctor with id " + doctorId + " not found"
        )
    }
}

// ** Delete doctor by id (Soft delete - set isDeleted to true)
const deleteDoctorById = async (doctorId: string) => {
    const deletedDoctor = await prisma.doctor.update({
        where: {
            id: doctorId
        },
        data: {
            isDeleted: true
        }
    });
    return deletedDoctor;
}

export const DoctorService = {
    getAllDoctors,
    getDoctorById,
    updateDoctorById,
    deleteDoctorById
}