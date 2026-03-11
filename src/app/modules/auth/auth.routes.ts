import { Router } from "express";
import { authController } from "./auth.controller";
import { authMiddleware } from "../../../middlewares/authMiddleware";
import { Role } from "../../../generated/prisma/enums";

const router = Router();
router.post("/signup", authController.signUpUser)
router.post("/login", authController.loginUser)
router.get("/get-me", authMiddleware(Role.PATIENT, Role.DOCTOR, Role.ADMIN, Role.SUPER_ADMIN),
    authController.getMe)
router.post("/refresh-token", authController.getNewToken)

export const authRouter: Router = router;