import { connectDB } from "@/libs/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/options";
import { Resort } from "@/model/resort";
import { NextResponse,NextRequest } from "next/server";
import { Users } from "@/model/user";
import { cloudinary } from "@/libs/cloudinary";

export async function POST(req:NextRequest){
    try {
        const session=await getServerSession(authOptions);
        if(!session || !session.user){
            return NextResponse.json( {error: "Not authorized" }, { status: 401 })
        }
        await connectDB();

        const admin=await Users.findById(session.user._id);
        if(admin.role!=="admin"){
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const formData = await req.formData();
        const name = formData.get("name") as string;
        const location = formData.get("location") as string;
        const pricePerNight = parseFloat(formData.get("pricePerNight") as string);
        const avatar = formData.get("image") as File | null;

        if (!name || !location || !pricePerNight || !avatar) {
            return NextResponse.json({ error: "All fields required" }, { status: 400 });
        }

        const bytes=await avatar.arrayBuffer();
        const buffer=Buffer.from(bytes);

        const uploadResult=await new Promise<any>((resolve: (value: any) => void, reject: (reason?: any) => void) => {
            cloudinary.uploader.upload_stream({ folder: "resorts" },(error: any, result: any) => {
                if (error) reject(error);
                else resolve(result);
            }).end(buffer);
        });

        await Resort.create({
            name,
            location,
            pricePerNight,
            image: uploadResult.secure_url
        })
        return NextResponse.json({message: "successfully created"},{status:201});
    } catch (error) {
        console.log("Error Ocurring Create: ",error);
        return NextResponse.json({error: "interal error"},{status: 500});
    }
}


