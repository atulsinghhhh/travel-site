import { connectDB } from "@/libs/db";
import { NextResponse, NextRequest } from "next/server";
import { Users } from "@/model/user";
import { cloudinary } from "@/libs/cloudinary"
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/options";
import { User } from "next-auth";


export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const { id } = await params;

        const formData = await req.formData();
        const bio = formData.get("bio") as string | null;
        const joinedAt = formData.get("joinedAt") as string | null;
        const travelBudget = formData.get("travelBudget")
            ? JSON.parse(formData.get("travelBudget") as string)
            : null;

        let avatarUrl: string | undefined;

        const avatarFile = formData.get("avatar") as File | null;
        if (avatarFile) {
            const arrayBuffer = await avatarFile.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            const uploadResult = await new Promise((resolve, reject) => {
                cloudinary.uploader
                    .upload_stream({ folder: "Users" }, (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    })
                    .end(buffer);
            });

            avatarUrl = (uploadResult as any).secure_url;
        }

        // Update user document
        const updatedUser = await Users.findByIdAndUpdate(
            id,
            {
                ...(bio && { bio }),
                ...(joinedAt && { joinedAt: new Date(joinedAt) }),
                ...(travelBudget && {
                    "travelBudget.total": travelBudget.total,
                    "travelBudget.spent": travelBudget.spent,
                }),
                ...(avatarUrl && { avatar: avatarUrl }),
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









