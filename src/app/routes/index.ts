import { Router } from "express";
import { specialityRouter } from "../modules/speciality/speciality.router";
import { authRouter } from "../modules/auth/auth.router";
import { userRouter } from "../modules/user/user.router";
import { doctorRouter } from "../modules/doctor/doctor.router";

const router = Router();
router.use("/auth", authRouter)
router.use("/speciality", specialityRouter)
router.use("/users", userRouter)
router.use("/doctors", doctorRouter)
export const IndexRoutes = router;