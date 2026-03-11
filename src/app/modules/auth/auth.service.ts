/* eslint-disable @typescript-eslint/no-explicit-any */
import { StatusCodes } from "http-status-codes";
import AppError from "../../errors/AppError";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { Role, UserStatus } from "../../../generated/prisma/enums";
import { tokenUtils } from "../../utils/token";
import { IRequestUser } from "../../interfaces/requestUser.interface";
import { jwtUtils } from "../../utils/jwt";
import { envVars } from "../../../config/env";
import { JwtPayload } from "jsonwebtoken";

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

        // Create access token and refresh token
        const accessToken = tokenUtils.getAccessToken(data.user);
        const refreshToken = tokenUtils.getRefreshToken(data.user);
        return {
            ...data,
            accessToken,
            refreshToken,
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

    // Create access token and refresh token
    const accessToken = tokenUtils.getAccessToken(data.user);
    const refreshToken = tokenUtils.getRefreshToken(data.user);

    return {
        ...data,
        accessToken,
        refreshToken
    };
}

// ** Get me (User information) 
const getMe = async (user: IRequestUser) => {
    // Find exist user
    const existUser = await prisma.user.findUnique({
        where: {
            id: user.id
        },
        include: {
            patient: true
        }
    });

    if (!existUser) {
        throw new AppError(
            StatusCodes.NOT_FOUND,
            "User not found!"
        )
    }

    const roleIncludeMap: Record<Role, any> = {
        [Role.PATIENT]: { patient: true },
        [Role.DOCTOR]: { patient: true },
        [Role.ADMIN]: { patient: true },
        [Role.SUPER_ADMIN]: { patient: true }
    };

    return prisma.user.findUnique({
        where: {
            id: existUser.id
        },
        include: roleIncludeMap[existUser.role]
    })
}

// ** Generate refresh token for get access token
const getNewToken = async (refreshToken: string, sessionToken: string) => {

    // Check user login or  not (session)
    const isSessionTokenExists = await prisma.session.findUnique({
        where: {
            token: sessionToken
        },
        include: {
            user: true
        }
    });

    if (!isSessionTokenExists) {
        throw new AppError(
            StatusCodes.UNAUTHORIZED,
            "Invalied session token"
        )
    }

    const verifiedRefreshToken = jwtUtils.verifyToken(refreshToken, envVars.REFRESH_TOKEN_SECRET);
    if (!verifiedRefreshToken.success && verifiedRefreshToken.error) {
        throw new AppError(
            StatusCodes.UNAUTHORIZED,
            "Invalied refresh token"
        )
    }

    const user = verifiedRefreshToken.data as JwtPayload;

    const userInfo = {
        id: user?.id,
        name: user?.name,
        email: user?.email,
        emailVerified: user?.email.emailVerified,
        image: null,
        createdAt: user?.createdAt,
        updatedAt: user?.updatedAt,
        role: user?.role,
        status: user?.status,
        changePassword: user?.changePassword,
        isDeleted: user?.isDeleted,
        deletedAt: user?.deletedAt,
    }

    // Create new access token and new refresh token
    const newAccessToken = tokenUtils.getAccessToken(userInfo);
    const newRefreshToken = tokenUtils.getRefreshToken(userInfo);

    // Update session token
    const { token } = await prisma.session.update({
        where: {
            token: sessionToken
        },
        data: {
            token: sessionToken,
            expiresAt: new Date(Date.now() + 60 * 60 * 60 * 24 * 1000),
            updatedAt: new Date()
        }
    })

    return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        sessionToken: token
    }
}

export const authServices = {
    signUpUser,
    loginUser,
    getMe,
    getNewToken
} 