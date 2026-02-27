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


export const doctorController = {
    getAllDoctors
}