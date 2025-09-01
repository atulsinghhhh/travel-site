import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/options";
import { connectDB } from "@/libs/db";
import { Users } from "@/model/user";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const session=await getServerSession(authOptions);
        if(!session || !session.user){
            return NextResponse.json( {error: "Not authorized" }, { status: 401 })
        }

        await connectDB();

        const currentUserId=session.user._id 
        const targetUserId=params.id

        if (currentUserId === targetUserId) {
            return NextResponse.json({ error: "You cannot follow yourself" }, { status: 400 });
        }

        const currentUser=await Users.findById(currentUserId);
        if(!currentUser){
            return NextResponse.json({ error: "Current user not found" }, { status: 404 });
        }

        const isFollowing = currentUser.following.includes(targetUserId);
        if (isFollowing) {
            currentUser.following.pull(targetUserId);
            await currentUser.save();
            return NextResponse.json({ message: "Unfollowed successfully" }, { status: 200 });
        } else {
            currentUser.following.push(targetUserId);
            await currentUser.save();
            return NextResponse.json({ message: "Followed successfully" }, { status: 200 });
        }
    } catch (error) {
        console.error("Follow API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        await connectDB();

        const user = await Users.findById(params.id).populate("following", "username fullname email");
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json(user.following, { status: 200 });
    } catch (error) {
        console.error("Get Following Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}