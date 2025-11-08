"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Image as ImageIcon,
  Eye,
  Trash2,
  Download,
} from "lucide-react";
import { toast } from "sonner";
import convertToGhibli from "@/actions/convertToGhibli";

export default function GhibliPage() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [outputImages, setOutputImages] = useState([]);
  const [preview, setPreview] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [modalItem, setModalItem] = useState(null);

  // ✅ Upload file handler
  const handleUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedImage(file);
    setPreview(URL.createObjectURL(file));
  };

  // ✅ Convert to Ghibli
  const convertImage = async () => {
    if (!selectedImage) return toast.error("Please upload an image first!");

    const toastId = toast.loading("Uploading image...");
    setProcessing(true);

    try {
      // 🩵 Step 1: Upload to Cloudinary as JPG
      const formData = new FormData();
      formData.append("file", selectedImage);
      formData.append("upload_preset", "zemini_unsigned");
      formData.append("folder", "zemini/ghibli");

      const upload = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const uploadRes = await upload.json();
      console.log("Cloudinary Upload Response:", uploadRes);

      if (!uploadRes.secure_url) {
        throw new Error(uploadRes.error?.message || "Cloudinary upload failed");
      }

      const fileUrl = uploadRes.secure_url;
      console.log("✅ Uploaded successfully:", fileUrl);
      if (!fileUrl) throw new Error("Cloudinary upload failed");

      toast.loading("Converting to Ghibli style...", { id: toastId });

      // 🧠 Step 2: Send to Worker through server action
      const prompt =
        "Transform this image into Studio Ghibli anime style with dreamy watercolor textures, soft tones, and cinematic atmosphere.";
      const res = await convertToGhibli(fileUrl, prompt);

      if (res.status === "success") {
        setOutputImages((prev) => [
          {
            id: Date.now(),
            url: res.ghibliUrl,
            prompt: res.data.prompt,
          },
          ...prev,
        ]);
        toast.success("Converted to Ghibli Style 🎨", { id: toastId });
      } else {
        toast.error(res.message || "Conversion failed", { id: toastId });
      }
    } catch (err) {
      console.error("❌ Conversion error:", err);
      toast.error(err.message || "Something went wrong.", { id: toastId });
    } finally {
      setProcessing(false);
      setSelectedImage(null);
      setPreview(null);
    }
  };

  // ✅ Delete from UI
  const deleteImage = (id) => {
    setOutputImages((prev) => prev.filter((img) => img.id !== id));
    if (modalItem?.id === id) setModalItem(null);
  };

  // ✅ Download
  const downloadImage = async (url) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `ghibli-art-${Date.now()}.jpg`;
      a.click();
      URL.revokeObjectURL(blobUrl);
      toast.success("Downloaded!");
    } catch {
      toast.error("Download failed");
    }
  };

  const ShimmerCard = () => (
    <div className="rounded-xl overflow-hidden bg-card/30 backdrop-blur-lg border border-border/40 shadow-md animate-pulse h-56" />
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
            Ghibli Style Converter 🎨
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Upload your photo and turn it into a dreamy Ghibli-inspired masterpiece.
          </p>
        </div>

        {/* UPLOAD */}
        <Card className="bg-card/40 backdrop-blur-md border border-border/40 shadow-xl rounded-2xl">
          <CardContent className="p-6 space-y-6">
            {!preview && (
              <label
                htmlFor="fileUpload"
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-border/60 rounded-2xl cursor-pointer hover:border-primary/50 transition"
              >
                <ImageIcon size={40} className="text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">
                  Click or drag image to upload
                </p>
                <input
                  id="fileUpload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleUpload}
                />
              </label>
            )}

            {preview && (
              <>
                <div className="relative w-full h-64 rounded-2xl overflow-hidden shadow-lg bg-black">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>

                <Button
                  onClick={convertImage}
                  disabled={processing}
                  className="w-full bg-primary text-primary-foreground py-5 hover:bg-primary/90 rounded-xl"
                >
                  {processing ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="animate-spin" size={18} /> Converting...
                    </span>
                  ) : (
                    "Convert to Ghibli 🎨"
                  )}
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        {/* HISTORY */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-primary">Your Converted Art</h2>

          {processing && outputImages.length === 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <ShimmerCard />
              <ShimmerCard />
              <ShimmerCard />
            </div>
          ) : outputImages.length === 0 ? (
            <div className="relative rounded-2xl overflow-hidden border border-border/40 bg-card/30 backdrop-blur-lg shadow-xl py-24 flex flex-col items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1522199710521-72d69614c702?auto=format&fit=crop&w=1200&q=80"
                className="absolute inset-0 w-full h-full object-cover opacity-20"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40"></div>
              <p className="relative text-muted-foreground italic z-10 text-sm">
                No Ghibli conversions yet — create your first ✨
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {outputImages.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="group relative overflow-hidden rounded-2xl shadow-xl border border-border/40 bg-card/30 backdrop-blur-lg"
                >
                  <img
                    src={item.url}
                    alt="Ghibli art"
                    className="w-full h-56 object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3">
                    <Button
                      size="icon"
                      onClick={() => setModalItem(item)}
                      className="bg-white text-black hover:bg-white/80 rounded-md"
                    >
                      <Eye size={18} />
                    </Button>
                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() => deleteImage(item.id)}
                      className="rounded-md"
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* MODAL */}
        {modalItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[999] bg-black/70 backdrop-blur-sm flex justify-center items-center p-4"
            onClick={() => setModalItem(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-card/95 rounded-2xl border border-border/60 shadow-2xl max-w-3xl w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={modalItem.url}
                alt="Ghibli art full size"
                className="w-full max-h-[70vh] object-contain bg-black"
              />
              <div className="p-5 space-y-4">
                <p className="text-center text-muted-foreground italic text-sm">
                  {modalItem.prompt}
                </p>
                <div className="flex justify-center gap-3">
                  <Button onClick={() => downloadImage(modalItem.url)}>
                    <Download size={18} className="mr-1" /> Download
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      deleteImage(modalItem.id);
                      setModalItem(null);
                    }}
                  >
                    <Trash2 size={18} className="mr-1" /> Delete
                  </Button>
                </div>
                <Button onClick={() => setModalItem(null)} className="w-full">
                  Close
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </DashboardLayout>
  );
}
