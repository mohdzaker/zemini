"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { FaEnvelope } from "react-icons/fa";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setTimeout(() => setSent(true), 600);
  };

  return (
    <main className="w-full min-h-screen flex justify-center items-center bg-gradient-to-br from-primary/10 to-secondary/20 dark:from-gray-900 dark:to-gray-800">
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="w-[380px] shadow-xl border border-border/60 backdrop-blur-md bg-card/70 animate__animated animate__fadeInUp">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-semibold">
              Forgot Password 🔒
            </CardTitle>
            <p className="text-center text-sm text-muted-foreground">
              Don’t worry! Enter your email and we’ll send a reset link
            </p>
          </CardHeader>

          <CardContent>
            {!sent ? (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <FaEnvelope className="text-primary" />
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-transparent focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300"
                >
                  Send Reset Link
                </Button>
              </form>
            ) : (
              <div className="text-center space-y-4 py-4">
                <div className="text-green-600 dark:text-green-400 text-lg font-semibold">
                  ✅ Reset Link Sent!
                </div>
                <p className="text-sm text-muted-foreground">
                  We’ve sent a password reset link to{" "}
                  <span className="font-medium text-foreground">{email}</span>.
                </p>
              </div>
            )}

            {/* Back to Login */}
            <div className="mt-8 text-center">
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 text-primary hover:underline hover:text-primary/80"
              >
                <ArrowLeft size={18} /> Back to Login
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.section>
    </main>
  );
};

export default ForgotPassword;
