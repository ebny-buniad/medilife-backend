import { Router } from "express";
import { specialityRouter } from "../modules/speciality/speciality.router";
import { authRouter } from "../modules/auth/auth.router";
import { userRouter } from "../modules/user/user.router";

const router = Router();
router.use("/auth", authRouter)
router.use("/speciality", specialityRouter)
router.use("/doctor", userRouter)

export const IndexRoutes = router;