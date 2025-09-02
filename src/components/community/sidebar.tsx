"use client";

import { BookOpen, Calendar, Globe, Lightbulb, WholeWord } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';

type Hashtag = {
    _id: string;
    count: string;
};

function Sidebar() {
    const [hashtags,setHashtags]=useState<Hashtag[]>([]);
    const router=useRouter();

    useEffect(()=>{
        const fetchHashtages=async()=>{
            try {
                const response=await fetch("/api/community/trending",{method: "GET"});
                const data=await response.json();

                console.log("Trending: ",data.trendingHashtags)

                if(response.ok){
                    setHashtags(data.trendingHashtags || []);
                }
                else {
                    throw new Error("failed to fetch the hashtags");
                }
            } catch (error) {
                console.log("Error occuring : ",error);
            }
        }

        fetchHashtages();
    },[])

    return (
    <div className="h-screen w-64 bg-white border-r border-gray-200 flex flex-col justify-between text-gray-900">
    <div>
        {/* Navigation */}
        <nav className="mt-6 flex flex-col gap-1">
        <Link
            href={"/destination"}
            className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded-md"
        >
            <Globe size={18} />
            <span className="text-base font-medium">Destinations</span>
        </Link>

        <Link
            href={"/trips"}
            className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded-md"
        >
            <Lightbulb size={18} />
            <span className="text-base font-medium">Tips & Tricks</span>
        </Link>

        <Link
            href={"/stories"}
            className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded-md"
        >
            <BookOpen size={18} />
            <span className="text-base font-medium">Travel Stories</span>
        </Link>

        <Link
            href={"/events"}
            className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded-md"
        >
            <Calendar size={18} />
            <span className="text-base font-medium">Events</span>
        </Link>
        </nav>

        {/* Trending Hashtags */}
        <CardContent className="p-4">
            <h3 className="text-sm font-semibold mb-3">Trending Hashtags</h3>
            <div className="flex flex-wrap gap-2">
            {hashtags?.map((tag) => (
                <span
                key={tag._id}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full cursor-pointer hover:bg-gray-200 transition"
                >
                {tag._id}
                </span>
            ))}
            </div>
        </CardContent>

        {/* Create New Post */}
        <div className="mt-10">
        <Button
            variant="outline"
            className="w-full bg-orange-500 text-white hover:bg-orange-600 border-none rounded-lg cursor-pointer"
            onClick={()=>router.push("/community/create")}
        >
            + Create New Post
        </Button>
        </div>
    </div>
    </div>


    )
}

export default Sidebar
