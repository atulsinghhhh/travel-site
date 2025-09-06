import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/libs/db";
import { OTP } from "@/model/otp";
import { Users } from "@/model/user";
import { sendWelcomeEmail } from "@/libs/email";

export async function POST(req: NextRequest) {
    await connectDB();

    try {
        const { email, otp } = await req.json();

        if (!email || !otp) {
            return NextResponse.json(
                { error: "Email and OTP are required" },
                { status: 400 }
            );
        }

        // Find the OTP record
        const otpRecord = await OTP.findOne({
            email: email.toLowerCase(),
            otp,
            isUsed: false,
            expiresAt: { $gt: new Date() }
        });

        if (!otpRecord) {
            return NextResponse.json(
                { error: "Invalid or expired OTP" },
                { status: 400 }
            );
        }

        // Mark OTP as used
        otpRecord.isUsed = true;
        await otpRecord.save();

        // Check if user exists and update verification status
        const user = await Users.findOne({ email: email.toLowerCase() });
        if (user) {
            user.isEmailVerified = true;
            await user.save();

            // Send welcome email
            await sendWelcomeEmail(email, user.fullname);

            return NextResponse.json(
                {
                    message: "Email verified successfully",
                    user: {
                        id: user._id,
                        email: user.email,
                        fullname: user.fullname,
                        isEmailVerified: user.isEmailVerified
                    }
                },
                { status: 200 }
            );
        }

        return NextResponse.json(
            {
                message: "OTP verified successfully. You can now complete your registration."
            },
            { status: 200 }
        );

    } catch (error) {
        console.error("Error verifying OTP:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
