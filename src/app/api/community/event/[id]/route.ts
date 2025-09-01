import { getServerSession } from "next-auth";
import { connectDB } from "@/libs/db";
import { NextRequest,NextResponse } from "next/server";
import { Event } from "@/model/event";
import { authOptions } from "@/libs/options";
import { Users } from "@/model/user";

export async function GET(req:NextRequest,{params}: {params:{id:string}}){
    try {

        await connectDB();
        const event = await Event.findById(params.id).populate("createdBy", "username fullname");
        if (!event) {
            return NextResponse.json({ error: "Event not found" }, { status: 404 });
        }

        return NextResponse.json({event},{status:200});

    } catch (error) {
        console.error("Error fetching event:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }){
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

        const deleted = await Event.findByIdAndDelete(params.id);
        if (!deleted) {
            return NextResponse.json({ error: "Event not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Event deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting event:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}