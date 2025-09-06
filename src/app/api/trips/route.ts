import { connectDB } from "@/libs/db";
import { NextRequest, NextResponse } from "next/server";
import { Trips } from "@/model/trip";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/options";

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);
        if (!session?.user || !session) {
            return NextResponse.json({ error: "Not authorized" }, { status: 401 });
        }

        const body = await req.json();
        const { title, startDate, endDate, location, description,activities,expenses } = body;
        if(!title || !startDate || !endDate || !location){
            return NextResponse.json({error:"Title, Start Date, End Date and Location are required"}, {status:400});
        }

        const newTrip = new Trips({
            userId: session.user._id,
            title,
            startDate,
            endDate,
            location,
            description,
            activities,
            expenses
        });
        await newTrip.save();
        return NextResponse.json({ message: "Trip created", trip: newTrip }, { status: 201 });

    } catch (error) {
        console.error("Error creating trip:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Not authorized" }, { status: 401 });
        }

        const user = session.user;
        await connectDB();

        const { searchParams } = new URL(req.url);
        const type = searchParams.get("type")?.toLowerCase().trim();
        const today = new Date();

        let query: any = { userId: user._id };

        if (type === "upcoming") {
            query.startDate = { $gte: today };
            query.isCanceled = false;
        } else if (type === "past") {
            query.endDate = { $lt: today };
            query.isCanceled = false;
        } else if (type === "canceled") {
            query.isCanceled = true;
        } else {
            return NextResponse.json({ error: "Invalid type parameter" }, { status: 400 });
        }

        const trips = await Trips.find(query).sort({ startDate: -1 });

        return NextResponse.json({ trips }, { status: 200 });
    } catch (error) {
        console.log("Error: ", error);
        return NextResponse.json({ error: "Internal Server Error to fetch trips" }, { status: 500 });
    }
}
