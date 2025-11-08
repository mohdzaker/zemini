"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Image,
  User,
  Palette,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const DashboardLayout = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);
  const { data: session } = useSession();
  const pathname = usePathname();

  useEffect(() => {
    if (window.innerWidth < 768) setIsOpen(false);
  }, []);

  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    { name: "Image Generator", icon: Image, href: "/dashboard/generator" },
    { name: "Image to Ghibli", icon: Palette, href: "/dashboard/ghibli" },
    { name: "Profile", icon: User, href: "/dashboard/profile" },
  ];

  return (
    <main className="min-h-screen flex bg-gradient-to-br from-primary/10 to-secondary/20 dark:from-gray-900 dark:to-gray-800 relative">

      {/* SIDEBAR */}
      <motion.aside
        initial={{ x: 0 }}
        animate={{ x: isOpen ? 0 : -230 }}
        transition={{ duration: 0.25 }}
        className="
          fixed top-0 left-0 h-screen w-[230px] z-50
          flex flex-col border-r border-border/40
          bg-card/50 backdrop-blur-xl shadow-xl
        "
      >
        {/* LOGO */}
        <div className="flex flex-col items-center pt-6 mb-6">
          <h1 className="text-xl font-semibold text-primary tracking-wide">
            Zemini ⚡
          </h1>
        </div>

        {/* NAVIGATION */}
        <nav className="flex flex-col gap-1 px-3">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <div
                  className={`flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer transition
                    ${active
                      ? "bg-primary/15 border border-primary/40 text-primary"
                      : "hover:bg-primary/10 text-muted-foreground"
                    }`}
                >
                  <item.icon size={18} className="text-primary" />
                  <span className="text-sm">{item.name}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* USER FOOTER */}
        <div className="mt-auto p-4 flex items-center gap-3">
          <img
            src={
              session?.user?.image ||
              `https://ui-avatars.com/api/?name=${session?.user?.name || "User"}&background=random`
            }
            className="w-9 h-9 rounded-full border border-border/50 object-cover"
          />

          <div className="flex flex-col leading-tight">
            <span className="text-sm font-medium">
              {session?.user?.name || "Guest"}
            </span>
            <span className="text-xs text-muted-foreground">Pro Member</span>
          </div>
        </div>
      </motion.aside>

      {/* BACKDROP MOBILE */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      {/* MAIN CONTENT */}
      <div className={`flex-1 transition-all duration-300 ${isOpen ? "md:pl-[230px]" : "md:pl-0"}`}>

        {/* HEADER */}
        <header className="sticky top-0 bg-card/40 backdrop-blur-lg border-b border-border/40 shadow-sm p-4 flex justify-between items-center z-30">

          {/* TOGGLE BTN */}
          <div className="flex items-center gap-3 ml-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="text-muted-foreground hover:text-primary"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>

            <h2 className="text-lg font-medium text-primary">Dashboard</h2>
          </div>

          {/* PROFILE DROPDOWN */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <img
                src={
                  session?.user?.image ||
                  `https://ui-avatars.com/api/?name=${session?.user?.name || "User"}&background=random`
                }
                className="w-9 h-9 rounded-full shadow-md hover:scale-105 transition cursor-pointer object-cover"
              />
            </DropdownMenuTrigger>

            <DropdownMenuContent className="mr-3 mt-2 w-44 bg-card/80 backdrop-blur-xl border border-border/60 shadow-xl">
              <DropdownMenuItem asChild>
                <Link href="/dashboard/profile" className="flex items-center gap-2">
                  <User size={16} /> Profile
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="flex items-center gap-2 text-destructive hover:text-destructive"
              >
                <LogOut size={16} /> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {/* CONTENT */}
        <section className="p-6">{children}</section>
      </div>
    </main>
  );
};

export default DashboardLayout;
