import express, { Application, Request, Response } from "express";
import { IndexRoutes } from "./app/routes";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import notFound from "./middlewares/notFound";
import cookieParser from "cookie-parser"

const app: Application = express();

// Enable URL-encoded form data parsing
app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON bodies
app.use(express.json());

// Cookie parser
app.use(cookieParser());


app.use("/api/v1", IndexRoutes)


// Global error handler
app.use(globalErrorHandler)

// Not found
app.use(notFound)

// Basic route
app.get('/', async (req: Request, res: Response) => {
    res.send('Medilife server is running!');
});


export default app;