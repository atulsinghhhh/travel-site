import { NextRequest, NextResponse } from "next/server";
import { Community } from "@/model/community";
import { connectDB } from "@/libs/db";


export async function GET(req: NextRequest){
    try {
        await connectDB();

        const trendingHashtags = await Community.aggregate([
            {$unwind: "$hashtags"},
            {
                $group: {
                    _id: "$hashtags",
                    count: { $sum: 1 },
                }
            },
            { $sort: { count: -1 } },
            { $limit: 10 },
        ]);
        return NextResponse.json({trendingHashtags}, { status: 200 });
    } catch (error) {
        console.error("Error fetching trending hashtags:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}