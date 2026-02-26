import app from "./app";
import { prisma } from "./app/lib/prisma";
import { envVars } from "./config/env";

const bootstrap = async () => {
    // Start the server
    try {
        await prisma.$connect();
        console.log("Connect Database Successfully!")
        app.listen(envVars.PORT, () => {
            console.log(`Server is running on :${envVars.PORT}`);
        });
    }
    catch (error) {
        console.error("Failed to start server:", error)
        await prisma.$disconnect();
        process.exit(1);
    }

}

bootstrap();