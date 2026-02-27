import { Router } from "express";
import { userController } from "./user.controller";
import { validateRequest } from "../../../middlewares/validateRequest";
import { createDoctorZodSchema } from "./user.validation";

const router = Router();

router.post("/create-doctor", validateRequest(createDoctorZodSchema), userController.createDoctor)

export const userRouter: Router = router;