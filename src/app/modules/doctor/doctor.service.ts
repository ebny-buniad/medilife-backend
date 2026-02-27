import { prisma } from "../../lib/prisma"

// ** Get all doctors
const getAllDoctors = async () => {
    const doctors = await prisma.doctor.findMany({
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                    role: true,
                    status: true,
                    emailVerified: true,
                    createdAt: true,
                }
            },
            specialities: {
                include: {
                    speciality: {
                        select: {
                            id: true,
                            title: true,
                            description: true,
                            icon: true
                        }
                    }
                }
            }
        }
    })
    return doctors;
}

export const DoctorService = {
    getAllDoctors
}