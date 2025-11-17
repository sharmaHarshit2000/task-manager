import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth.routes.js";
import taskRoutes from "./modules/tasks/task.routes.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

app.use(cors());

// Public routes
app.use("/auth", authRoutes);

// Protected routes
app.use("/tasks", taskRoutes);

app.use(errorHandler);

export default app;
