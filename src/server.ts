import  app  from "./app";
import { prisma } from "./app/lib/prisma";

const bootstrap = async () => {
    // Start the server
    try {
        await prisma.$connect();
        console.log("Connect Database Successfully!")
        app.listen(5000, () => {
            console.log(`Server is running on :${5000}`);
        });
    }
    catch (error) {
        console.error("Failed to start server:", error)
        await prisma.$disconnect();
        process.exit(1);
    }

}

bootstrap();