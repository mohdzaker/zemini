"use server";

import axios from "axios";
import cloudinary from "cloudinary";
import fs from "fs/promises";
import path from "path";
import Image from "@/models/Image.model";
import connectToDB from "@/config/db";
import { getServerSession } from "next-auth";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Generate or transform an image using Zemini Cloudflare Worker
 * @param {string} prompt - The text prompt for AI generation
 * @param {string} [type="generate"] - Type of generation ("generate" | "ghibli" | "img2img")
 * @param {string} [imageUrl] - Optional image URL (for Ghibli transformation)
 */
export default async function generateImage(prompt, type = "generate", imageUrl = null) {
  try {
    await connectToDB();

    console.log(`🚀 Generating (${type}) image for prompt:`, prompt);

    // ✅ Call your Cloudflare Worker API
    const response = await axios.post(
      "https://zemini.mohammadzaker245.workers.dev",
      { prompt, type, imageUrl },
      {
        headers: {
          Authorization: "Bearer zeminiimagegenerator",
          "Content-Type": "application/json",
        },
        responseType: "arraybuffer",
      }
    );

    // ✅ Save image temporarily
    const tempDir = path.join(process.cwd(), "tmp");
    await fs.mkdir(tempDir, { recursive: true });

    const tempPath = path.join(tempDir, `image_${Date.now()}.png`);
    await fs.writeFile(tempPath, response.data);

    // ✅ Upload to Cloudinary
    const upload = await cloudinary.v2.uploader.upload(tempPath, {
      folder: "zemini/generated",
      resource_type: "image",
    });

    // ✅ Clean up temp file
    await fs.unlink(tempPath);

    // ✅ Get session user
    const session = await getServerSession();
    const userEmail = session?.user?.email || "guest";

    // ✅ Save in MongoDB
    const newImage = await Image.create({
      userEmail,
      prompt,
      imageUrl: upload.secure_url,
      type,
    });

    console.log("✅ Image saved & uploaded successfully:", upload.secure_url);

    // ✅ Return clean response
    return {
      status: "success",
      imageUrl: upload.secure_url,
      message:
        type === "ghibli"
          ? "Ghibli-style image generated successfully 🎨✨"
          : "Image generated successfully 🎨",
      data: JSON.parse(JSON.stringify(newImage)),
    };
  } catch (error) {
    console.error("❌ AI Image Generation Error:", error?.response?.data || error);
    return {
      status: "failed",
      message: error?.message || "Something went wrong while generating the image.",
    };
  }
}
