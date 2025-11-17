"use client";

import { useEffect, useState } from "react";
import TaskCard from "../components/TaskCard";
import Link from "next/link";
import ProtectedRoute from "../components/ProtectedRoute";
import { useAuth } from "../context/AuthContext";
import { useTasks } from "../context/TaskContext";

export default function DashboardPage() {
  const { isLoggedIn } = useAuth();
  const { tasks, total, fetchTasks } = useTasks();

  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [loading, setLoading] = useState(false);

  const totalPages = Math.ceil(total / pageSize);

  useEffect(() => {
    if (!isLoggedIn) return;

    setLoading(true);
    fetchTasks(currentPage, statusFilter, search, pageSize).finally(() =>
      setLoading(false)
    );
  }, [currentPage, statusFilter, search, pageSize, isLoggedIn]);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100 text-gray-900 w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 max-w-360 mx-auto py-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-3">
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="border border-gray-300 p-3 rounded-lg w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="border border-gray-300 p-3 rounded-lg w-full md:w-1/4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
          <Link
            href="/tasks/create"
            className="bg-green-500 hover:bg-green-600 text-white font-semibold px-5 py-3 rounded-lg shadow-md transition duration-200 w-full md:w-auto text-center"
          >
            + Add Task
          </Link>
        </div>

        {/* Task List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center mt-20">
            <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
            <span className="mt-3 text-lg text-gray-700">Loading tasks...</span>
          </div>
        ) : tasks.length === 0 ? (
          <div className="flex items-center justify-center mt-20 text-gray-500 text-lg">
            No tasks found.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>

            {/* Pagination + Page Size */}
            <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-3">
              <div className="flex items-center gap-2">
                <span className="text-gray-700">Show</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="border border-gray-300 p-2 rounded w-20 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                </select>
                <span className="text-gray-700">per page</span>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-100 disabled:bg-gray-100 disabled:text-gray-400"
                >
                  Prev
                </button>

                {[...Array(totalPages)].map((_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-1 rounded border ${
                        currentPage === pageNum
                          ? "bg-blue-500 text-white border-blue-500"
                          : "border-gray-300 hover:bg-gray-100"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(p + 1, totalPages))
                  }
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-100 disabled:bg-gray-100 disabled:text-gray-400"
                >
                  Next
                </button>
              </div>

              <div className="text-gray-700">
                Total <strong>{total}</strong> items
              </div>
            </div>
          </>
        )}
      </div>
    </ProtectedRoute>
  );
}
