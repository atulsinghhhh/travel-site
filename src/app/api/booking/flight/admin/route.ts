import { connectDB } from "@/libs/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/options";
import { Flight } from "@/model/fight";
import { NextResponse, NextRequest } from "next/server";
import { Users } from "@/model/user";
import { cloudinary } from "@/libs/cloudinary";

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Not authorized" }, { status: 401 });
        }

        await connectDB();

        const admin = await Users.findById(session.user._id);
        if (admin.role !== "admin") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const formData = await req.formData();
        const airline = formData.get("airline") as string;
        const from = formData.get("from") as string;
        const to = formData.get("to") as string;
        const departure = formData.get("departure") as string;
        const arrival = formData.get("arrival") as string;
        const price = parseFloat(formData.get("price") as string);
        const avatar = formData.get("image") as File | null;

        if (!airline || !from || !to || !departure || !arrival || !price || !avatar) {
            return NextResponse.json({ error: "All fields required" }, { status: 400 });
        }

        const bytes = await avatar.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uploadResult = await new Promise<any>((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                { folder: "flights" },
                (error: any, result: any) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            ).end(buffer);
        });

        await Flight.create({
            airline,
            from,
            to,
            departure: new Date(departure),
            arrival: new Date(arrival),
            price,
            image: uploadResult.secure_url
        });

        return NextResponse.json({ message: "Flight successfully created" }, { status: 201 });
    } catch (error) {
        console.log("Error Creating Flight:", error);
        return NextResponse.json({ error: "internal error" }, { status: 500 });
    }
}

export async function GET() {
    try {
        await connectDB();
        const flights = await Flight.find().select("airline from to departure arrival price image");
        return NextResponse.json({ flights }, { status: 200 });
    } catch (error) {
        console.log("Error Fetching Flights:", error);
        return NextResponse.json({ error: "internal error" }, { status: 500 });
    }
}
