import { Gender } from "../../generated/prisma/enums";

export interface IDoctorPayload {
    password: string;
    doctor: {
        name: string;
        email: string;
        profilePhoto?: string;
        contactNumber?: string;
        address?: string;
        registrationNumber?: string;
        experience?: number,
        gender: Gender,
        appointmentFee?: number,
        qualification?: string;
        currentWorkingPlace?: string;
        designation?: string;
    },
    specialities: string[];
}

export interface IDoctorUpdatePayload {
    doctor: {
        name?: string;
        profilePhoto?: string;
        contactNumber?: string;
        address?: string;
        registrationNumber?: string;
        experience?: number,
        gender: Gender,
        appointmentFee?: number,
        qualification?: string;
        currentWorkingPlace?: string;
        designation?: string;
    },
    specialities: string[];
}


// Admin Interface
export interface ICreateAdmin {
    password: string,
    admin: {
        name: string,
        email: string,
        profilePhoto?: string,
        contactNumber: string
    }
}

