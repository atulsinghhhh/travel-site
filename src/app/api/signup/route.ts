import { Users } from "@/model/user";
import { OTP } from "@/model/otp";
import { connectDB } from "@/libs/db";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    await connectDB();
    try {
        const body = await req.json();
        console.log(body);
        const { fullname, username, email, password, } = body;

        if (!fullname || !username || !email || !password) {
            return NextResponse.json({ error: "all fields are required" }, { status: 400 });
        }

        const existingUser = await Users.findOne({
            $or: [
                { email }, { username }
            ]
        });

        if (existingUser) {
            return NextResponse.json({ error: "Already present this user by email and username" }, { status: 409 })
        }

        // Check if email is verified
        const verifiedOTP = await OTP.findOne({
            email: email.toLowerCase(),
            isUsed: true
        });

        const userDetails = await Users.create({
            fullname,
            username,
            email,
            password,
            role: "user",
            isEmailVerified: !!verifiedOTP
        })
        return NextResponse.json({ message: "Successfully signup!!", userDetails }, { status: 201 })

    } catch (error) {
        console.log("Error: ", error);
        return NextResponse.json({ error: "failed to signup " }, { status: 500 });
    }
}