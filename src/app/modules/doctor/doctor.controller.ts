import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { StatusCodes } from "http-status-codes";
import sendResponse from "../../../shared/sendResponse";
import { DoctorService } from "./doctor.service";

// ** Get all doctors
const getAllDoctors = catchAsync(async (req: Request, res: Response) => {
    const result = await DoctorService.getAllDoctors();
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: "Doctors retrieved successfully",
        data: result
    })
})

// ** Get doctor by id
const getDoctorById = catchAsync(async (req: Request, res: Response) => {
    const doctorId = req.params.id;
    const result = await DoctorService.getDoctorById(doctorId as string);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: "Doctor retrieved successfully",
        data: result
    })
})

// ** Update doctor by id
const updateDoctorById = catchAsync(async (req: Request, res: Response) => {
    const doctorId = req.params.id;
    const payload = req.body;
    const result = await DoctorService.updateDoctorById(doctorId as string, payload);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: "Doctor updated successfully",
        data: result
    })
});


export const doctorController = {
    getAllDoctors,
    getDoctorById,
    updateDoctorById
}