"use client";

import { useTasks } from "../../../context/TaskContext";
import TaskForm from "../../../components/TaskForm";
import { useParams } from "next/navigation";
import ProtectedRoute from "../../../components/ProtectedRoute";

export default function EditTaskPage() {
  const { tasks } = useTasks();
  const params = useParams();
  const task = tasks.find((t) => t.id === Number(params.id));

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col items-center bg-gray-50 text-gray-900 px-4 pt-12">
        {!task ? (
          <p className="text-red-500 text-lg">Task not found</p>
        ) : (
          <div className="w-full max-w-md">
            <h2 className="text-3xl font-bold mb-4 text-center">Edit Task</h2>
            <TaskForm task={task} />
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
