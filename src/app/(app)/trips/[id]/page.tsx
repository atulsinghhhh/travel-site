"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

type Trip = {
    _id: string;
    title: string;
    startDate: string;
    endDate: string;
    image: string;
    isCanceled: boolean;
};

function Page() {
    const { id } = useParams();
    const router = useRouter();
    const [trip, setTrip] = useState<Trip | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchTrip = async () => {
        setError("");
        setLoading(true);
        try {
            const response = await fetch(`/api/trips/${id}`, { method: "GET" });
            const data = await response.json();
            if (response.ok) {
            setTrip(data.trip);
            } else {
            setError(data.error || "Failed to fetch trip");
            }
        } catch (err: any) {
            setError(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
        };
        fetchTrip();
    }, [id]);

    // Delete trip
    const handleDelete = async () => {
        if (!trip) return;
        if (!confirm("Are you sure you want to delete this trip?")) return;

        setLoading(true);
        setError("");
        try {
        const response = await fetch(`/api/trips/${trip._id}`, {
            method: "DELETE",
        });
        if (response.ok) {
            router.push("/trips"); 
        } else {
            const data = await response.json();
            setError(data.error || "Failed to delete trip");
        }
        } catch (err: any) {
        setError(err.message || "Something went wrong");
        } finally {
        setLoading(false);
        }
    };

    if (loading) return <p className="p-6">Loading...</p>;
    if (error) return <p className="p-6 text-red-500">{error}</p>;
    if (!trip) return <p className="p-6">Trip not found.</p>;

    const start = new Date(trip.startDate).toLocaleDateString();
    const end = new Date(trip.endDate).toLocaleDateString();

    return (
        <div className="p-6 max-w-3xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">{trip.title}</h1>

        {trip.isCanceled && (
            <span className="inline-block bg-red-200 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
                Canceled
            </span>
        )}

        {trip.image ? (
            <Image
                src={trip.image}
                alt={trip.title}
                width={600}
                height={300}
                className="rounded-lg object-cover"
            />
        ) : (
            <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
            No Image
            </div>
        )}

        <p className="text-blue-500 font-medium">
            {start} - {end}
        </p>


            <div className="flex space-x-4 mt-4">
                <Button onClick={() => router.push(`/trips/edit/${trip._id}`)}>
                    Edit
                </Button>
                <Button onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
                    Delete
                </Button>
            </div>
        </div>
    );
}

export default Page;
