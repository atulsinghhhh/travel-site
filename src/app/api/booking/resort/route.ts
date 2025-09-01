import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/options";
import { NextRequest,NextResponse } from "next/server";
import { connectDB } from "@/libs/db";
import { ResortBooking } from "@/model/booking";
import { Resort } from "@/model/resort";

export async function POST(req:NextRequest){
    try {
        const session=await getServerSession(authOptions);
        if(!session || !session.user){
            return NextResponse.json( {error: "Not authorized" }, { status: 401 })
        }

        await connectDB();

        const {resortId,checkIn,checkout}=await req.json();
        if(!resortId || !checkIn || !checkout){
            return NextResponse.json({error: "all fields are required"},{status:400});
        }
        console.log({ resortId, checkIn, checkout });


        const resort=await Resort.findById(resortId);
        if(!resort){
            return NextResponse.json({ error: "Resort not found" }, { status: 404 });
        }

        const nights = Math.ceil(
        (new Date(checkout).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)
        );
        const totalPrice=nights*resort.pricePerNight

        const booking=await ResortBooking.create({
            userId: session.user._id,
            resortId,
            checkIn: new Date(checkIn),
            checkout: new Date(checkout),
            totalPrice
        })

        

        return NextResponse.json({message: "Booking created successfully",booking},{status:201})
    } catch (error) {
        console.log("Error Ocurring Create: ",error);
        return NextResponse.json({error: "interal error"},{status: 500});
    }
}

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Not authorized" }, { status: 401 });
        }

        await connectDB();

        const bookings = await ResortBooking.find({ userId: session.user._id })
            .populate("resortId", "name location image pricePerNight");

        return NextResponse.json({ bookings }, { status: 200 });
    } catch (error) {
        console.log("Error Fetching Bookings:", error);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}