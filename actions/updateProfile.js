"use server";

import User from "@/models/User.model";
import connectToDB from "@/config/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_URL.split("@")[1],
  api_key: process.env.CLODINARY_API_KEY,
  api_secret: process.env.CLODINARY_API_SECRET,
});

const updateProfile = async (formData) => {
  try {
    await connectToDB();
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return { status: "failed", message: "Unauthorized request." };
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return { status: "failed", message: "User not found." };
    }

    const full_name = formData.get("full_name");
    const file = formData.get("avatar");

    let imageUrl = user.image_link;

    // ✅ If a new avatar is uploaded
    if (file && typeof file === "object") {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const uploadResponse = await new Promise((resolve, reject) => {
        cloudinary.v2.uploader
          .upload_stream({ folder: "avatars" }, (error, result) => {
            if (error) reject(error);
            else resolve(result);
          })
          .end(buffer);
      });

      imageUrl = uploadResponse.secure_url;
    }

    user.full_name = full_name || user.full_name;
    user.image_link = imageUrl;
    await user.save();

    return { status: "success", message: "Profile updated successfully!" };
  } catch (error) {
    console.error("Profile Update Error:", error);
    return { status: "failed", message: "Something went wrong while updating profile." };
  }
};

export default updateProfile;
