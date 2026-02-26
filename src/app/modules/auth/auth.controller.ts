import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { authServices } from "./auth.service";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";

// ** Sign up user
const signUpUser = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body;
    const result = await authServices.signUpUser(payload);
    sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        message: "Patient signup successfully",
        data: result
    })
});

// ** Login user
const loginUser = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body;
    const result = await authServices.loginUser(payload);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: "Patient login successfully",
        data: result
    })
})

export const authController = {
    signUpUser,
    loginUser
}