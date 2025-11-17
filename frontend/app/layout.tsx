"use client";

import { ReactNode } from "react";
import Navbar from "../components/Navbar";
import { TaskProvider } from "../context/TaskContext";
import { AuthProvider } from "../context/AuthContext"; // add this
import './globals.css';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 min-h-screen">
        <AuthProvider> 
          <TaskProvider>
            <Navbar />
            <main className="p-4 max-w-4xl mx-auto">{children}</main>
          </TaskProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
