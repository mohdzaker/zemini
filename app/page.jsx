"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Image, Sparkles, Palette } from "lucide-react";

export default function LandingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/20 dark:from-gray-900 dark:to-gray-800 text-foreground">

      {/* FLOATING DREAMY BLOBS */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ duration: 2 }}
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <motion.div
          animate={{
            x: [0, 50, 0],
            y: [0, -40, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 12, repeat: Infinity }}
          className="absolute w-96 h-96 bg-primary/25 blur-[120px] rounded-full top-10 left-10"
        />
        <motion.div
          animate={{
            x: [0, -40, 0],
            y: [0, 50, 0],
            scale: [1.1, 0.9, 1.1],
          }}
          transition={{ duration: 14, repeat: Infinity }}
          className="absolute w-[30rem] h-[30rem] bg-secondary/25 blur-[150px] rounded-full bottom-0 right-0"
        />
      </motion.div>

      {/* SPARKLE PARTICLES */}
      <motion.div
        className="pointer-events-none absolute inset-0 -z-10"
        animate={{ opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 4, repeat: Infinity }}
        // style={{ backgroundImage: "url('https://i.imgur.com/2H0W1fY.png')" }}
      />

      {/* HERO SECTION */}
      <section className="max-w-5xl mx-auto text-center pt-28 pb-20 px-6">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl sm:text-7xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent drop-shadow-md"
        >
          Zemini
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-muted-foreground text-lg max-w-xl mx-auto mt-5 leading-relaxed"
        >
          Imagination → Reality in One Click ✨
          Bring dreamy, cinematic art to life instantly.
        </motion.p>

        {/* CTA BUTTONS */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mt-10 flex flex-wrap justify-center gap-4"
        >
          <Link href="/register">
            <Button className="px-8 py-6 text-lg rounded-2xl shadow-lg bg-primary hover:bg-primary/90">
              Get Started
            </Button>
          </Link>

          <Link href="/dashboard">
            <Button
              variant="outline"
              className="px-8 py-6 text-lg rounded-2xl backdrop-blur-md border-border/60 hover:bg-card/50"
            >
              Live Demo →
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* FEATURE CARDS */}
      <section className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 px-6 pb-32">
        {[
          {
            icon: Image,
            title: "AI Image Generator",
            text: "Describe your vision — AI paints it beautifully.",
          },
          {
            icon: Palette,
            title: "Ghibli Style Converter",
            text: "Turn real photos into dreamy Studio Ghibli scenes.",
          },
          {
            icon: Sparkles,
            title: "Creative Workspace",
            text: "Save, manage & revisit your inspiring artwork.",
          },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05, rotate: 1 }}
            transition={{ duration: 0.4 }}
            className="group bg-card/40 backdrop-blur-xl border border-border/40 shadow-lg rounded-2xl p-6 text-center space-y-3 hover:shadow-primary/30 transition"
          >
            <item.icon
              size={38}
              className="mx-auto text-primary group-hover:scale-110 transition"
            />
            <h3 className="text-lg font-semibold">{item.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{item.text}</p>
          </motion.div>
        ))}
      </section>

      {/* FOOTER */}
      <footer className="text-center text-muted-foreground pb-10">
        © {new Date().getFullYear()} Zemini • Built with 🌙 & Imagination
      </footer>
    </main>
  );
}
