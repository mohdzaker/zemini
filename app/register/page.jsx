"use client";
import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import Link from "next/link";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    confirm: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const registerMutation = useMutation({
    mutationFn: async () => {
      const res = await axios.post("/api/register", {
        full_name: form.full_name,
        email: form.email,
        password: form.password,
      });
      return res.data;
    },
    onSuccess: (data) => {
      if (data.status === "success") {
        toast.success(data.message);
        window.location.href = "/login";
      } else {
        toast.error(data.message);
      }
    },
    onError: () => toast.error("Something went wrong, try again."),
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.full_name || !form.email || !form.password) {
      toast.error("All fields are required!");
      return;
    }

    if (form.password !== form.confirm) {
      toast.error("Passwords do not match!");
      return;
    }

    registerMutation.mutate();
  };

  return (
    <main className="w-full min-h-screen flex justify-center items-center bg-gradient-to-br from-primary/10 to-secondary/20 dark:from-gray-900 dark:to-gray-800">
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="w-[380px] shadow-xl border border-border/60 backdrop-blur-md bg-card/70">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-semibold">
              Create Account ✨
            </CardTitle>
            <p className="text-center text-sm text-muted-foreground">
              Join us and explore amazing features
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="full_name" className="flex items-center gap-2">
                  <FaUser className="text-primary" /> Full Name
                </Label>
                <Input
                  id="full_name"
                  type="text"
                  placeholder="John Doe"
                  onChange={handleChange}
                  className="bg-transparent focus:ring-2 focus:ring-primary"
                />
              </div>

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

              {/* Password */}
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

              {/* Confirm Password */}
              <div className="space-y-2 relative">
                <Label htmlFor="confirm" className="flex items-center gap-2">
                  <FaLock className="text-primary" /> Confirm Password
                </Label>
                <Input
                  id="confirm"
                  type={showConfirm ? "text" : "password"}
                  placeholder="••••••••"
                  onChange={handleChange}
                  className="bg-transparent focus:ring-2 focus:ring-primary pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-9 text-muted-foreground hover:text-primary transition"
                >
                  {showConfirm ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </button>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={registerMutation.isPending}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300"
              >
                {registerMutation.isPending ? "Creating..." : "Sign Up"}
              </Button>

              {/* Divider */}
              <div className="flex items-center gap-2 my-4">
                <div className="flex-grow border-t border-border/60"></div>
                <span className="text-muted-foreground text-xs">OR</span>
                <div className="flex-grow border-t border-border/60"></div>
              </div>

              {/* Google */}
              <Button type="button" variant="outline" className="w-full flex items-center justify-center gap-2 hover:bg-secondary/50 transition-all">
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                Continue with Google
              </Button>

              {/* Link */}
              <p className="text-center text-sm text-muted-foreground mt-3">
                Already have an account?{" "}
                <Link href="/login" className="text-primary hover:underline hover:text-primary/80">
                  Log In
                </Link>
              </p>

            </form>
          </CardContent>
        </Card>
      </motion.section>
    </main>
  );
};

export default Register;
