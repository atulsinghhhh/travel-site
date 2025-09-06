"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Navbar() {
    const { data: session } = useSession();

    return (
    <nav className="bg-white dark:bg-zinc-900 shadow-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6">
            <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="text-2xl font-bold hover:to-purple-600 transition">
            atul
            </Link>

                {/* Center Links */}
            <div className="flex space-x-8 text-md font-medium">
                <Link href="/" >
                    Home
                </Link>
                <Link href="/destination" >
                    Destination
                </Link>
                <Link href="/community" >
                    Community
                </Link>
                <Link href="/trips">
                    Trip
                </Link>
                <Link href="/booking" >
                    Booking
                </Link>
            </div>

          {/* Auth Section */}
            <div className="flex items-center space-x-4">
                {session ? (
                <>
                    <Link href="/profile">
                    <Avatar className="cursor-pointer">
                        <AvatarImage src={session.user?.image || ""} />
                        <AvatarFallback>
                        {session.user?.fullname?.charAt(0) || "U"}
                        </AvatarFallback>
                    </Avatar>
                    </Link>
                    <Button
                        onClick={() => signOut()}
                        variant="destructive"
                        size="sm"
                    >
                    Logout
                    </Button>
                </>
                ) : (
                <>
                    <Link href="/login">
                    <Button variant="outline" size="sm">
                        Login
                    </Button>
                    </Link>
                    <Link href="/signup">
                    <Button size="sm">Signup</Button>
                    </Link>
                </>
                )}
            </div>
        </div>
        </div>
    </nav>
    );
}
