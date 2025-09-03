"use client";

import React from "react";
import Sidebar from "@/components/community/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PostCard from "@/components/community/PostCard";
import RigSide from "@/components/community/RigSide";

function Page() {
    return (
        <div className="flex h-screen text-white overflow-hidden">
        {/* Sidebar */}
        <div className="w-1/5 border-r border-gray-800 h-full">
            <Sidebar />
        </div>

        {/* Main Feed */}
        <div className="w-3/5 border-r border-gray-800 flex flex-col h-full">
            {/* Tabs header (fixed at top of feed) */}
            <div className="p-4 border-b border-gray-800">
            <Tabs defaultValue="recent">
                <TabsList className="grid w-full grid-cols-3 rounded-xl">
                <TabsTrigger value="recent">Recent</TabsTrigger>
                <TabsTrigger value="following">Following</TabsTrigger>
                <TabsTrigger value="popular">Popular</TabsTrigger>
                </TabsList>
            </Tabs>
            </div>

            {/* Scrollable feed content */}
            <div className="flex-1 overflow-y-auto p-4">
            <Tabs defaultValue="recent">
                <TabsContent value="recent">
                    <PostCard filter="recent" />
                </TabsContent>
                <TabsContent value="following">
                    <PostCard filter="following" />
                </TabsContent>
                <TabsContent value="popular">
                    <PostCard filter="popular" />
                </TabsContent>
            </Tabs>
            </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-1/5 border-l border-gray-800 ">
            <RigSide />
        </div>
        </div>
    );
}

export default Page;
