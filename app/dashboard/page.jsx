"use client";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Image, Palette, Sparkles } from "lucide-react";
import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";

export default function DashboardPage() {
    return (
        <DashboardLayout>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-8"
            >
                {/* WELCOME */}
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-semibold text-primary">👋 Welcome back, Zaker!</h1>
                    <p className="text-muted-foreground">Start creating magic today.</p>
                </div>

                {/* STATS (moved to the top) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Card className="bg-card/40 backdrop-blur-md border border-primary/20 shadow-sm hover:shadow-lg transition cursor-pointer">
                        <CardContent className="p-6 space-y-2">
                            <p className="text-sm text-muted-foreground">Images Generated</p>
                            <p className="text-3xl font-semibold">124</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-card/40 backdrop-blur-md border border-primary/20 shadow-sm hover:shadow-lg transition cursor-pointer">
                        <CardContent className="p-6 space-y-2">
                            <p className="text-sm text-muted-foreground">Ghibli Conversions</p>
                            <p className="text-3xl font-semibold">32</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-card/40 backdrop-blur-md border border-primary/20 shadow-sm hover:shadow-lg transition cursor-pointer">
                        <CardContent className="p-6 space-y-2">
                            <p className="text-sm text-muted-foreground">Account Level</p>
                            <p className="text-3xl font-semibold flex items-center gap-2">
                                Pro <Sparkles size={18} className="text-primary" />
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* FEATURE CARDS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                    {/* Image Generator */}
                    <Link href="/dashboard/generator">
                        <motion.div
                            whileHover={{ scale: 1.03 }}
                            className="relative group rounded-xl overflow-hidden cursor-pointer shadow-lg"
                        >
                            <img
                                src="https://images.unsplash.com/photo-1518773553398-650c184e0bb3?auto=format&fit=crop&w=1200&q=80"
                                className="w-full h-52 object-cover group-hover:scale-110 transition duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                            <div className="absolute bottom-4 left-4 right-4 space-y-1">
                                <div className="flex items-center gap-2 text-white">
                                    <Image size={18} className="text-primary" />
                                    <span className="text-lg font-semibold">AI Image Generator</span>
                                </div>
                                <p className="text-sm text-white/80 leading-tight">
                                    Create stunning AI images using natural language prompts.
                                </p>
                                <button className="mt-2 px-3 py-1.5 text-sm rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition">
                                    Try Now →
                                </button>
                            </div>
                        </motion.div>
                    </Link>

                    {/* Ghibli Converter */}
                    <Link href="/dashboard/ghibli">
                        <motion.div
                            whileHover={{ scale: 1.03 }}
                            className="relative group rounded-xl overflow-hidden cursor-pointer shadow-lg"
                        >
                            <img
                                src="https://images.unsplash.com/photo-1518773553398-650c184e0bb3?auto=format&fit=crop&w=1200&q=80"
                                className="w-full h-52 object-cover group-hover:scale-110 transition duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                            <div className="absolute bottom-4 left-4 right-4 space-y-1">
                                <div className="flex items-center gap-2 text-white">
                                    <Palette size={18} className="text-primary" />
                                    <span className="text-lg font-semibold">Image → Ghibli Art</span>
                                </div>
                                <p className="text-sm text-white/80 leading-tight">
                                    Transform photos into dreamy Studio Ghibli art ✨
                                </p>
                                <button className="mt-2 px-3 py-1.5 text-sm rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition">
                                    Convert →
                                </button>
                            </div>
                        </motion.div>
                    </Link>

                </div>

                {/* GUIDE CARD */}
                <Card className="overflow-hidden rounded-xl border border-primary/20 bg-card/50 backdrop-blur-xl shadow-lg">
                    <div className="flex flex-col sm:flex-row items-stretch h-full">

                        {/* Image */}
                        <div className="w-full sm:w-1/2 -my-6">
                            <img
                                src="https://images.unsplash.com/photo-1522199710521-72d69614c702?auto=format&fit=crop&w=1200&q=80"
                                className="w-full h-full object-cover object-center block"
                            />
                        </div>

                        {/* Text */}
                        <CardContent className="sm:w-1/2 p-5 flex flex-col justify-center gap-3 mt-6">
                            <h3 className="text-xl font-semibold">How to Use Zemini Tools ✨</h3>

                            <p className="text-muted-foreground leading-relaxed">
                                Generate stunning visuals or transform photos into Ghibli art — all in seconds.
                            </p>

                            <div className="flex gap-3 pt-1">
                                <Link href="/dashboard/generator">
                                    <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition shadow-md">
                                        Generate Image
                                    </button>
                                </Link>

                                <Link href="/dashboard/ghibli">
                                    <button className="px-4 py-2 text-black rounded-lg bg-secondary hover:bg-secondary/80 transition shadow-md">
                                        Ghibli Converter
                                    </button>
                                </Link>
                            </div>
                        </CardContent>

                    </div>
                </Card>

            </motion.div>
        </DashboardLayout>
    );
}
