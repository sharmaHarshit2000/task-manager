"use client";

import { ReactNode } from "react";
import Navbar from "../components/Navbar";
import { TaskProvider } from "../context/TaskContext";
import { AuthProvider } from "../context/AuthContext";
import "./globals.css";
import Head from "next/head";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <Head>
        <title>Task Manager</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body className="bg-white text-gray-900 min-h-screen">
        <AuthProvider>
          <TaskProvider>
            <Navbar />
            <main className="px-2 sm:px-4 lg:px-8 xl:px-16 2xl:px-24 mx-auto">
              {children}
            </main>
          </TaskProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
