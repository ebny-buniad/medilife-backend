import { Router } from "express";
import { specialityRouter } from "../modules/speciality/speciality.router";
import { authRouter } from "../modules/auth/auth.router";

const router = Router();
router.use("/auth", authRouter)
router.use("/speciality", specialityRouter)

export const IndexRoutes = router;