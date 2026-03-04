import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { adminServices } from "./admin.service";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";

// ** Get all admins
const getAllAdmins = catchAsync(async (req: Request, res: Response) => {
    const result = await adminServices.getAllAdmins();
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: "Retrive all admin successfully",
        data: result
    })
})

// ** Get admin by Id

const getAdmin = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const result = await adminServices.getAdmin(id);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: "Retrive admin successfully",
        data: result
    })
});

// ** Update admin data

const updateAdmin = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const payload = req.body;
    const result = await adminServices.updateAdmin(id, payload);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: "Admin information updated",
        data: result
    });
})

// ** Delete admin data

const deleteAdmin = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const result = await adminServices.deleteAdmin(id);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: "Admin data delete successfully",
        data: result
    })
})


export const adminController = {
    getAllAdmins,
    getAdmin,
    updateAdmin,
    deleteAdmin
}