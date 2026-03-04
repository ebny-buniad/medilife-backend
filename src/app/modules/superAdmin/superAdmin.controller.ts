import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { superAdminServices } from "./superAdmin.service";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";

// ** Get all super admin

const getAllSuperAdmin = catchAsync(async (req: Request, res: Response) => {
    const result = await superAdminServices.getAllSuperAdmin();
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: "Retrive all super admin successfully",
        data: result
    })
});


// ** Get super admin by id

const getSuperAdmin = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const result = await superAdminServices.getSuperAdmin(id);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: "Retrive super admin successfully",
        data: result
    })
})

// ** Update admin data

const updateSuperAdmin = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const payload = req.body;
    const result = await superAdminServices.updateSuperAdmin(id, payload);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: "Super admin information updated",
        data: result
    });
})

// ** Delete admin data

const deleteSuperAdmin = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const result = await superAdminServices.deleteSuperAdmin(id);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: "Super admin data delete successfully",
        data: result
    })
})


export const superAdminController = {
    getAllSuperAdmin,
    getSuperAdmin,
    updateSuperAdmin,
    deleteSuperAdmin
}