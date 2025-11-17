"use client";

import { Task } from "../types";
import { useTasks } from "../context/TaskContext";
import Link from "next/link";
import { FiEdit, FiTrash2, FiCheck } from "react-icons/fi";
import { useState } from "react";
import * as Tooltip from "@radix-ui/react-tooltip";

export default function TaskCard({ task }: { task: Task }) {
  const { deleteTask, toggleTask } = useTasks();
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    if (loading) return;
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
    <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-200 border border-gray-200 flex flex-col justify-between h-full wrap-break-word">
      {/* Task Header */}
      <div className="mb-4">
        <Tooltip.Provider>
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <h2 className="text-lg font-semibold text-gray-800 cursor-default truncate">
                {task.title}
              </h2>
            </Tooltip.Trigger>
            <Tooltip.Content
              side="top"
              className="bg-gray-900 text-white text-sm rounded px-2 py-1 shadow-lg max-w-xs wrap-break-word"
            >
              {task.title}
              <Tooltip.Arrow className="fill-gray-900" />
            </Tooltip.Content>
          </Tooltip.Root>

          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <p className="text-gray-600 mt-1 line-clamp-3 cursor-default truncate">
                {task.description}
              </p>
            </Tooltip.Trigger>
            <Tooltip.Content
              side="top"
              className="bg-gray-900 text-white text-sm rounded px-2 py-1 shadow-lg max-w-xs wrap-break-word"
            >
              {task.description}
              <Tooltip.Arrow className="fill-gray-900" />
            </Tooltip.Content>
          </Tooltip.Root>
        </Tooltip.Provider>

        <span
          className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-semibold ${statusColor}`}
        >
          {task.status.toUpperCase()}
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2 mt-4">
        <Tooltip.Provider>
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <button
                onClick={handleToggle}
                disabled={loading}
                className={`flex-1 md:flex-auto flex items-center justify-center gap-2 bg-blue-500 text-white font-medium px-3 py-2 rounded-lg shadow-md transition transform hover:-translate-y-0.5 ${
                  loading ? "opacity-60 cursor-not-allowed" : "hover:bg-blue-600"
                }`}
              >
                <FiCheck className={loading ? "animate-spin" : ""} />
                {loading ? "Processing..." : "Toggle"}
              </button>
            </Tooltip.Trigger>
            <Tooltip.Content
              side="top"
              className="bg-gray-900 text-white text-sm rounded px-2 py-1 shadow-lg"
            >
              Toggle task status
              <Tooltip.Arrow className="fill-gray-900" />
            </Tooltip.Content>
          </Tooltip.Root>

          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <Link
                href={`/tasks/${task.id}`}
                className="flex-1 md:flex-auto flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white font-medium px-3 py-2 rounded-lg shadow-md transition transform hover:-translate-y-0.5"
              >
                <FiEdit />
                Edit
              </Link>
            </Tooltip.Trigger>
            <Tooltip.Content
              side="top"
              className="bg-gray-900 text-white text-sm rounded px-2 py-1 shadow-lg"
            >
              Edit task
              <Tooltip.Arrow className="fill-gray-900" />
            </Tooltip.Content>
          </Tooltip.Root>

          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <button
                onClick={() => deleteTask(task.id)}
                className="flex-1 md:flex-auto flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-medium px-3 py-2 rounded-lg shadow-md transition transform hover:-translate-y-0.5"
              >
                <FiTrash2 />
                Delete
              </button>
            </Tooltip.Trigger>
            <Tooltip.Content
              side="top"
              className="bg-gray-900 text-white text-sm rounded px-2 py-1 shadow-lg"
            >
              Delete task
              <Tooltip.Arrow className="fill-gray-900" />
            </Tooltip.Content>
          </Tooltip.Root>
        </Tooltip.Provider>
      </div>
    </div>
  );
}
