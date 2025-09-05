"use client";

import React from "react";
import Sidebar from "@/components/community/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PostCard from "@/components/community/PostCard";
import RigSide from "@/components/community/RigSide";

function Page() {
    return (
        <div className="flex h-screen text-white">
        {/* Sidebar (left) */}
        <div className="w-[15%] border-r border-gray-800 h-full overflow-y-auto">
            <Sidebar />
        </div>

        {/* Main Feed (center) */}
        <div className="flex-1 border-r border-gray-800 flex flex-col h-full">
            <Tabs defaultValue="recent" className="flex flex-col h-full">
                
            <div className="p-4 border-b border-gray-800  sticky top-0 z-10 backdrop-blur">
                <TabsList className="grid w-full grid-cols-3 rounded-xl">
                <TabsTrigger value="recent">Recent</TabsTrigger>
                <TabsTrigger value="following">Following</TabsTrigger>
                <TabsTrigger value="popular">Popular</TabsTrigger>
                </TabsList>
            </div>

            {/* Scrollable feed content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <TabsContent value="recent" className="space-y-4">
                    <PostCard filter="recent" />
                </TabsContent>
                <TabsContent value="following" className="space-y-4">
                    <PostCard filter="following" />
                </TabsContent>
                <TabsContent value="popular" className="space-y-4">
                    <PostCard filter="popular" />
                </TabsContent>
            </div>
            </Tabs>
        </div>

        <div className="w-[25%] border-l border-gray-800 h-full overflow-y-auto">
            <RigSide />
        </div>
        </div>
    );
}

export default Page;
