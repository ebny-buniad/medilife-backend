import { Router } from "express";
import { doctorController } from "./doctor.controller";

const router = Router();
router.get("/", doctorController.getAllDoctors);
router.get("/:id", doctorController.getDoctorById);
router.put("/:id", doctorController.updateDoctorById);
router.delete("/:id", doctorController.deleteDoctorById);

export const doctorRouter: Router = router;