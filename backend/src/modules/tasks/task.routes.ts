import express from "express";
import { authMiddleware } from "../../middlewares/authMiddleware.js";
import * as taskController from "./task.controller.js";

const router = express.Router();

// Apply authMiddleware to all task routes
router.use(authMiddleware);

// CRUD routes
router.post("/", taskController.createTaskController);
router.get("/", taskController.getTasksController);
router.get("/:id", taskController.getTaskController);
router.patch("/:id", taskController.updateTaskController);
router.delete("/:id", taskController.deleteTaskController);
router.patch("/:id/toggle", taskController.toggleTaskController);

export default router;
