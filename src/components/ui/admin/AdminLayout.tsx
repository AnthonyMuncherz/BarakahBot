"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  Users,
  Megaphone,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Wait until loading is finished before checking the user
    if (isLoading) {
        return; // Don't do anything while loading
    }

    // Now check if user has admin role
    if (!user || !user.labels?.includes("admin")) {
      router.push("/access-denied");
    }
  }, [user, router, isLoading]);

  const menuItems = [
    {
      title: "Overview",
      icon: <LayoutDashboard className="w-5 h-5" />,
      href: "/admin/dashboard",
    },
    {
      title: "Users",
      icon: <Users className="w-5 h-5" />,
      href: "/admin/users",
    },
    {
      title: "Campaigns",
      icon: <Megaphone className="w-5 h-5" />,
      href: "/admin/campaigns",
    },
  ];

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-md bg-white shadow-md"
        >
          {isSidebarOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="h-full flex flex-col">
          <div className="p-4 border-b">
            <h1 className="text-2xl font-bold text-primary">Admin Panel</h1>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              >
                {item.icon}
                <span>{item.title}</span>
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-md transition-colors w-full"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main
        className={`transition-all duration-200 ease-in-out ${
          isSidebarOpen ? "lg:ml-64" : "ml-0"
        }`}
      >
        <div className="container mx-auto px-4 py-8">{children}</div>
      </main>
    </div>
  );
} 