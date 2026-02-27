import { Router } from "express";
import { doctorController } from "./doctor.controller";

const router = Router();
router.get("/", doctorController.getAllDoctors);
router.get("/:id", doctorController.getDoctorById);
router.put("/:id", doctorController.updateDoctorById);

export const doctorRouter: Router = router;