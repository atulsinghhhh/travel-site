import { connectDB } from "@/libs/db";
import { NextResponse,NextRequest } from "next/server";
import { Users } from "@/model/user";
import { cloudinary } from "@/libs/cloudinary"
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/options";
import { User } from "next-auth";

export async function GET(req: NextRequest,{params}: {params: {id:string}}){
    try {
        await connectDB();

        const session=await getServerSession(authOptions);
        console.log("Session: ",session?.user);

        const user: User=session?.user as User
        console.log("User: ",user);

        if(!session || !session.user){
            return NextResponse.json({error: "Not authorized"},{status:401})
        }

        const { id } = params;
        const userId=await Users.findById(id)
            .populate("community", "fullName username avatar")
            .populate("savedTrips")
            .populate("wishlist")
            .populate("reviews");

        if(!userId){
            return NextResponse.json({error: "User not found"},{status:404})
        }

        return NextResponse.json({message: "user fetch successfully",userId},{status:200})
    } catch (error) {
        console.log("Error: ",error);
        return NextResponse.json({error: "Server issue"},{status:500})
    }
}


// export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
//     try {
//         await connectDB();
//         const { id } = params;

//         const formData = await req.formData();
//         const bio = formData.get("bio") as string | null;
//         const travelBudget = formData.get("travelBudget")
//         ? JSON.parse(formData.get("travelBudget") as string)
//         : null;

//         let avatarUrl: string | undefined;

//         const avatarFile = formData.get("avatar") as File | null;
//         if (avatarFile) {
//             const arrayBuffer = await avatarFile.arrayBuffer();
//             const buffer = Buffer.from(arrayBuffer);

//             const uploadResult = await new Promise((resolve, reject) => {
//                 cloudinary.uploader
//                 .upload_stream({ folder: "avatars" }, (error, result) => {
//                     if (error) reject(error);
//                     else resolve(result);
//                 })
//                 .end(buffer);
//             });

//             avatarUrl = (uploadResult as any).secure_url;
//         }

//         // Update user document
//         const updatedUser = await Users.findByIdAndUpdate(
//             id,
//             {
//                 ...(bio && { bio }),
//                 ...(travelBudget && {
//                 "travelBudget.total": travelBudget.total,
//                 "travelBudget.spent": travelBudget.spent,
//                 }),
//                 ...(avatarUrl && { avatar: avatarUrl }),
//             },
//             { new: true }
//         );

//         if (!updatedUser) {
//             return NextResponse.json({ error: "User not found" }, { status: 404 });
//         }

//         return NextResponse.json({ updatedUser }, { status: 200 });
//     } catch (error) {
//         console.error("Error updating user:", error);
//         return NextResponse.json({ error: "Server issue" }, { status: 500 });
//     }
// }

// import { NextRequest, NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route"; 
// import { connectDB } from "@/libs/db";
// import { Users } from "@/model/user";



import { getToken } from "next-auth/jwt";


export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    console.log("JWT token:", token);
    console.log("All cookies in request:", req.cookies.getAll());


    if (!token || !token._id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    if (token._id !== id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await connectDB();
    const body = await req.json();

    const bio = body.bio ?? null;
    const travelBudget = body.travelBudget ?? null;

    const updatedUser = await Users.findByIdAndUpdate(
      id,
      {
        ...(bio && { bio }),
        ...(travelBudget && {
          "travelBudget.total": travelBudget.total,
          "travelBudget.spent": travelBudget.spent,
        }),
      },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ updatedUser }, { status: 200 });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ error: "Server issue" }, { status: 500 });
  }
}



