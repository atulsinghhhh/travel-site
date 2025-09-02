"use client"

import React from 'react'
import Sidebar from '@/components/community/sidebar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import PostCard from '@/components/community/PostCard'
import RigSide from "@/components/community/RigSide"


function page() {
    return (
        <>
        <div className="flex h-screen w-full bg-black text-white">
            <div className='w-1/5 border-r border-gray-800'>
                <Sidebar/>
            </div>

            <div className="w-3/5 border-r border-gray-800 p-4">
            <Tabs defaultValue='recent'>
                <TabsList className="grid w-full grid-cols-3 bg-gray-900 rounded-xl">
                    <TabsTrigger value="recent">Recent</TabsTrigger>
                    <TabsTrigger value="following">Following</TabsTrigger>
                    <TabsTrigger value="popular">Popular</TabsTrigger>
                </TabsList>
                <TabsContent value='recent' className='p-4'>
                    <PostCard/>
                </TabsContent>
                <TabsContent value='following' className='p-4'>
                    <PostCard/>
                </TabsContent>
                <TabsContent value='popular' className='p-4'>
                    <PostCard/>
                </TabsContent>
            </Tabs>
            </div>
            <div>
                <RigSide/>
            </div>
        </div>
        </>
    )
}

export default page
