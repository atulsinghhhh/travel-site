import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/options";
import { NextRequest,NextResponse } from "next/server";
import { connectDB } from "@/libs/db";
import { CarBooking } from "@/model/booking";
import { Car } from "@/model/fight";

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Not authorized" }, { status: 401 });
        }

        await connectDB();

        const { carId, startDate, endDate } = await req.json();
        if (!carId || !startDate || !endDate) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        }

        const car = await Car.findById(carId);
        if (!car) {
            return NextResponse.json({ error: "Car not found" }, { status: 404 });
        }

        const days = Math.ceil(
            (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)
        );
        const totalPrice = days * car.pricePerDay;

        await CarBooking.create({
            userId: session.user._id,
            carId,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            totalPrice
        });

        return NextResponse.json({ message: "Car booking created successfully" }, { status: 201 });
    } catch (error) {
        console.log("Error Creating Car Booking:", error);
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

        const bookings = await CarBooking.find({ userId: session.user._id })
            .populate("carId", "brand model pricePerDay image");

        return NextResponse.json({ bookings }, { status: 200 });
    } catch (error) {
        console.log("Error Fetching Car Bookings:", error);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}
