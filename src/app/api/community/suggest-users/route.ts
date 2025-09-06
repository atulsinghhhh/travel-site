import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/options";
import { connectDB } from "@/libs/db";
import { Users } from "@/model/user";

export async function GET(req:NextRequest){
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Not authorized" }, { status: 401 });
        }

        await connectDB();
        const currentUser=await Users.findById(session.user._id).select("following");

        if(!currentUser){
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const suggestedUsers=await Users.find({
            _id: { $nin: [session.user._id, ...currentUser.following] },
        })
            .select("username fullname image bio")
            .limit(3);
        
        return NextResponse.json({suggestedUsers},{status:200})
    } catch (error) {
        console.error("Error fetching suggested users:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}