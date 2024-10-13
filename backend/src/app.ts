import cors from "cors";
import bodyParser from "body-parser";
import authRoutes from "./routes/auth.routes";
import suggestionRoutes from "./routes/routes";
import createHttpError, { isHttpError } from "http-errors";
import express, { Application, NextFunction, Request, Response } from "express";

const app: Application = express();

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'DELETE'],
  credentials: true,
}));

app.use(bodyParser.json());

app.use('/api/admin', authRoutes);
app.use('/api/suggestions', suggestionRoutes);

app.use((req: Request, res: Response, next: NextFunction) => {
  next(createHttpError(404, "Endpoint not found"));
});

app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error(error);
  let errorMessage = "An unknown error occurred";
  let statusCode = 500;
  if (isHttpError(error)) {
    statusCode = error.status;
    errorMessage = error.message;
  }
  res.status(statusCode).json({ error: errorMessage });
});

export default app;
