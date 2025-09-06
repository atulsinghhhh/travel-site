"use client"

import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { Loader2 } from "lucide-react";

type Destination = {
    _id: string;
    name: string;
    country: string;
    description: string;
    image: string;
    category:
    | "Beaches"
    | "Mountains"
    | "City"
    | "Adventure"
    | "Relaxation"
    | "Monument"
};


function page() {
    const [destination, setDestination] = useState<Destination | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const {id} = useParams();

    useEffect(() => {
        const fetchDestination = async () => {
            try {
                const res=await fetch(`/api/destinations/${id}`);
                const data = await res.json();
                if (!res.ok) {
                    setError(data.error || "Failed to fetch destination");
                } else {
                    setDestination(data.destination);
                }

            } catch (error) {
                setError("Something went wrong.");
            }
            finally {
                setLoading(false);
            }
        };
        fetchDestination();
    },[id]);
    if (loading) {
        return (
        <div className="flex h-screen items-center justify-center text-gray-600 dark:text-gray-300">
            <Loader2 className="animate-spin mr-2" /> Loading destination...
        </div>
        );
    }

    if (error) {
    return (
            <div className="flex h-screen items-center justify-center text-red-500">
                {error}
            </div>
        );
    }
    if (!destination) {
        return (
        <div className="flex h-screen items-center justify-center text-gray-500">
            Destination not found
        </div>
        );
    }
    return (
        <div className="max-w-4xl mx-auto p-6">

            <div className="mb-6">
                <img
                src={destination.image || "/placeholder.png"}
                alt={destination.name}
                className="w-full h-64 object-cover rounded-xl shadow-md"
                />
            </div>

            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {destination.name}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                🏝️ Category: {destination.category} | 📍 Country: {destination.country}
            </p>

            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                {destination.description}
            </p>
        </div>
    )
}

export default page
