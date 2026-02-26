import { StatusCodes } from "http-status-codes";
import { Speciality } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import AppError from "../../errors/AppError";


// ** Create Speciality
const createSpeciality = async (payload: Speciality): Promise<Speciality> => {
    // Check duplicate speciality
    const isExist = await prisma?.speciality.findFirst({
        where: {
            title: payload?.title
        }
    });
    if (isExist) {
        throw new AppError(
            StatusCodes.BAD_REQUEST,
            "Speciality already exists"
        )
    }
    // Create new speciality
    const speciality = await prisma?.speciality.create({
        data: {
            title: payload?.title,
            description: payload?.description,
            icon: payload?.icon
        }
    })
    return speciality;
}

//** Get specialities
const getSpecialities = async () => {
    const specialities = await prisma.speciality.findMany();
    return specialities;
}

//** Delete speciality
const deleteSpeciality = async (id: string) => {
    const deleteSpeciality = await prisma.speciality.delete({
        where: { id }
    });
    return deleteSpeciality;
}

//** Update speciality
const updateSpeciality = async (id: string, payload: Partial<Speciality>): Promise<Speciality> => {
    // Check if speciality exists
    const isExist = await prisma.speciality.findFirst({
        where: { id }
    });

    if (!isExist) {
        throw new AppError(
            StatusCodes?.NOT_FOUND,
            "Speciality not found"
        )
    }

    // Update speciality finally
    const updateSpeciality = await prisma.speciality.update({
        where: { id },
        data: {
            title: payload?.title,
            description: payload?.description,
            icon: payload?.icon
        }
    });
    return updateSpeciality
}

export const specialityService = {
    createSpeciality,
    getSpecialities,
    deleteSpeciality,
    updateSpeciality
}