import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/options";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/libs/db";
import { FlightBooking } from "@/model/booking";
import { Flight } from "@/model/fight";

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Not authorized" }, { status: 401 });
        }

        await connectDB();

        const { flightId, seats } = await req.json();
        if (!flightId || !seats) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        }

        const flight = await Flight.findById(flightId);
        if (!flight) {
            return NextResponse.json({ error: "Flight not found" }, { status: 404 });
        }

        const totalPrice = seats * flight.price;

        await FlightBooking.create({
            userId: session.user._id,
            flightId,
            seats,
            totalPrice
        });

        return NextResponse.json({ message: "Flight booking created successfully" }, { status: 201 });
    } catch (error) {
        console.log("Error Creating Flight Booking:", error);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Not authorized" }, { status: 401 });
        }

        await connectDB();

        const bookings = await FlightBooking.find({ userId: session.user._id })
            .populate("flightId", "airline from to departure arrival price image");

        return NextResponse.json({ bookings }, { status: 200 });
    } catch (error) {
        console.log("Error Fetching Flight Bookings:", error);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}
