import { connectDB } from "@/libs/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/options";
import { Car } from "@/model/fight";
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
        const brand = formData.get("brand") as string;
        const model = formData.get("model") as string;
        const pricePerDay = parseFloat(formData.get("pricePerDay") as string);
        const avatar = formData.get("image") as File | null;

        if (!brand || !model || !pricePerDay || !avatar) {
            return NextResponse.json({ error: "All fields required" }, { status: 400 });
        }

        const bytes = await avatar.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uploadResult = await new Promise<any>((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                { folder: "cars" },
                (error: any, result: any) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            ).end(buffer);
        });

        await Car.create({
            brand,
            model,
            pricePerDay,
            image: uploadResult.secure_url
        });

        return NextResponse.json({ message: "Car successfully created" }, { status: 201 });
    } catch (error) {
        console.log("Error Creating Car:", error);
        return NextResponse.json({ error: "internal error" }, { status: 500 });
    }
}

export async function GET() {
    try {
        await connectDB();
        const cars = await Car.find().select("brand model pricePerDay image");
        return NextResponse.json({ cars }, { status: 200 });
    } catch (error) {
        console.log("Error Fetching Cars:", error);
        return NextResponse.json({ error: "internal error" }, { status: 500 });
    }
}
