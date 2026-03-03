import { Request, Response } from "express";
import { ICreateAdmin, IDoctorPayload } from "../../types/user.interface";
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

// ** Create admin

const createAdmin = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body as ICreateAdmin;
    const admin = await userService.createAdmin(payload);
    sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        message: "Admin created successfully",
        data: admin
    })
})

// ** Create super admin

const createSuperAdmin = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body as ICreateAdmin;
    const superAdmin = await userService.createSuperAdmin(payload);
    sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        message: "Super Admin created successfully",
        data: superAdmin
    });
})


export const userController = {
    createDoctor,
    createAdmin,
    createSuperAdmin
}