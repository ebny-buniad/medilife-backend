import { StatusCodes } from "http-status-codes";
import AppError from "../../errors/AppError";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { UserStatus } from "../../../generated/prisma/enums";

interface ISignUpPatientPayload {
    name: string,
    email: string,
    password: string
}

interface ILoginUserPayload {
    email: string,
    password: string
}

// ** Sign up user
const signUpUser = async (payload: ISignUpPatientPayload) => {
    // Check duplicate user
    const isExist = await prisma.user.findFirst({
        where: {
            email: payload?.email
        }
    });

    if (isExist) {
        throw new AppError(
            StatusCodes.BAD_REQUEST,
            "Already account created by this email"
        )
    }

    const { name, email, password } = payload;
    const data = await auth.api.signUpEmail({
        body: {
            name,
            email,
            password
        }
    })

    if (!data.user) {
        throw new AppError(
            StatusCodes.BAD_REQUEST,
            "Failed to register patient"
        )
    }

    // Create patient profile
    try {
        const patient = await prisma.$transaction(async (tx) => {
            const paitentTx = await tx.patient.create({
                data: {
                    userId: data.user.id,
                    name: payload?.name,
                    email: payload?.email,
                }
            });
            return paitentTx;
        });
        return {
            ...data,
            patient
        };
    }
    catch (err) {
        console.log("Transaction error", err);
        //  If patient creation fails, delete auth user for advance safety
        await prisma.user.delete({
            where: {
                id: data.user.id
            }
        })
        throw new AppError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            "Patient profile creation failed"
        );
    }
}

// ** Login user
const loginUser = async (payload: ILoginUserPayload) => {
    const data = await auth.api.signInEmail({
        body: {
            email: payload?.email,
            password: payload?.password
        }
    });

    // Check paitent blocked
    if (data.user.status === UserStatus.BLOCKED) {
        throw new AppError(
            StatusCodes.BAD_REQUEST,
            "Your account has been blocked"
        );
    }

    // Check paitent deleted
    if (data.user.status === UserStatus.DELETE) {
        throw new AppError(
            StatusCodes.FORBIDDEN,
            "Your account has been deleted"
        );
    }
    return data;
}

export const authServices = {
    signUpUser,
    loginUser
} 