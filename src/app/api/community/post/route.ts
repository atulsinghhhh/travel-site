import { connectDB } from "@/libs/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/options";
import { NextRequest,NextResponse } from "next/server";
import { Community } from "@/model/community";
import { cloudinary } from "@/libs/cloudinary";
import { Users } from "@/model/user";

export async function POST(req: NextRequest){
    try {
        const session=await getServerSession(authOptions);
        if(!session || !session.user){
            return NextResponse.json( {error: "Not authorized" }, { status: 401 })
        }

        await connectDB();
        const formData=await req.formData();
        const content=formData.get("content")?.toString();
        const hashtags=formData.get("hashtags")?.toString();
        const name=formData.get("name")?.toString();
        const avatar=formData.get("image") as File | null

        // console.log("Content:", content);
        // console.log("Hashtags:", hashtags);
        // console.log("Image:", avatar);

        if(!content){
            return NextResponse.json({error: "content field required"},{status:400});
        }

        let avatarUrl=null;

        let bytes: ArrayBuffer | undefined;
        if (avatar) {
            bytes = await avatar.arrayBuffer();
            const buffer=Buffer.from(bytes);

            const uploadResult=await new Promise<any>((resolve: (value: any) => void, reject: (reason?: any) => void) => {
                cloudinary.uploader.upload_stream({ folder: "posts" },(error: any, result: any) => {
                    if (error) reject(error);
                    else resolve(result);
                }).end(buffer);
            });
            avatarUrl=uploadResult;
        }

        const newPost=await Community.create({
            userId: session.user._id,
            content,
            name,
            hashtags: hashtags ? hashtags.split(",").map((tag) => tag.trim()) : [],
            image: avatarUrl ? avatarUrl.secure_url : null,
            createdBy: session.user._id
        })

        // console.log("NewPost: ",newPost);

        return NextResponse.json({message: "Succesfully created",newPost},{status:200});
    } catch (error) {
        console.log("Error: ",error);
        return NextResponse.json({error: "failed to created post"},{status:500});
    }
}

export async function GET(req:NextRequest){
    try {
        const session=await getServerSession(authOptions);
        if(!session || !session.user){
            return NextResponse.json( {error: "Not authorized" }, { status: 401 })
        }

        await connectDB();
        const {searchParams}=new URL(req.url);
        const filter = searchParams.get("filter") || "recent"; 

        let query: any = {};
        let posts;

        if(filter === "recent"){
            posts=await Community.find(query)
                .sort({createdAt:-1})
                .populate("userId", "username image")
                .lean()
        }
        else if(filter === "popular"){
            posts=await Community.find(query)
                .sort({"hashtags.length": -1,createdAt:-1})
                .populate("userId", "username image")
                .lean()
        }
        else if(filter === "following"){
            const user=await Users.findOne({email: session.user.email});
            if (!user) {
                return NextResponse.json({ error: "User not found" }, { status: 404 });
            }

            posts=await Community.find({
                ...query,
                userId: {$in: user.following}
            })
            .sort({"hashtags.length": -1,createdAt:-1})
            .populate("userId", "username image")
            .lean()
        }

        return NextResponse.json({posts}, { status: 200 });
    } catch (error) {
        console.error("Error fetching posts:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}