"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
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

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Generate an image using Google Gemini API
 * @param {string} prompt - The text prompt for AI generation
 * @param {string} [type="generate"] - Type of generation ("generate" | "ghibli" | "img2img")
 * @param {string} [imageUrl] - Optional image URL (for Ghibli transformation)
 */
export default async function generateImage(prompt, type = "generate", imageUrl = null) {
  try {
    await connectToDB();

    console.log(`Generating (${type}) image for prompt:`, prompt);

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 1,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8192,
        responseMimeType: "image/jpeg",
      },
    });

    const imageData = result.response.candidates[0].content.parts[0].inlineData;

    if (!imageData || !imageData.data) {
      throw new Error("No image data returned from Gemini API");
    }

    const imageBuffer = Buffer.from(imageData.data, "base64");

    const tempDir = path.join(process.cwd(), "tmp");
    await fs.mkdir(tempDir, { recursive: true });

    const tempPath = path.join(tempDir, `image_${Date.now()}.jpg`);
    await fs.writeFile(tempPath, imageBuffer);

    const upload = await cloudinary.v2.uploader.upload(tempPath, {
      folder: "zemini/generated",
      resource_type: "image",
    });

    await fs.unlink(tempPath);

    const session = await getServerSession();
    const userEmail = session?.user?.email || "guest";

    const newImage = await Image.create({
      userEmail,
      prompt,
      imageUrl: upload.secure_url,
      type,
    });

    console.log("Image saved & uploaded successfully:", upload.secure_url);

    return {
      status: "success",
      imageUrl: upload.secure_url,
      message:
        type === "ghibli"
          ? "Ghibli-style image generated successfully"
          : "Image generated successfully",
      data: JSON.parse(JSON.stringify(newImage)),
    };
  } catch (error) {
    console.error("AI Image Generation Error:", error?.response?.data || error);
    return {
      status: "failed",
      message: error?.message || "Something went wrong while generating the image.",
    };
  }
}
