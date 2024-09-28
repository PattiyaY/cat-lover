import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../../../lib/mongodb";
import User from "../../../../../models/user";
import Favorite from "../../../../../models/favorite";
import bcrypt from "bcryptjs"

export async function GET(req) {
    try {
        await connectMongoDB();
        const { searchParams } = new URL(req.url);
        const email = searchParams.get("email");

        // Fetch the user's favorites based on their email
        const user = await User.findOne({ email: email }).select("name email");

        // Return the favorites array in the response
        return NextResponse.json({ user }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { message: "Internal Server Error" }, { status: 500 }
        );
    }
}

export async function PATCH(req) {
    try {
        await connectMongoDB();
        const { name, email, password, confirmPassword } = await req.json();
        const user = await User.findOne({ email }).select("id name email password");

        if (confirmPassword) {
            const isPasswordValid = await bcrypt.compare(confirmPassword, user.password);
            if (!isPasswordValid) {
                return NextResponse.json({ message: "Invalid current password" }, { status: 401 });
            }
        }

        if (name) user.name = name;
        if (email) user.email = email;
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            user.password = hashedPassword;
        }

        await user.save();
        return NextResponse.json({ message: "User profile updated successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error updating user:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        await connectMongoDB();
        const { email, password } = await req.json();
        const user = await User.findOne({ email }).select("password");

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json({ message: "Invalid password" }, { status: 401 });
        }

        await User.findOneAndDelete({ email });
        await Favorite.deleteMany({ userEmail: email })

        return NextResponse.json({ message: "User profile deleted successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}