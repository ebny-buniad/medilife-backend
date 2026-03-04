import { Router } from "express";
import { superAdminController } from "./superAdmin.controller";
import { authMiddleware } from "../../../middlewares/authMiddleware";
import { Role } from "../../../generated/prisma/enums";
import { validateRequest } from "../../../middlewares/validateRequest";
import { updateSuperAdminZodSchema } from "./superAdmin.validation";

const router = Router();

router.get("/", authMiddleware(Role.SUPER_ADMIN), superAdminController.getAllSuperAdmin)
router.get("/:id", authMiddleware(Role.SUPER_ADMIN), superAdminController.getSuperAdmin)
router.put("/:id", authMiddleware(Role.SUPER_ADMIN), validateRequest(updateSuperAdminZodSchema),
    superAdminController.updateSuperAdmin)
router.delete("/:id", authMiddleware(Role.SUPER_ADMIN), superAdminController.deleteSuperAdmin)

export const superAdminRouter: Router = router;