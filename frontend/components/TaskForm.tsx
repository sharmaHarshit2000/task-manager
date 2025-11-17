"use client";
import { useState } from "react";
import { useTasks } from "../context/TaskContext";
import { useRouter } from "next/navigation";
import type { Task } from "../types";

interface TaskFormProps {
  task?: Task;
}

export default function TaskForm({ task }: TaskFormProps) {
  const { addTask, updateTask } = useTasks();
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [status, setStatus] = useState<Task["status"]>(
    task?.status || "pending"
  );
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      if (task) {
        await updateTask(task.id, { title, description, status });
      } else {
        await addTask({ title, description, status });
      }
      router.push("/"); 
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => router.push("/");

  return (
    <div className="max-w-lg w-full mx-auto p-8 bg-white rounded-3xl shadow-xl border border-gray-200">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition resize-none h-36"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as Task["status"])}
          className="p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        >
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>

        <div className="flex gap-4 mt-4">
          <button
            type="submit"
            disabled={loading}
            className={`flex-1 bg-blue-500 text-white font-semibold px-5 py-3 rounded-xl shadow-md transition transform hover:-translate-y-1 hover:bg-blue-600 ${
              loading ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            {loading
              ? task
                ? "Updating..."
                : "Adding..."
              : task
              ? "Update Task"
              : "Add Task"}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="flex-1 bg-gray-300 text-gray-800 font-semibold px-5 py-3 rounded-xl shadow-md transition transform hover:-translate-y-1 hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
