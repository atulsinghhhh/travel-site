"use client";

import { useSession } from 'next-auth/react';
import React from 'react'
import {Home,Search,Briefcase,User, MessageSquarePlus} from "lucide-react"
import Link from "next/link"

function Sliderbar() {
    const {data: session}=useSession();
    return (
        <div className='h-screen w-64 bg-white border-r flex flex-col justify-between'>
            <div>
                {/* user section */}
                <div className='flex items-center gap-3 p-4'>
                    <div className='w-10 h-10 rounded-full overflow-hidden'>
                        <img
                            src={session?.user.image ?? undefined}
                            alt='user avatar'
                            className='w-full h-full object-cover'
                        />
                    </div>
                    <div>
                        <h2 className='text-sm font-semibold'>{session?.user.fullname}</h2>
                        <Link href={"/profile"} className='text-xs text-blue-500 hover:underline'>
                            View Profile
                        </Link>
                    </div>
                </div>
                <nav className='mt-4 flex flex-col gap-1'>
                    <Link href={"/"} className='flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded-md'>
                        <Home size={18}/>
                        <span>Home</span>
                    </Link>
                    <Link href="/explore" className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded-md">
                        <Search size={18} />
                        <span>Explore</span>
                    </Link>

                    <Link href="/trips" className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded-md">
                        <Briefcase size={18} />
                        <span>Trips</span>
                    </Link>

                    <Link href="/profile" className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded-md">
                        <User size={18} />
                        <span>Profile</span>
                    </Link>
                </nav>
            </div>
            <div className='mb-4'>
                <Link href={"/feedback"} className='flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded-md'>
                <MessageSquarePlus size={18} />
                <span>Feedback</span>
                </Link>
            </div>
        
        </div>
    )
}

export default Sliderbar
