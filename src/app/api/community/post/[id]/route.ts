import { connectDB } from "@/libs/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/options";
import { NextRequest, NextResponse } from "next/server";
import { Community } from "@/model/community";


export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Not authorized" }, { status: 401 })
        }

        await connectDB();

        const user = session.user;
        const { id } = await params;

        const post = await Community.findById({
            _id: id,
            userId: user._id
        });
        if (!post) {
            return NextResponse.json({ error: "failed to fetch the single post" }, { status: 401 });
        }
        return NextResponse.json({ post }, { status: 200 })
    } catch (error) {
        console.error("Error fetching posts:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Not authorized" }, { status: 401 })
        }

        await connectDB();

        const { id } = await params;

        const deletePost = await Community.findByIdAndDelete(id);
        if (!deletePost) {
            return NextResponse.json({ error: "failed to delete the single post" }, { status: 401 });
        }
        return NextResponse.json({ message: "Successully deleted" }, { status: 200 })
    } catch (error) {
        console.error("Error fetching posts:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Not authorized" }, { status: 401 })
        }

        await connectDB();
        const body = await req.json();
        const { content, hashtags } = body

        const { id } = await params;
        const post = await Community.findById(id);
        if (!post) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }

        if (post.userId.toString() !== session.user._id) {
            return NextResponse.json({ error: "Not authorized to update this post" }, { status: 403 });
        }

        if (content !== undefined) post.content = content;
        if (hashtags !== undefined) post.hashtags = hashtags;

        await post.save();

        return NextResponse.json({ message: "Post updated successfully", post }, { status: 200 });

    } catch (error) {
        console.error("Error fetching posts:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}