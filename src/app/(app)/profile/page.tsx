"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

export default function ProfilePage() {
    const { data: session, status } = useSession();
    const [bio, setBio] = useState(session?.user?.bio || "");
    const [totalBudget, setTotalBudget] = useState(session?.user?.travelBudget?.total || 0);
    const [spentBudget, setSpentBudget] = useState(session?.user?.travelBudget?.spent || 0);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    if (status === "loading") return <p>Loading...</p>;
    if (!session) return <p>You must be logged in to edit your profile.</p>;

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
        const res = await fetch(`/api/users/${session.user._id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include", // 🔑 ensures cookies are sent
            body: JSON.stringify({
                bio,
                travelBudget: { total: totalBudget, spent: spentBudget },
            }),
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Update failed");

        setMessage("✅ Profile updated successfully!");
        } catch (error: any) {
        setMessage(`❌ ${error.message}`);
        } finally {
        setLoading(false);
        }
    };

    return (
        <div className="max-w-lg mx-auto mt-10 p-6 border rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>

        <form onSubmit={handleUpdate} className="space-y-4">
            <div>
            <label className="block font-medium">Bio</label>
            <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full border p-2 rounded"
            />
            </div>

            <div>
            <label className="block font-medium">Travel Budget (Total)</label>
            <input
                type="number"
                value={totalBudget}
                onChange={(e) => setTotalBudget(Number(e.target.value))}
                className="w-full border p-2 rounded"
            />
            </div>

            <div>
            <label className="block font-medium">Travel Budget (Spent)</label>
            <input
                type="number"
                value={spentBudget}
                onChange={(e) => setSpentBudget(Number(e.target.value))}
                className="w-full border p-2 rounded"
            />
            </div>

            <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
            {loading ? "Updating..." : "Update Profile"}
            </button>
        </form>

            {message && <p className="mt-4">{message}</p>}
        </div>
    );
}
