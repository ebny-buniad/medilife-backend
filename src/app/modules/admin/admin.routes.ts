import { Router } from "express";
import { adminController } from "./admin.controller";
import { authMiddleware } from "../../../middlewares/authMiddleware";
import { Role } from "../../../generated/prisma/enums";
import { validateRequest } from "../../../middlewares/validateRequest";
import { updateAdminZodSchema } from "./admin.validation";

const router = Router();

router.get("/", authMiddleware(Role.SUPER_ADMIN), adminController.getAllAdmins);
router.get("/:id", authMiddleware(Role.SUPER_ADMIN), adminController.getAdmin);
router.put("/:id", authMiddleware(Role.SUPER_ADMIN), validateRequest(updateAdminZodSchema), adminController.updateAdmin)
router.delete("/:id", authMiddleware(Role.SUPER_ADMIN), adminController.deleteAdmin)

export const adminRouter: Router = router;