import { connectDB } from "@/libs/db";
import { NextResponse, NextRequest } from "next/server";
import { Users } from "@/model/user";
import { authOptions } from "@/libs/options";
import { getServerSession } from "next-auth";
import { Destination } from "@/model/destination";

export async function GET(req: NextRequest) {
    try {
        await connectDB();

        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Not authorized" }, { status: 401 });
        }

        const userId = session.user._id;

        const userDoc = await Users.findById(userId)
            .populate("following", "fullname username avatar")

        if (!userDoc) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json(
            { message: "User fetched successfully", user: userDoc },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching user profile:", error);
        return NextResponse.json({ error: "Server issue" }, { status: 500 });
    }
}
