import { getServerSession } from "next-auth";
import { connectDB } from "@/libs/db";
import { authOptions } from "@/libs/options";
import { Destination } from "@/model/destination";
import { NextRequest,NextResponse } from "next/server";
import { User } from "next-auth";
import { Users } from "@/model/user";
import { cloudinary } from "@/libs/cloudinary";
import { resolve } from "path";

interface CloudinaryUploadResult {
    secure_url: string;
    url: string;
    public_id: string;
}

export async function POST(req: NextRequest) {
    try {
        const session=await getServerSession(authOptions);
        // console.log("Session: ",session);

        const user: User=session?.user as User;
        // console.log("User: ",user);

        if(!session || !session.user){
            return NextResponse.json( {error: "Not authorized" }, { status: 401 })
        }

        await connectDB();

        const admin=await Users.findById(user._id);
        if(admin.role!=="admin"){
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }
        
        const formData=await req.formData();
        const name=formData.get("name")?.toString()
        const country = formData.get("country")?.toString();
        const category = formData.get("category")?.toString();
        const description = formData.get("description")?.toString();
        const imageFile = formData.get("image") as File | null;

        console.log("imageFile: ",imageFile);

        if (!name || !country || !category || !description || !imageFile) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        }

        // Convert file to buffer
        const bytes= await imageFile.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // upload image to cloudinary

        const uploadedImage=await new Promise((resolve,reject)=>{
            cloudinary.uploader.upload_stream({folder: "destinations"},
                (error,result)=>{
                    if(error) reject(error)
                    resolve(result as CloudinaryUploadResult);
                }
            ).end(buffer)
        })

        console.log("Cloudinary upload result:", uploadedImage);

        const { secure_url } = uploadedImage as any;

        // console.log("Uploaded Image URL:", uploadedImage.secure_url);

        const newDestination=await Destination.create({
            name,
            country,
            category,
            description,
            image: secure_url,
            createdBy: admin._id
        })

        console.log("new Destination", newDestination);

        return NextResponse.json({ message: "Destination created", newDestination }, { status: 201 });
    } catch (error) {
        console.log("Error: ",error);
        return NextResponse.json({error: "failed to created the destination "},{status:500});
    }
}

export async function PUT(req:NextRequest,{params}: {params: {id: string}}){
    try {
        const session=await getServerSession(authOptions);
        console.log("Session: ",session);

        const user: User=session?.user as User;
        console.log("User: ",user);

        if(!session || !session.user){
            return NextResponse.json( {error: "Not authorized" }, { status: 401 })
        }

        await connectDB();

        if(user.role!=="admin"){
            return NextResponse.json({ error: "Only admin can update destinations" }, { status: 403 });
        }

        const body=await req.json();

        const updatedDestination=await Destination.findByIdAndUpdate(
            params.id,
            { ...body },
            { new: true }
        );

        if(!updatedDestination){
            return NextResponse.json({error: "failed to updated destination"},{status:401})
        }

        return NextResponse.json({message: "User successfully updated thier destination",updatedDestination},{status:200});
    } catch (error) {
        console.log("Error: ",error);
        return NextResponse.json({error: "failed updated thier destination section "},{status:500});
    }
}

export async function DELETE({params}: {params: {id:string}}){
    try {
        const session=await getServerSession(authOptions);
        console.log("Session: ",session);

        const user: User=session?.user as User;
        console.log("User: ",user);

        if(!session || !session.user){
            return NextResponse.json( {error: "Not authorized" }, { status: 401 })
        }

        if(user.role!=="admin"){
            return NextResponse.json({ error: "Only admin can update destinations" }, { status: 403 });
        }

        await connectDB();

        const deletedDestination=await Destination.findByIdAndDelete(params.id);
        if(deletedDestination){
            return NextResponse.json({error: "failed to delete destination"},{status:401})
        }

        return NextResponse.json({message: "User successfully delete destination"},{status:200});

    } catch (error) {
        console.log("Error: ",error);
        return NextResponse.json({error: "failed deleted thier destination section "},{status:500});
    }
}

export async function GET(){
    try {
        await connectDB();
        
        const destinations=await Destination.find();
        if(!destinations){
            return NextResponse.json({error: "failed to fetch destination"},{status:401});
        }

        return NextResponse.json({ destinations }, { status: 200 });
    } catch (error) {
        console.log("Error: ",error);
        return NextResponse.json({error: "failed fetch thier destination section "},{status:500});
    }
}

