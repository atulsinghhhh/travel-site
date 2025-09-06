"use client";

import React, { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Sliderbar from "@/components/trip/Sliderbar";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import WishlistPage from "./[id]/wishlist/page";
import FollowingPage from "./[id]/following/page";

type UserProfile = {
    _id: string;
    fullname: string;
    username: string;
    avatar?: string;
    bio?: string;
    joinedAt?: string;
    travelBudget?: { total: number; spent: number };
    wishlist?: any[];
    following?: any[];
};

export default function ProfilePage() {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState<Partial<UserProfile>>({});
    const [avatarFile, setAvatarFile] = useState<File | null>(null);

    const fetchUser = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/users");
            const data = await res.json();
            if (res.ok) {
                setUser(data.user);
                setForm(data.user);
            } else {
                setError(data.error || "Failed to fetch user");
            }
        } catch (err) {
            console.error(err);
            setError("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const handleUpdate = async () => {
        try {
            const formData = new FormData();
            if (form.bio) formData.append("bio", form.bio);
            if (form.joinedAt) formData.append("joinedAt", form.joinedAt);
            if (form.travelBudget) formData.append("travelBudget", JSON.stringify(form.travelBudget));
            if (avatarFile) formData.append("avatar", avatarFile);

            const res = await fetch(`/api/users/${user?._id}`, {
                method: "PUT",
                body: formData,
            });
            const data = await res.json();
            if (res.ok) {
                setUser(data.updatedUser);
                setEditing(false);
            } else {
                alert(data.error || "Failed to update user");
            }
        } catch (err) {
            console.error(err);
            alert("Something went wrong");
        }
    };

    if (loading) return <p className="p-6">Loading profile...</p>;
    if (error) return <p className="p-6 text-red-500">{error}</p>;

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sliderbar />
            <div className="flex-1 p-6">
                {/* User Info */}
                <div className="flex items-center gap-6 mb-6">
                    {user?.avatar ? (
                        <Image
                            src={user.avatar}
                            alt={user.username || "User Avatar"}
                            width={80}
                            height={80}
                            className="rounded-full"
                        />
                    ) : (
                        <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center text-gray-600">
                            {user?.fullname?.[0]}
                        </div>
                    )}
                    <div>
                        <h1 className="text-2xl font-bold">{user?.fullname}</h1>
                        <p className="text-sm text-gray-500">@{user?.username}</p>
                        {user?.bio && <p className="text-gray-600 mt-1">{user.bio}</p>}
                    </div>
                </div>

                {/* Tabs */}
                <Tabs defaultValue="overview">
                    <TabsList className="mb-6 border-b">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
                        <TabsTrigger value="following">Following</TabsTrigger>
                    </TabsList>

                    {/* Overview */}
                    <TabsContent value="overview">
                        {editing ? (
                            <div className="space-y-4 max-w-md">
                                <Textarea
                                    placeholder="Bio"
                                    value={form.bio || ""}
                                    onChange={(e) => setForm({ ...form, bio: e.target.value })}
                                />
                                <Input
                                    type="date"
                                    value={form.joinedAt?.split("T")[0] || ""}
                                    onChange={(e) => setForm({ ...form, joinedAt: e.target.value })}
                                />
                                <Input
                                    type="number"
                                    placeholder="Total Budget"
                                    value={form.travelBudget?.total || ""}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            travelBudget: {
                                                total: Number(e.target.value),
                                                spent: form.travelBudget?.spent ?? 0,
                                            },
                                        })
                                    }
                                />
                                <Input
                                    type="number"
                                    placeholder="Spent Budget"
                                    value={form.travelBudget?.spent || ""}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            travelBudget: {
                                                total: form.travelBudget?.total ?? 0,
                                                spent: Number(e.target.value),
                                            },
                                        })
                                    }
                                />
                                <Input type="file" onChange={(e) => setAvatarFile(e.target.files?.[0] || null)} />
                                <div className="flex gap-2">
                                    <Button onClick={handleUpdate}>Save</Button>
                                    <Button variant="outline" onClick={() => setEditing(false)}>Cancel</Button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-2 max-w-md">
                                <p><strong>Joined:</strong> {user?.joinedAt ? new Date(user.joinedAt).toLocaleDateString() : "N/A"}</p>
                                {user?.travelBudget && (
                                    <p><strong>Travel Budget:</strong> {user.travelBudget.spent} / {user.travelBudget.total}</p>
                                )}
                                <Button onClick={() => setEditing(true)}>Edit Profile</Button>
                            </div>
                        )}
                    </TabsContent>

                    {/* Wishlist */}
                    <TabsContent value="wishlist">
                        <WishlistPage/>
                    </TabsContent>

                    {/* Following */}
                    <TabsContent value="following">
                        <FollowingPage/>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
