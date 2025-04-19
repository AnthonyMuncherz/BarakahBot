"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function AccessDenied() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="text-center space-y-6 p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-4xl font-bold text-red-600">Access Denied</h1>
        <p className="text-gray-600 text-lg">
          You do not have permission to access this page.
        </p>
        <div className="space-x-4">
          <Button
            onClick={() => router.push("/")}
            variant="outline"
          >
            Go Home
          </Button>
          <Button
            onClick={() => router.push("/login")}
          >
            Login
          </Button>
        </div>
      </div>
    </div>
  );
} 