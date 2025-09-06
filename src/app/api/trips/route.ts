import { Trip } from "@/model/trip";
import { connectDB } from "@/libs/db";
import { NextResponse,NextRequest } from "next/server";
import { getServerSession, User } from "next-auth";
import { authOptions } from "@/libs/options";
import { cloudinary } from "@/libs/cloudinary";
import mongoose from "mongoose";

export async function POST(req:NextRequest){
    try {
        const session=await getServerSession(authOptions);
        if(!session || !session.user){
            return NextResponse.json( {error: "Not authorized" }, { status: 401 })
        }

        await connectDB();
        const formData=await req.formData();
        const title=formData.get("title")?.toString();
        const startDate=formData.get("startDate")?.toString();
        const endDate=formData.get("endDate")?.toString();

        const avatar=formData.get("image") as File | null;
        if(!title || !avatar || !startDate || !endDate){
            return NextResponse.json({error: "all fields are required"},{status: 400});
        }

        // convert file to buffer;
        const bytes=await avatar.arrayBuffer();
        const buffer=Buffer.from(bytes);

        // upload to cloudinary
        const uploadResult=await new Promise<any>((resolve: (value: any) => void, reject: (reason?: any) => void) => {
            cloudinary.uploader.upload_stream({ folder: "trips" },(error: any, result: any) => {
                if (error) reject(error);
                else resolve(result);
            }).end(buffer);
        });

        const trip=await Trip.create({
            title,
            startDate:new Date(startDate),
            endDate:new Date(endDate),
            image: uploadResult.secure_url,
            userId: session.user._id
        });

        return NextResponse.json({message: "Successfully created trip",trip},{status:201})
    } catch (error) {
        console.log("Error: ",error);
        return NextResponse.json({error: "failed to created new trip"},{status:500});
    }
}   


export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Not authorized" }, { status: 401 });
        }

        const user = session.user;
        // console.log("user: ",user);

        await connectDB();

        const { searchParams } = new URL(req.url);
        const type = searchParams.get("type")?.toLowerCase().trim();
        const today = new Date();

        // Convert string user._id to ObjectId
        // const userId = user._id
        const userId = new mongoose.Types.ObjectId(user._id);

        let query: any = { userId };

        if (type === "upcoming") {
            query.startDate = { $gte: today };
            query.isCanceled = false;
        } else if (type === "past") {
            query.endDate = { $lt: today };
            query.isCanceled = false;
        } else if (type === "canceled") {
            query.isCanceled = true;
        } else {
            return NextResponse.json({ error: "Invalid type parameter" }, { status: 400 });
        }

        const trips = await Trip.find(query).sort({ startDate: -1 });

        // console.log("Query:", query);
        // console.log("Trips:", trips);

        return NextResponse.json({ trips }, { status: 200 });
    } catch (error) {
        console.log("Error: ", error);
        return NextResponse.json({ error: "Internal Server Error to fetch trips" }, { status: 500 });
    }
}
