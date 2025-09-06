"use client";

import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type Event = {
    _id: string;
    title: string;
    date: string;
};

type User = {
    _id: string;
    username: string;
    image: string;
};

function RigSide() {
    const [events, setEvents] = useState<Event[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [following, setFollowing] = useState<string[]>([]);

    useEffect(() => {
        const fetchData = async () => {
        try {
            const eventRes = await fetch("/api/community/event");
            const userRes = await fetch("/api/community/suggest-users");

            const eventdata = await eventRes.json();
            const userData = await userRes.json();

            console.log("userData:", userData.suggestedUsers );

            setEvents(eventdata.events || []);
            setUsers(userData.suggestedUsers || []);
        } catch (err) {
            console.error("Error fetching sidebar data:", err);
        }
        };
        fetchData();
    }, []);

    const handleFollow = async (userId: string) => {
        try {
            await fetch(`/api/users/${userId}/follow`, { method: "POST" });
            console.log(`Followed user with ID: ${userId}`);
            // Optionally update UI or state here
        } catch (err) {
            console.error("Error following user:", err);

        }
    }

    return (
        <div className="w-80 bg-gray-50 dark:bg-gray-900 p-4 border-l border-gray-200 dark:border-gray-800 h-full flex flex-col justify-between">
            <div className="space-y-6 overflow-hidden">
                {/* Suggested Users */}
                <div>
                <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                    Suggested Users
                </h2>
                <div className="space-y-4">
                    {users.length > 0 ? (
                    users.map((user) => (
                        <div
                        key={user._id}
                        className="flex items-center justify-between"
                        >
                        <div className="flex items-center gap-3 justify-evenly">
                            <Avatar>
                                <AvatarImage src={user.image} alt={user.username} />
                                <AvatarFallback>{user.username[0]}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {user.username}
                            </span>
                            <Button
                                size="sm"
                                variant={following.includes(user._id) ? "default" : "outline"}
                                className={
                                following.includes(user._id)
                                    ? "bg-green-500 text-white hover:bg-green-600"
                                    : "text-black"
                                }
                                onClick={() => handleFollow(user._id)}
                            >
                                {following.includes(user._id) ? "Following" : "Follow"}
                            </Button>
                        </div>
                        
                        </div>
                    ))
                    ) : (
                        <p className="text-sm text-gray-500">No suggestions available</p>
                    )}
                </div>
                </div>

                {/* Upcoming Events */}
                
                <div>
                <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                    Upcoming Events
                </h2>

                {events.length > 0 ? (
                    <div className="space-y-6">
                    {events.map((event) => (
                        <Link key={event._id} href={`/community/event/${event._id}`}>
                        <div className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {event.title}
                            </h3>
                            <p className="text-xs text-gray-500">
                            {new Date(event.date).toDateString()}
                            </p>
                        </div>
                        </Link>
                    ))}
                    </div>
                ) : (
                    <p className="text-sm text-gray-500">No upcoming events</p>
                )}
                </div>

            </div>
        </div>

    );
}

export default RigSide;
