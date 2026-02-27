import * as z from 'zod';
import { Gender } from '../../../generated/prisma/enums';

export const createDoctorZodSchema = z.object({
    password: z.string("Password is required").min(8, "Password must be at least 8 characters long"),
    doctor: z.object({
        name: z.string("Name is required and must be a string").min(5, "Name must be at least 5 characters long"),
        email: z.email("Invalid email address"),
        registrationNumber: z.string("Registration number is required"),
        experience: z.int("Experience must be an integer").nonnegative("Experience cannot be negative"),
        gender: z.enum([Gender.MALE, Gender.FEMALE]),
        appointmentFee: z.number("Appointment fee must be a number").nonnegative("Appointment fee cannot be negative"),
        qualification: z.string("Qualification is required"),
        currentWorkingPlace: z.string("Current workplace is required"),
        designation: z.string("Designation is required"),
    }),
    specialities: z.array(z.uuid(), "Specialities must be an array of UUIDs").min(1, "At least one speciality is required"),
})