import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/libs/db";
import { OTP } from "@/model/otp";
import { Users } from "@/model/user";
import { generateOTP, sendOTPEmail } from "@/libs/email";

export async function POST(req: NextRequest) {
    await connectDB();

    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json(
                { error: "Email is required" },
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUser = await Users.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return NextResponse.json(
                { error: "User with this email already exists" },
                { status: 409 }
            );
        }

        // Check if there's a recent OTP request (prevent spam)
        const recentOTP = await OTP.findOne({
            email: email.toLowerCase(),
            createdAt: { $gte: new Date(Date.now() - 60000) }, // 1 minute ago
            isUsed: false
        });

        if (recentOTP) {
            return NextResponse.json(
                { error: "Please wait before requesting another OTP" },
                { status: 429 }
            );
        }

        // Generate new OTP
        const otpCode = generateOTP();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

        // Save OTP to database
        await OTP.create({
            email: email.toLowerCase(),
            otp: otpCode,
            expiresAt,
            isUsed: false
        });

        // Send OTP email
        const emailSent = await sendOTPEmail(email, otpCode);

        if (!emailSent) {
            return NextResponse.json(
                { error: "Failed to send OTP email" },
                { status: 500 }
            );
        }

        return NextResponse.json(
            {
                message: "OTP sent successfully",
                expiresIn: 600 // 10 minutes in seconds
            },
            { status: 200 }
        );

    } catch (error) {
        console.error("Error sending OTP:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
