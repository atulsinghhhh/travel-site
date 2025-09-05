import { getServerSession } from "next-auth";
import { connectDB } from "@/libs/db";
import { NextRequest,NextResponse } from "next/server";
import { Event } from "@/model/event";
import { authOptions } from "@/libs/options";
import { Users } from "@/model/user";

export async function POST(req:NextRequest){
    try {
        const session=await getServerSession(authOptions)
        if(!session || !session.user){
            return NextResponse.json( {error: "Not authorized" }, { status: 401 })
        }

        await connectDB();

        const admin=await Users.findById(session.user._id);
        if(admin.role !== "admin"){
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const {title,description,date,location} = await req.json();
        if(!title || !description || !date || !location){
            return NextResponse.json({error: "all fields are required"},{status:400})
        }

        await Event.create({
            title,
            description,
            date: new Date(date),
            location
        })
        return NextResponse.json({message: "successfully created event"},{status:201})
    } catch (error) {
        console.error("Error creating event:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}