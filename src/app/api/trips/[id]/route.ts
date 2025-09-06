import { Trips } from "@/model/trip";
import { connectDB } from "@/libs/db";
import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/options";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Not authorized" }, { status: 401 })
        }
        await connectDB();

        const { id } = await params;
        const body = await req.json();
        const { title, startDate, endDate, location, description ,destinations,activities,expenses } = body;
        if(!title || !startDate || !endDate || !location){
            return NextResponse.json({error:"Title, Start Date, End Date and Location are required"}, {status:400});
        }
        const updatedTrip = await Trips.findOneAndUpdate(
            { _id: id, userId: session.user._id },
            {
                title,
                startDate,
                endDate,
                location,
                description,
                destinations,
                activities,
                expenses
            },
            { new: true }
        );
        if (!updatedTrip) {
            return NextResponse.json({ error: "Trip not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Trip updated", trip: updatedTrip }, { status: 200 });
    }catch (error) {
        console.error("Error updating trip:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }

}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Not authorized" }, { status: 401 })
        }

        await connectDB();
        const { id } = await params;

        const canceledTrip = await Trips.findByIdAndUpdate(
            { _id: id, userId: session.user._id },
            { isCanceled: true },
            { new: true }
        )

        if (!canceledTrip) {
            return NextResponse.json({ error: "Trip not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "successfully deleted", trip: canceledTrip }, { status: 200 });
    } catch (error) {
        console.log("Error: ", error);
        return NextResponse.json({ error: "failed to deleted trip" }, { status: 500 });
    }
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Not authorized" }, { status: 401 })
        }

        const user = session.user

        await connectDB();
        const { id } = await params;
        console.log("id: ", id);

        const trip = await Trips.findById(
            {
                _id: id,
                userId: user._id
            });
        if (!trip) {
            return NextResponse.json({ error: "failed to fetch the single trip" });
        }

        return NextResponse.json({ trip }, { status: 200 });
    } catch (error) {
        console.log("Error: ", error);
        return NextResponse.json({ error: "Internal issue to fetch trip" }, { status: 500 });
    }
}