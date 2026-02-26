import { Request, Response } from "express";
import { specialityService } from "./speciality.service";
import { catchAsync } from "../../utils/catchAsync";
import { StatusCodes } from "http-status-codes";
import sendResponse from "../../../shared/sendResponse";

// ** Create Speciality
const createSpeciality = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body;
    const result = await specialityService?.createSpeciality(payload);
    sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        message: "Speciality create successful",
        data: result
    });
});

//** Get specialities
const getSpecialities = catchAsync(async (req: Request, res: Response) => {
    const result = await specialityService.getSpecialities();
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: "Specialities get all successful",
        data: result
    })
});

//** Delete speciality
const deleteSpeciality = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await specialityService?.deleteSpeciality(id as string);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: "Speciality delete successful",
        data: result
    })
});

//** Update speciality
const updateSpeciality = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const payload = req.body;
    const result = await specialityService.updateSpeciality(id as string, payload);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        message: "Speciality updated successfully",
        data: result
    })
})

export const specialityController = {
    createSpeciality,
    getSpecialities,
    deleteSpeciality,
    updateSpeciality
}