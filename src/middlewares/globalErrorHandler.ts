/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from "express";
import * as z from "zod";
import { envVars } from "../config/env";
import { StatusCodes } from "http-status-codes";

// Zod error
interface TErrorSources {
    path: string,
    message: string,
}

const globalErrorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let errorSources: TErrorSources[] = [];
    let statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR;
    let message: string = "Internal Server Error";

    /* [
     {
       expected: 'string',
       code: 'invalid_type',
       path: [ 'username' ],
       message: 'Invalid input: expected string'
     },
     {
       expected: 'number',
       code: 'invalid_type',
       path: [ 'xp' ],
       message: 'Invalid input: expected number'
     }
   ] */

    if (err instanceof z.ZodError) {
        statusCode = StatusCodes.BAD_REQUEST;
        message = "Zod Validation Error";
        err.issues.forEach((issue) => {
            errorSources.push({
                path: issue.path.join(" => ") || "unknown",
                message: issue.message,
            })
        })
    }

    res.status(statusCode).json({
        success: false,
        message,
        errorSources,
        error: envVars.NODE_ENV === "development" ? err : undefined,
    });
};

export default globalErrorHandler;