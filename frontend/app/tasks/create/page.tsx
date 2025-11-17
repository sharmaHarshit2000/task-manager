"use client";
import TaskForm from "../../../components/TaskForm";
import ProtectedRoute from "../../../components/ProtectedRoute";

export default function CreateTaskPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col items-center bg-gray-50 text-gray-900 px-4 pt-12">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold mb-4 text-center">Add New Task</h2>
          <TaskForm />
        </div>
      </div>
    </ProtectedRoute>
  );
}
