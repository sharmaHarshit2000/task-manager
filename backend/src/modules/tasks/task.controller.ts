import type { Request, Response } from "express";
import * as taskService from "./task.service.js";
import type { TaskInput } from "./task.types.js";

export const createTaskController = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const task = await taskService.createTask(userId, req.body as TaskInput);
    res.status(201).json(task);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};


export const getTasksController = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    // Parse query params
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 10;
    const status = req.query.status as string;
    const search = req.query.search as string;

    const { tasks, total } = await taskService.getTasks(
      userId,
      page,
      pageSize,
      status,
      search
    );

    res.json({ tasks, total });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const getTaskController = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const task = await taskService.getTaskById(userId, Number(req.params.id));
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const updateTaskController = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const result = await taskService.updateTask(
      userId,
      Number(req.params.id),
      req.body as TaskInput
    );
    if (result.count === 0)
      return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task updated" });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteTaskController = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const result = await taskService.deleteTask(userId, Number(req.params.id));
    if (result.count === 0)
      return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task deleted" });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const toggleTaskController = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const task = await taskService.toggleTaskStatus(
      userId,
      Number(req.params.id)
    );
    res.json(task);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
