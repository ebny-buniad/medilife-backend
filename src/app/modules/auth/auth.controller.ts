import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { authServices } from "./auth.service";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
import { tokenUtils } from "../../utils/token";
import { IRequestUser } from "../../interfaces/requestUser.interface";
import AppError from "../../errors/AppError";

// ** Sign up user
const signUpUser = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body;
    const result = await authServices.signUpUser(payload);
    const { accessToken, refreshToken, token, ...rest } = result;
    tokenUtils.setAccessTokenCookie(res, accessToken);
    tokenUtils.setRefreshTokenCookie(res, refreshToken);
    tokenUtils.setBetterAuthSessionCookies(res, token as string);
    sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        message: "Patient signup successfully",
        data: {
            ...rest,
            accessToken,
            refreshToken,
            token
        }
    })
});

// ** Login user

const loginUser = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body;
    const result = await authServices.loginUser(payload);
    const { accessToken, refreshToken, token, ...rest } = result;
    tokenUtils.setAccessTokenCookie(res, accessToken);
    tokenUtils.setRefreshTokenCookie(res, refreshToken);
    tokenUtils.setBetterAuthSessionCookies(res, token);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: "User login successfully",
        data: {
            ...rest,
            accessToken,
            refreshToken,
            token
        }
    })
})

// ** Get me (User information) 

const getMe = catchAsync(async (req: Request, res: Response) => {
    const user = req.user;
    const result = await authServices.getMe(user as IRequestUser);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: "Get my info successfully",
        data: result
    })
})


// ** Generate refresh token for get access token
const getNewToken = catchAsync(async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;
    const betterAuthSessionToken = req.cookies['better-auth.session_token'];
    if (!refreshToken || !betterAuthSessionToken) {
        throw new AppError(
            StatusCodes.UNAUTHORIZED,
            "Refresh token is missing"
        )
    }
    const result = await authServices.getNewToken(refreshToken, betterAuthSessionToken);
    const { accessToken, refreshToken: newRefreshToken, sessionToken } = result;

    tokenUtils.setAccessTokenCookie(res, accessToken);
    tokenUtils.setRefreshTokenCookie(res, newRefreshToken);
    tokenUtils.setBetterAuthSessionCookies(res, sessionToken);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: "New access token set successfully",
        data: {
            accessToken,
            refreshToken: newRefreshToken,
            sessionToken
        }
    })
})

export const authController = {
    signUpUser,
    loginUser,
    getMe,
    getNewToken
}