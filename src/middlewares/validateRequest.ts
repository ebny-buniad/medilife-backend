import { NextFunction, Request, Response } from 'express';
import * as z from 'zod';

export const validateRequest = (zodSchema: z.ZodObject) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = zodSchema.safeParse(req.body);
        if (!result.success) {
            // console.log("Zod error", result.error)
            next(result.error);
        }

        // Sanitize the data
        req.body = result.data;
        next();
    }
}