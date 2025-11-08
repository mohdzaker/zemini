"use server";
import User from "@/models/User.model";
import connectToDB from "@/config/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const getProfile = async () => {
  try {
    await connectToDB();
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return {
        status: "failed",
        message: "Unauthorized user",
      };
    }

    const user = await User.findOne({ email: session.user.email }).lean();

    if (!user) {
      return {
        status: "failed",
        message: "User not found",
      };
    }

    return {
      status: "success",
      message: "Profile fetched successfully",
      data: {
        id: user._id.toString(),
        full_name: user.full_name,
        email: user.email,
        image_link: user.image_link || `https://ui-avatars.com/api/?name=${user.full_name}&background=random`,
      },
    };

  } catch (error) {
    console.log("GET PROFILE ERROR:", error);
    return {
      status: "failed",
      message: "Something went wrong",
    };
  }
};
