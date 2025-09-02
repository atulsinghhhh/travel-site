"use client"

import React, { useEffect, useState } from 'react'
import { BackgroundGradient } from "../ui/background-gradient";
import { useSession } from 'next-auth/react';

type Post = {
    _id: string
    image: string
    content: string
}


function feed() {
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
        <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            {posts.map((post)=>(
                <BackgroundGradient
                    key={post._id}
                    className="rounded-[22px] p-4 sm:p-6 bg-white dark:bg-zinc-900"
                >
                    <img
                        src={post.image}
                        alt={post.content.slice(0, 30)}
                        height="400"
                        width="400"
                        className="object-cover rounded-xl"
                    />
                    <p className='text-sm text-netural-500 dark:text-neutral-400 mt-2'>
                        Posted by <span className="font-semibold">{session?.user.username}</span>
                    </p>

                    <p className="text-base sm:text-lg text-black mt-2 dark:text-neutral-200">
                        {post.content}
                    </p>

                </BackgroundGradient>
            ))}
        
        </div>
    )
}

export default feed
