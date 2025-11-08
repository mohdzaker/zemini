import { NextResponse } from "next/server";
import connectToDB from "@/config/db";
import Image from "@/models/Image.model";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  try {
    await connectToDB();
    const session = await getServerSession(authOptions);
    const email = session?.user?.email;

    if (!email) {
      return NextResponse.json({ status: "failed", message: "Not authenticated" });
    }

    const images = await Image.find({ userEmail: email }).sort({ createdAt: -1 });
    return NextResponse.json({ status: "success", data: images });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ status: "failed", message: error.message });
  }
}

export async function DELETE(req) {
  try {
    await connectToDB();
    const { id } = await req.json();
    const session = await getServerSession(authOptions);
    const email = session?.user?.email;

    if (!email) {
      return NextResponse.json({ status: "failed", message: "Not authenticated" });
    }

    const image = await Image.findOneAndDelete({ _id: id, userEmail: email });
    if (!image) {
      return NextResponse.json({ status: "failed", message: "Image not found" });
    }

    return NextResponse.json({ status: "success", message: "Image deleted" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ status: "failed", message: error.message });
  }
}
