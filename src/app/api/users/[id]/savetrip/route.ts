import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await req.json();

        return NextResponse.json({ message: "Trip saved successfully", userId: id, tripData: body }, { status: 200 });
    } catch (error) {
        console.error("Error saving trip:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
