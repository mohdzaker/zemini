import connectToDB from "@/config/db";
import User from "@/models/User.model";
import bcrypt from "bcryptjs";

export async function POST(req) {
    try {
        await connectToDB();
        const { full_name, email, password } = await req.json();

        if (!full_name || !email || !password) {
            return Response.json(
                { status: "failed", message: "All fields are required!" },
                { status: 400 }
            );
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return Response.json(
                { status: "failed", message: "Email already registered!" },
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const image_link = `https://ui-avatars.com/api/?name=${encodeURIComponent(full_name)}&background=random`;

        await User.create({
            full_name,
            email,
            password: hashedPassword,
            image_link,
        });

        return Response.json(
            { status: "success", message: "User registered successfully!" },
            { status: 201 }
        );
    } catch (error) {
        return Response.json(
            { status: "failed", message: "Server Error" },
            { status: 500 }
        );
    }
}
