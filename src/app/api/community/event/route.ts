import { connectDB } from "@/libs/db";
import { NextRequest,NextResponse } from "next/server";
import { Event } from "@/model/event";


export async function GET(req: NextRequest) {
    try {
        await connectDB();

        const today = new Date();

        const events = await Event.find({ date: { $gte: today } })
            .sort({ date: 1 })
            .select("title description date location createdBy");

        return NextResponse.json({events}, { status: 200 });
    } catch (error) {
        console.error("Error fetching events:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}