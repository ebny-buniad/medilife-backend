import { Router } from "express";
import { userController } from "./user.controller";
import { validateRequest } from "../../../middlewares/validateRequest";
import { createAdminZodSchema, createDoctorZodSchema } from "./user.validation";
import { authMiddleware } from "../../../middlewares/authMiddleware";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post("/create-doctor", validateRequest(createDoctorZodSchema), userController.createDoctor)
router.post("/create-admin", authMiddleware(Role.SUPER_ADMIN), validateRequest(createAdminZodSchema), userController.createAdmin);
router.post("/create-super-admin", authMiddleware(Role.SUPER_ADMIN), validateRequest(createAdminZodSchema), userController.createSuperAdmin);



export const userRouter: Router = router;