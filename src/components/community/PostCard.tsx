"use client"

import React, { useEffect, useState } from 'react'
import { BackgroundGradient } from "../ui/background-gradient";
import { useSession } from 'next-auth/react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

type Post = {
    _id: string
    image: string
    name: string
    content: string
    hashtags: string
    createdBy: {
        username: string
        fullname: string
        image: string
    }
}


function PostCard() {
    const [posts,setPosts]=useState<Post[]>([]);
    const {data: session}=useSession();

    useEffect(()=>{
        const fetchPost=async()=>{
            try {
                const response=await fetch("/api/community/post",{method: "GET"});
                const data=await response.json();

                if(response.ok){
                    setPosts(data.posts || []);
                }
                else {
                    throw new Error("failed to fetch the post");
                }
            } catch (error) {
                console.log("Error occuring : ",error);
            }
        }
        fetchPost();
    },[])
    return (
        <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6">
            {posts.map((post) => (
                <BackgroundGradient
                    key={post._id}
                    className="rounded-[22px] p-5 bg-white dark:bg-zinc-900 shadow-sm hover:shadow-md transition"
                >
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
                            @{post.createdBy?.username || session?.user.username || "user"}
                        </p>
                        <p className="text-xs text-gray-500">
                            {session?.user.fullname}
                        </p>
                    </div>
                </div>

                {/* Post Image */}
                {post.image && (
                    <img
                    src={post.image}
                    alt={post.content.slice(0, 30)}
                    className="w-full h-56 object-cover rounded-xl"
                    />
                )}

                <p className='text-2xl text-gray-800 mt-3 dark:text-neutral-200'>
                    {post.name}
                </p>

                {/* Post Content */}
                <p className="text-base sm:text-lg text-gray-800 mt-3 dark:text-neutral-200">
                    {post.content}
                </p>
                </BackgroundGradient>
            ))}
        </div>
    )
}

export default PostCard
