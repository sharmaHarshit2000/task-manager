"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import type { Task } from "../types";
import api from "../lib/api";
import Toast from "../components/Toast";

interface TaskContextType {
  tasks: Task[];
  total: number;
  fetchTasks: (
    page?: number,
    status?: string,
    search?: string,
    pageSize?: number
  ) => Promise<void>; 
  addTask: (task: Partial<Task>) => Promise<void>;
  updateTask: (id: number, task: Partial<Task>) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
  toggleTask: (id: number) => Promise<void>;
  toast: { message: string; type: "success" | "error" } | null;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const showToast = (
    message: string,
    type: "success" | "error" = "success"
  ) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchTasks = async (
    p = 1,
    status?: string,
    search?: string,
    pageSize: number = 10
  ) => {
    try {
      const res = await api.get("/tasks", {
        params: { page: p, pageSize, status, search },
      });
      setTasks(res.data.tasks);
      setTotal(res.data.total);
      setPage(p);
    } catch (err) {
      showToast("Failed to fetch tasks", "error");
    }
  };

  const addTask = async (task: Partial<Task>) => {
    try {
      const res = await api.post("/tasks", task);
      setTasks((prev) => [res.data, ...prev]);
      showToast("Task added successfully");
    } catch (err) {
      showToast("Failed to add task", "error");
    }
  };

  const updateTask = async (id: number, task: Partial<Task>) => {
    try {
      await api.patch(`/tasks/${id}`, task);
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...task } : t))
      );
      showToast("Task updated successfully");
    } catch (err) {
      showToast("Failed to update task", "error");
    }
  };

  const deleteTask = async (id: number) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      showToast("Task deleted successfully");
    } catch (err) {
      showToast("Failed to delete task", "error");
    }
  };

  const toggleTask = async (id: number) => {
    try {
      const res = await api.patch(`/tasks/${id}/toggle`);
      setTasks((prev) => prev.map((t) => (t.id === id ? res.data : t)));
      showToast("Task status updated");
    } catch (err) {
      showToast("Failed to update status", "error");
    }
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        total,
        fetchTasks,
        addTask,
        updateTask,
        deleteTask,
        toggleTask,
        toast,
      }}
    >
      {children}
      {toast && <Toast message={toast.message} type={toast.type} />}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) throw new Error("useTasks must be used within TaskProvider");
  return context;
};
