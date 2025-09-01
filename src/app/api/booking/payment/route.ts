import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/options";
import { connectDB } from "@/libs/db";
import { Payment } from "@/model/payment";

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Not authorized" }, { status: 401 });
        }

        await connectDB();
        const { bookingType, bookingId, amount, method } = await req.json();

        if (!bookingType || !bookingId || !amount || !method) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        }

        const payment = await Payment.create({
            userId: session.user._id,
            bookingType,
            bookingId,
            amount,
            method,
            status: "pending"
        });

        // later integrate Razorpay/Stripe etc. Here just simulate success
        payment.status = "success";
        await payment.save();

        return NextResponse.json({ message: "Payment successful", payment }, { status: 201 });

    } catch (error) {
        console.log("Payment Error:", error);
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
        const payments = await Payment.find({ userId: session.user._id })
            .sort({ createdAt: -1 });

        return NextResponse.json({ payments }, { status: 200 });

    } catch (error) {
        console.log("Fetch Payments Error:", error);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}
