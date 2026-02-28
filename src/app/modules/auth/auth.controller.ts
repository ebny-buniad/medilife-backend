import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { authServices } from "./auth.service";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
import { tokenUtils } from "../../utils/token";

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
        message: "Patient login successfully",
        data: {
            ...rest,
            accessToken,
            refreshToken,
            token
        }
    })
})

export const authController = {
    signUpUser,
    loginUser
}