"use client";
import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { signIn } from "next-auth/react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import Link from "next/link";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => setForm({ ...form, [e.target.id]: e.target.value });

  const loginMutation = useMutation({
    mutationFn: async () => {
      const result = await signIn("credentials", {
        redirect: false,
        email: form.email,
        password: form.password,
      });

      if (result.error) throw new Error(result.error);
      return result;
    },
    onSuccess: () => {
      toast.success("Login successful 🎉");
      window.location.href = "/dashboard";
    },
    onError: (err) => {
      toast.error(err.message === "Incorrect password!" ? "Wrong Password ❌" : err.message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error("Email & Password are required!");
      return;
    }
    loginMutation.mutate();
  };

  return (
    <main className="w-full min-h-screen flex justify-center items-center bg-gradient-to-br from-primary/10 to-secondary/20 dark:from-gray-900 dark:to-gray-800">
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="w-[360px] shadow-xl border border-border/60 backdrop-blur-md bg-card/70">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-semibold">
              Welcome Back 👋
            </CardTitle>
            <p className="text-center text-sm text-muted-foreground">
              Sign in to continue your journey
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <FaEnvelope className="text-primary" /> Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  onChange={handleChange}
                  className="bg-transparent focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Password with Eye Toggle */}
              <div className="space-y-2 relative">
                <Label htmlFor="password" className="flex items-center gap-2">
                  <FaLock className="text-primary" /> Password
                </Label>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  onChange={handleChange}
                  className="bg-transparent focus:ring-2 focus:ring-primary pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 text-muted-foreground hover:text-primary transition"
                >
                  {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </button>
              </div>

              {/* Forgot Password */}
              <div className="text-right">
                <Link href="/forgot-password" className="text-sm text-primary hover:underline hover:text-primary/80">
                  Forgot password?
                </Link>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={loginMutation.isPending}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300"
              >
                {loginMutation.isPending ? "Logging in..." : "Login"}
              </Button>

              {/* Divider */}
              <div className="flex items-center gap-2 my-4">
                <div className="flex-grow border-t border-border/60"></div>
                <span className="text-muted-foreground text-xs">OR</span>
                <div className="flex-grow border-t border-border/60"></div>
              </div>

              {/* Google */}
              <Button
                type="button"
                onClick={() => signIn("google")}
                variant="outline"
                className="w-full flex items-center justify-center gap-2 hover:bg-secondary/50 transition-all"
              >
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                Continue with Google
              </Button>

              {/* Register link */}
              <p className="text-center text-sm text-muted-foreground mt-3">
                Don’t have an account?{" "}
                <Link href="/register" className="text-primary hover:underline hover:text-primary/80">
                  Sign Up
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </motion.section>
    </main>
  );
};

export default Login;
