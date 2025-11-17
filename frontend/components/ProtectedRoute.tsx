"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

interface Props {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: Props) {
  const router = useRouter();
  const { isLoggedIn, loading } = useAuth();
  const [canRender, setCanRender] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!isLoggedIn) {
        router.replace("/login"); // redirect if not logged in
      } else {
        setCanRender(true); // render children only if logged in
      }
    }
  }, [isLoggedIn, loading, router]);

  if (loading || !canRender) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return <>{children}</>;
}
