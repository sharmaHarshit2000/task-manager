import { prisma } from "../../prisma/client.js";
import type { TaskInput } from "./task.types.js";

export const createTask = async (userId: number, input: TaskInput) => {
  return prisma.task.create({
    data: {
      ...input,
      status: input.status || "pending",
      userId,
    },
  });
};

export const getTasks = async (
  userId: number,
  page = 1,
  pageSize = 10,
  status?: string,
  search?: string
) => {
  const where: any = { userId };
  if (status) where.status = status;
  if (search) where.title = { contains: search, mode: "insensitive" };

  const [tasks, total] = await Promise.all([
    prisma.task.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: "desc" },
    }),
    prisma.task.count({ where }),
  ]);

  return { tasks, total };
};


export const getTaskById = async (userId: number, taskId: number) => {
  return prisma.task.findFirst({
    where: { id: taskId, userId },
  });
};

export const updateTask = async (
  userId: number,
  taskId: number,
  input: TaskInput
) => {
  return prisma.task.updateMany({
    where: { id: taskId, userId },
    data: input,
  });
};

export const deleteTask = async (userId: number, taskId: number) => {
  return prisma.task.deleteMany({
    where: { id: taskId, userId },
  });
};
export const toggleTaskStatus = async (userId: number, taskId: number) => {
  const task = await prisma.task.findFirst({ where: { id: taskId, userId } });
  if (!task) throw new Error("Task not found");

  const newStatus = task.status === "completed" ? "pending" : "completed";

  return prisma.task.update({
    where: { id: task.id },
    data: { status: newStatus },
  });
};
