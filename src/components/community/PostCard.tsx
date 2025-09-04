"use client";

import React, { useEffect, useState } from "react";
import { BackgroundGradient } from "../ui/background-gradient";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { Card } from "../ui/card";
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
        <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Community Posts</h2>
        <div className="flex flex-col space-y-6">
            {posts.map((post) => (
            <Card
                key={post._id}
                className="overflow-hidden shadow-card hover:shadow-warm transition-shadow"
            >
                <div className="p-6 pb-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
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
                </div>

                {/* Content */}
                <div className="mt-4">
                    {post.name && (
                    <h3 className="text-lg font-semibold mb-2">{post.name}</h3>
                    )}
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    {post.content}
                    </p>
                </div>

                {/* Image */}
                {post.image && (
                    <div className="aspect-video overflow-hidden rounded-lg">
                    <img
                        src={post.image}
                        alt={post.name || "Post image"}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                    </div>
                )}
                </div>
            </Card>
            ))}
        </div>
        </div>

    );
}

export default PostCard;
