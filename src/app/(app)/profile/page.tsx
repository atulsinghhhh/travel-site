"use client";

import Sliderbar from '@/components/trip/Sliderbar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';

function Page() {
    const { data: session } = useSession();
    const [following, setFollowing] = useState<any[]>([]);
    const [wishlist, setWishlist] = useState<any[]>([]);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        bio: "",
        joinedAt: "",
        travelBudgetTotal: "",
        travelBudgetSpent: "",
        avatar: null as File | null,
    });

    const handleEditProfile = async () => {
        if (!session?.user?._id) return;
        try {
        const form = new FormData();
        if (formData.bio) form.append("bio", formData.bio);
        if (formData.joinedAt) form.append("joinedAt", formData.joinedAt);
        if (formData.travelBudgetTotal || formData.travelBudgetSpent) {
            form.append(
            "travelBudget",
            JSON.stringify({
                total: formData.travelBudgetTotal,
                spent: formData.travelBudgetSpent,
            })
            );
        }
        if (formData.avatar) form.append("avatar", formData.avatar);

        const res = await fetch(`/api/users/${session.user._id}`, {
            method: "PUT",
            body: form,
        });

        const data = await res.json();
        if (res.ok) {
            console.log("Profile updated:", data.updatedUser);
            setEditMode(false);
        } else {
            console.error(data.error);
        }
        } catch (error) {
        console.error("Error updating profile:", error);
        }
    };

    return (
        <div className="flex h-screen">
        <Sliderbar />

        <div className="flex-1 p-6 overflow-y-auto bg-gray-800 text-white">
            {/* Profile Header */}
            <div className="flex items-center gap-4 mb-6">
            <img
                src={(session?.user?.image as string) || "/defaultAvatar.png"}
                alt="Profile Picture"
                width={80}
                height={80}
                className="rounded-full"
            />
            <div>
                <h1 className="text-3xl font-bold">{session?.user?.fullname}</h1>
                <p className="text-gray-400">{session?.user?.username}</p>
            </div>
            <Button onClick={() => setEditMode(true)}>Edit</Button>
            </div>

            {/* Edit Profile Form */}
            {editMode && (
            <div className="bg-gray-700 p-4 rounded-lg mb-6 space-y-3">
                <Input
                type="text"
                placeholder="Bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                />
                <Input
                type="date"
                value={formData.joinedAt}
                onChange={(e) =>
                    setFormData({ ...formData, joinedAt: e.target.value })
                }
                />
                <Input
                type="number"
                placeholder="Travel Budget Total"
                value={formData.travelBudgetTotal}
                onChange={(e) =>
                    setFormData({ ...formData, travelBudgetTotal: e.target.value })
                }
                />
                <Input
                type="number"
                placeholder="Travel Budget Spent"
                value={formData.travelBudgetSpent}
                onChange={(e) =>
                    setFormData({ ...formData, travelBudgetSpent: e.target.value })
                }
                />
                <Input
                type="file"
                accept="image/*"
                onChange={(e) =>
                    setFormData({ ...formData, avatar: e.target.files?.[0] || null })
                }
                />
                <div className="flex gap-3">
                <Button onClick={handleEditProfile}>Save</Button>
                <Button
                    variant="outline"
                    onClick={() => setEditMode(false)}
                >
                    Cancel
                </Button>
                </div>
            </div>
            )}

            {/* Tabs */}
            <Tabs defaultValue="Overview" className="mb-6 flex flex-col justify-evenly w-full">
            <TabsList>
                <TabsTrigger value="Overview">Overview</TabsTrigger>
                <TabsTrigger value="Wishlist">Wishlist</TabsTrigger>
                <TabsTrigger value="Following">Following</TabsTrigger>
            </TabsList>

            {/* Overview */}
            <TabsContent value="Overview" className="p-4">
                <p className="text-gray-300">This is the overview section.</p>
            </TabsContent>

            {/* Wishlist */}
            <TabsContent value="Wishlist" className="p-4">
                {wishlist.length > 0 ? (
                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {wishlist.map((item) => (
                    <li
                        key={item._id}
                        className="bg-gray-700 p-3 rounded-lg shadow-md"
                    >
                        <img
                        src={item.image || "/placeholder.png"}
                        alt={item.title}
                        className="w-full h-32 object-cover rounded-md mb-2"
                        />
                        <p className="font-semibold">{item.title}</p>
                    </li>
                    ))}
                </ul>
                ) : (
                <p className="text-gray-400">No items in wishlist.</p>
                )}
            </TabsContent>

            {/* Following */}
            <TabsContent value="Following" className="p-4">
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
            </TabsContent>
            </Tabs>
        </div>
        </div>
    );
}

export default Page;
