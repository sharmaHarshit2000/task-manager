"use client";
import { Task } from "../types";
import { useTasks } from "../context/TaskContext";
import Link from "next/link";
import { FiEdit, FiTrash2, FiCheck } from "react-icons/fi";
import { useState } from "react";

export default function TaskCard({ task }: { task: Task }) {
  const { deleteTask, toggleTask } = useTasks();
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    if (loading) return; // prevent multiple clicks
    setLoading(true);
    try {
      await toggleTask(task.id);
    } finally {
      setLoading(false);
    }
  };

  const statusColor =
    task.status === "completed"
      ? "bg-green-100 text-green-800"
      : task.status === "pending"
      ? "bg-yellow-100 text-yellow-800"
      : "bg-gray-100 text-gray-800";

  return (
    <div className="bg-white p-5 rounded-2xl shadow-md hover:shadow-xl transition-all duration-200 border border-gray-200 flex flex-col justify-between">
      {/* Task Header */}
      <div>
        <h2 className="text-lg font-bold text-gray-800 mb-2">{task.title}</h2>
        <p className="text-gray-600 mb-3">{task.description}</p>
        <span
          className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${statusColor}`}
        >
          {task.status.toUpperCase()}
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mt-4">
        <button
          onClick={handleToggle}
          disabled={loading}
          className={`flex-1 flex items-center justify-center gap-2 bg-blue-500 text-white font-medium px-4 py-2 rounded-lg shadow-md transition transform hover:-translate-y-1 ${
            loading ? "opacity-60 cursor-not-allowed" : "hover:bg-blue-600"
          }`}
        >
          <FiCheck className={loading ? "animate-spin" : ""} />
          {loading ? "Processing..." : "Toggle"}
        </button>
        <Link
          href={`/tasks/${task.id}`}
          className="flex-1 flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white font-medium px-4 py-2 rounded-lg shadow-md transition transform hover:-translate-y-1"
        >
          <FiEdit />
          Edit
        </Link>
        <button
          onClick={() => deleteTask(task.id)}
          className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2 rounded-lg shadow-md transition transform hover:-translate-y-1"
        >
          <FiTrash2 />
          Delete
        </button>
      </div>
    </div>
  );
}
