"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-6">
        Oops! The page you are looking for does not exist.
      </p>
      <Link
        href="/"
        className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-3 rounded-lg font-semibold transition duration-200"
      >
        Go to Home
      </Link>
    </div>
  );
}
