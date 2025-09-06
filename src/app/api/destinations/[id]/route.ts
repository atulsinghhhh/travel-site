
import { getServerSession } from "next-auth";
import { connectDB } from "@/libs/db";
import { authOptions } from "@/libs/options";
import { Destination } from "@/model/destination";
import { NextRequest, NextResponse } from "next/server";
import { User } from "next-auth";
import { cloudinary } from "@/libs/cloudinary";


export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Not authorized" }, { status: 401 })
        }

        await connectDB();

        if (session.user.role !== "admin") {
            return NextResponse.json({ error: "Only admin can update destinations" }, { status: 403 });
        }

        const formData = await req.formData();

        const name = formData.get("name") as string;
        const country = formData.get("country") as string;
        const category = formData.get("category") as string;
        const description = formData.get("description") as string;
        const image = formData.get("image");

        const updateData: any = {
            name,
            country,
            category,
            description,
        };
        if (image && (image as File).size > 0) {
            const imageFile = image as File;
            const bytes = await imageFile.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const uploadedImage = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream({ folder: "destinations" },
                    (error, result) => {
                        if (error) reject(error);
                        resolve(result);
                    }
                ).end(buffer);
            });
            const { secure_url } = uploadedImage as any;
            updateData.image = secure_url;
        }

        const { id } = await params;
        const updatedDestination = await Destination.findByIdAndUpdate(
            id,
            { ...updateData },
            { new: true }
        );

        if (!updatedDestination) {
            return NextResponse.json({ error: "failed to updated destination" }, { status: 401 })
        }

        return NextResponse.json({ message: "User successfully updated thier destination", updatedDestination }, { status: 200 });
    } catch (error) {
        console.log("Error: ", error);
        return NextResponse.json({ error: "failed updated thier destination section " }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        console.log("Session: ", session);

        const user: User = session?.user as User;
        console.log("User: ", user);

        if (!session || !session.user) {
            return NextResponse.json({ error: "Not authorized" }, { status: 401 })
        }

        if (user.role !== "admin") {
            return NextResponse.json({ error: "Only admin can update destinations" }, { status: 403 });
        }

        await connectDB();

        const { id } = await params;
        const deletedDestination = await Destination.findByIdAndDelete(id);
        if (deletedDestination) {
            return NextResponse.json({ error: "failed to delete destination" }, { status: 401 })
        }

        return NextResponse.json({ message: "User successfully delete destination" }, { status: 200 });

    } catch (error) {
        console.log("Error: ", error);
        return NextResponse.json({ error: "failed deleted thier destination section " }, { status: 500 });
    }
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const { id } = await params;

        const destination = await Destination.findById(id);

        return NextResponse.json({ message: "Fetch single destination by id", destination }, { status: 200 });
    } catch (error) {
        console.log("Error: ", error);
        return NextResponse.json({ error: "failed to fetch single destination by id" }, { status: 500 });
    }
} 