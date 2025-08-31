import { getServerSession } from "next-auth";
import { User } from "next-auth";
import { authOptions } from "@/libs/options";
import { Users } from "@/model/user";
import { NextRequest,NextResponse } from "next/server";
import { connectDB } from "@/libs/db";

export async function POST(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Not authorized" }, { status: 401 });
        }

        const userId = params.id;
        const { destinationId } = await req.json();

        if (!destinationId) {
            return NextResponse.json(
                { error: "Destination ID is required" },
                { status: 400 }
            );
        }

        await connectDB();

        const user = await Users.findById(userId);
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        if (user.wishlist.includes(destinationId)) {
            user.wishlist.pull(destinationId); //rremove
        } else {
            user.wishlist.push(destinationId); //add
        }

        await user.save();
        return NextResponse.json(
            { message: "Wishlist updated", wishlist: user.wishlist },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating wishlist:", error);
        return NextResponse.json(
            { error: "Server error while updating wishlist" },
            { status: 500 }
        );
    }
}