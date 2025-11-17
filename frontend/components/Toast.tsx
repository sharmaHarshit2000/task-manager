"use client";
import { useEffect, useState } from "react";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";

interface ToastProps {
  message: string;
  type?: "success" | "error";
  duration?: number;
}

export default function Toast({ message, type = "success", duration = 3000 }: ToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  if (!visible) return null;

  const bgColor = type === "success" ? "bg-green-500" : "bg-red-500";
  const Icon = type === "success" ? FiCheckCircle : FiXCircle;

  return (
    <div
      className={`fixed top-5 right-5 flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg text-white font-medium transform transition-all duration-300 ${
        visible ? "translate-x-0 opacity-100" : "translate-x-20 opacity-0"
      } ${bgColor}`}
    >
      <Icon className="text-lg" />
      <span>{message}</span>
    </div>
  );
}
