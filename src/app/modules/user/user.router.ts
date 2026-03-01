import { Router } from "express";
import { userController } from "./user.controller";
import { validateRequest } from "../../../middlewares/validateRequest";
import { createDoctorZodSchema } from "./user.validation";
import { authMiddleware } from "../../../middlewares/authMiddleware";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post("/create-doctor", authMiddleware(Role.ADMIN), validateRequest(createDoctorZodSchema), userController.createDoctor)

export const userRouter: Router = router;