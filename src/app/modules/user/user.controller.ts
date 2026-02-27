import { Request, Response } from "express";
import { IDoctorPayload } from "../../types/user.interface";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
import { userService } from "./user.service";

// ** Create doctor
const createDoctor = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body as IDoctorPayload;
    const doctor = await userService.createDoctor(payload);
    sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        message: "Doctor created successfully",
        data: doctor
    })
})


export const userController = {
    createDoctor
}