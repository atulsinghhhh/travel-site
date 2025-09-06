"use client";

import { useEffect, useState } from "react";

export default function FollowingPage() {
    const [following, setFollowing] = useState<any[]>([]);

    useEffect(() => {
        const fetchFollowing = async () => {
            const res = await fetch("/api/users/following"); 
            const data = await res.json();
            setFollowing(data || []);
        };
        fetchFollowing();
    }, []);

    return (
        <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Following</h2>
        {following.length > 0 ? (
            <ul className="space-y-2">
            {following.map((user) => (
                <li
                key={user._id}
                className="flex items-center gap-3 bg-gray-700 p-3 rounded-lg"
                >
                <img
                    src={user.image || "/defaultAvatar.png"}
                    alt={user.username}
                    width={40}
                    height={40}
                    className="rounded-full"
                />
                <div>
                    <p className="font-semibold">{user.fullname}</p>
                    <p className="text-sm text-gray-400">@{user.username}</p>
                </div>
                </li>
            ))}
            </ul>
        ) : (
            <p className="text-gray-400">Not following anyone yet.</p>
        )}
        </div>
    );
    }
