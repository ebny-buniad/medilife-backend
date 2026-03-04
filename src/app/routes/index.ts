import { Router } from "express";
import { specialityRouter } from "../modules/speciality/speciality.routes";
import { authRouter } from "../modules/auth/auth.routes";
import { userRouter } from "../modules/user/user.routes";
import { doctorRouter } from "../modules/doctor/doctor.routes";
import { adminRouter } from "../modules/admin/admin.routes";
import { superAdminRouter } from "../modules/superAdmin/superAdmin.routes";

const router = Router();
router.use("/auth", authRouter)
router.use("/admin", adminRouter)
router.use("/super-admin", superAdminRouter)
router.use("/speciality", specialityRouter)
router.use("/users", userRouter)
router.use("/doctors", doctorRouter)
export const IndexRoutes = router;