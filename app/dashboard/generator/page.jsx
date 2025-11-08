"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import generateImage from "@/actions/generateImage";
import { toast } from "sonner";
import { useImages } from "@/hooks/useImages";

export default function ImageGeneratorPage() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const { images, isLoading, deleteImage, refetch } = useImages();

  const suggestions = [
    "Studio Ghibli forest with glowing spirits",
    "Cyberpunk rainy street at night neon lights",
    "Fairy floating over a lake, soft pastel colors",
    "Futuristic samurai in a neon city",
  ];

  // ✅ Generate New Image
  const handleGenerate = async () => {
    if (!prompt.trim()) return toast.error("Please enter a prompt!");
    setLoading(true);

    const res = await generateImage(prompt);
    setLoading(false);

    if (res.status === "success") {
      toast.success("Image generated successfully!");
      setPrompt("");
      await refetch(); // auto-refresh history
    } else {
      toast.error(res.message);
    }
  };

  // ✅ Delete image
  const handleDelete = async (id) => {
    await deleteImage.mutateAsync(id);
    toast.success("Image deleted successfully!");
  };

  // ✅ Download image
  const downloadImage = (url) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = "generated-image.png";
    link.click();
  };

  const copyPrompt = (text) => navigator.clipboard.writeText(text);

  const ShimmerCard = () => (
    <div className="rounded-xl overflow-hidden bg-card/30 backdrop-blur-lg border border-border/40 shadow-md animate-pulse h-64" />
  );

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-12 max-w-5xl mx-auto"
      >
        {/* HEADER */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-semibold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            AI Image Generator ✨
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Describe something magical — let AI bring it to life.
          </p>
        </div>

        {/* PROMPT AREA */}
        <Card className="bg-card/40 backdrop-blur-md border border-border/40 shadow-xl px-6 py-8 space-y-6 rounded-2xl">
          <div className="relative">
            <Input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
              placeholder="Example: A samurai cat meditating under cherry blossoms..."
              className="text-base py-6 pr-14 bg-transparent border border-border/50 rounded-xl focus:ring-2 focus:ring-primary/50"
            />

            <Button
              onClick={handleGenerate}
              disabled={loading}
              className="absolute right-2 top-1/2 -translate-y-1/2 py-5 px-5 rounded-xl bg-primary hover:bg-primary/90 transition-all"
            >
              {loading ? (
                <span className="animate-spin w-5 h-5 border-2 border-t-transparent border-white rounded-full" />
              ) : (
                <Sparkles size={18} />
              )}
            </Button>
          </div>

          {/* Suggestions */}
          <div className="flex flex-wrap gap-3 pt-2">
            {suggestions.map((text, i) => (
              <button
                key={i}
                onClick={() => setPrompt(text)}
                className="px-3 py-1.5 text-xs rounded-lg bg-card/30 hover:bg-card/70 border border-border/40 transition"
              >
                {text}
              </button>
            ))}
          </div>
        </Card>

        {/* HISTORY SECTION */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-primary">Your Creations</h2>

          {loading || isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <ShimmerCard />
              <ShimmerCard />
              <ShimmerCard />
            </div>
          ) : images.length === 0 ? (
            <div className="relative overflow-hidden rounded-2xl border border-border/40 bg-card/30 backdrop-blur-lg shadow-xl py-24 flex flex-col items-center justify-center">
              <img
                src="/background.jpg"
                className="absolute inset-0 w-full h-full object-cover opacity-20"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40"></div>
              <div className="relative text-center space-y-3 px-6">
                <h3 className="text-xl font-medium text-primary/90">
                  No Images Yet
                </h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Start your creative journey — describe something magical and
                  generate your first artwork ✨
                </p>
                <Button
                  onClick={() =>
                    setPrompt("A serene sky full of floating lanterns at night")
                  }
                  className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-5 py-2"
                >
                  Try Example Prompt
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {images.map((item) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="group relative overflow-hidden rounded-2xl shadow-xl border border-border/40 bg-card/30 backdrop-blur-lg"
                >
                  <img
                    src={item.imageUrl}
                    className="w-full h-64 object-cover group-hover:scale-105 transition duration-500"
                  />

                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex flex-col justify-between p-4">
                    <p className="text-white/90 text-xs italic line-clamp-2">
                      {item.prompt}
                    </p>

                    <div className="flex justify-between gap-2">
                      <Button
                        onClick={() => downloadImage(item.imageUrl)}
                        className="px-3 py-1 text-xs bg-white text-black hover:bg-white/80 rounded-md"
                      >
                        Download
                      </Button>
                      <Button
                        onClick={() => handleDelete(item._id)}
                        className="px-3 py-1 text-xs bg-red-500 hover:bg-red-600 rounded-md"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* MODAL PREVIEW */}
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[999] p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-card/95 border border-border/60 rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden space-y-5"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage.url}
                className="w-full max-h-[70vh] object-contain bg-black"
              />

              <div className="p-5 space-y-4">
                <p className="text-center text-muted-foreground italic text-sm">
                  “{selectedImage.prompt}”
                </p>

                <div className="flex justify-center gap-3">
                  <Button onClick={() => downloadImage(selectedImage.url)}>
                    Download
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => copyPrompt(selectedImage.prompt)}
                  >
                    Copy Prompt
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </DashboardLayout>
  );
}
