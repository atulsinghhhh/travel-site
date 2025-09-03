"use client";

import React, { useEffect, useState } from "react";
import { BackgroundGradient } from "../ui/background-gradient";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
type Post = {
    _id: string;
    image: string;
    name: string;
    content: string;
    hashtags: string;
    createdBy: {
        username: string;
        fullname: string;
        image: string;
    };
};

function PostCard({ filter }: { filter: string }) {
    const [posts, setPosts] = useState<Post[]>([]);
    const { data: session } = useSession();

    useEffect(() => {
        const fetchPost = async () => {
        try {
            const response = await fetch(`/api/community/post?filter=${filter}`);
            const data = await response.json();
            if (response.ok) {
            setPosts(data.posts || []);
            } else {
            throw new Error("Failed to fetch posts");
            }
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
        };
        fetchPost();
    }, [filter]);

    return (
    <div className="grid sm:grid-cols-1 lg:grid-cols-1 ">
        {posts.map((post) => (
            <CardContainer key={post._id} className="inter-var">
            <CardBody className="bg-white dark:bg-zinc-900 rounded-[22px] p-5 shadow-sm hover:shadow-md transition border border-black/[0.1] dark:border-white/[0.2]">
                
                {/* Post Author */}
                <div className="flex items-center gap-3 mb-3">
                <Avatar className="w-10 h-10">
                    <AvatarImage src={post.createdBy?.image} />
                    <AvatarFallback>
                    {post.createdBy?.username?.[0]?.toUpperCase() || "U"}
                    </AvatarFallback>
                </Avatar>
                <div>
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                    @{post.createdBy?.username || session?.user?.username || "user"}
                    </p>
                    <p className="text-xs text-gray-500">
                    {session?.user?.fullname || post.createdBy?.fullname}
                    </p>
                </div>
                </div>

                {/* Post Image */}
                {post.image && (
                <CardItem translateZ="80">
                    <img
                    src={post.image}
                    alt={post.content.slice(0, 30)}
                    className="w-full h-56 object-cover rounded-xl group-hover/card:shadow-xl"
                    />
                </CardItem>
                )}

                {/* Post Name */}
                {post.name && (
                <CardItem translateZ="50">
                    <p className="text-2xl text-gray-800 mt-3 dark:text-neutral-200">
                    {post.name}
                    </p>
                </CardItem>
                )}

                {/* Post Content */}
                <CardItem translateZ="30">
                <p className="text-base sm:text-lg text-gray-800 mt-3 dark:text-neutral-200">
                    {post.content}
                </p>
                </CardItem>
            </CardBody>
            </CardContainer>
        ))}
        </div>
    );
}

export default PostCard;
