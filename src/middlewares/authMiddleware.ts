/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { Role, UserStatus } from "../generated/prisma/enums";
import { cookieUtils } from "../app/utils/cookie";
import AppError from "../app/errors/AppError";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../app/lib/prisma";
import { jwtUtils } from "../app/utils/jwt";
import { envVars } from "../config/env";

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
                role: Role;
            };
        }
    }
}

export const authMiddleware = (...authRoles: Role[]) => async (req: Request, res: Response,
    next: NextFunction) => {
    try {
        // Session token verification
        const sessionToken = cookieUtils.getCookie(req, "better-auth.session_token");

        // console.log('Session token',sessionToken)

        if (!sessionToken) {
            throw new AppError(
                StatusCodes.UNAUTHORIZED,
                "Unauthorized: No session token provided"
            )
        }

        if (sessionToken) {
            const sessionExists = await prisma.session.findFirst({
                where: {
                    token: sessionToken,
                    expiresAt: {
                        gt: new Date()
                    }
                },
                include: {
                    user: true
                }
            });

            if (sessionExists && sessionExists.user) {
                const user = sessionExists.user;

                const now = new Date();
                const createdAt = new Date(sessionExists.createdAt);
                const expiresAt = new Date(sessionExists.expiresAt);

                const sassionDuration = expiresAt.getTime() - createdAt.getTime();
                const timeLeft = expiresAt.getTime() - now.getTime();
                const timeLeftPercentage = (timeLeft / sassionDuration) * 100;

                // If the session is valid but has less than 20% time left, refresh it
                if (timeLeftPercentage < 20) {
                    res.setHeader("X-Session-Refresh", "true");
                    res.setHeader('X-Session-Expires-At', expiresAt.toISOString());
                    res.setHeader('X-Session-Time-Left-Percentage', timeLeftPercentage.toString());

                    console.log("Session Expiring Soon!!");
                }

                if (user.status === UserStatus.BLOCKED || user.status === UserStatus.DELETE) {
                    throw new AppError(
                        StatusCodes.FORBIDDEN,
                        "Your account is blocked or inactive. Please contact support."
                    )
                }
                if (user.isDeleted) {
                    throw new AppError(
                        StatusCodes.FORBIDDEN,
                        "Your account is deleted. Please contact support."
                    )
                }

                if (authRoles.length > 0 && !authRoles.includes(user.role)) {
                    throw new AppError(StatusCodes.FORBIDDEN, 'Forbidden access! You do not have permission to access this resource.');
                }

                req.user = {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                }

                const accessToken = cookieUtils.getCookie(req, "accessToken");
                if (!accessToken) {
                    throw new AppError(
                        StatusCodes.UNAUTHORIZED,
                        "Unauthorized: No access token provided"
                    )
                }
            }
        }

        // Access token verification
        const accessToken = cookieUtils.getCookie(req, "accessToken");
        if (!accessToken) {
            throw new AppError(
                StatusCodes.UNAUTHORIZED,
                "Unauthorized: No access token provided"
            )
        }

        // Verify access token and extract user information
        const verifiedToken = jwtUtils.verifyToken(accessToken, envVars.ACCESS_TOKEN_SECRET);

        if (!verifiedToken.success) {
            throw new AppError(
                StatusCodes.UNAUTHORIZED,
                "Unauthorized: Invalid access token"
            )
        }

        if (authRoles.length > 0 && !authRoles.includes(verifiedToken.data!.role as Role)) {
            throw new AppError(StatusCodes.FORBIDDEN, 'Forbidden access! You do not have permission to access this resource.');
        }

        // Must call 
        next();
    }
    catch (err: any) {
        next(err);
    }
}