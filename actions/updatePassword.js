"use server";

import User from "@/models/User.model";
import connectToDB from "@/config/db";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import bcrypt from "bcryptjs";

const updatePassword = async (currentPassword, newPassword) => {
  try {
    await connectToDB();
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return {
        status: "failed",
        message: "Unauthorized request.",
      };
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return {
        status: "failed",
        message: "User not found.",
      };
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return {
        status: "failed",
        message: "Incorrect current password.",
      };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return {
      status: "success",
      message: "Password updated successfully.",
    };
  } catch (error) {
    console.error("Password update error:", error);
    return {
      status: "failed",
      message: "Something went wrong while updating the password.",
    };
  }
};

export default updatePassword;
