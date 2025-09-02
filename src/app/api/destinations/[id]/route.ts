
import { getServerSession } from "next-auth";
import { connectDB } from "@/libs/db";
import { authOptions } from "@/libs/options";
import { Destination } from "@/model/destination";
import { NextRequest,NextResponse } from "next/server";
import { User } from "next-auth";
import { Users } from "@/model/user";
import { cloudinary } from "@/libs/cloudinary";


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