"use client";

import React from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

type Trip = {
    _id: string;
    startDate: string;
    endDate: string;
    title: string;
    location: string;
    description?: string;
};

function TripsList({ trips }: { trips: Trip[] }) {
    const router = useRouter();

    if (trips.length === 0) {
        return <p className="text-gray-500">No trips available.</p>;
    }

    return (
        <div className="space-y-6">
        {trips.map((trip) => {
            const start = new Date(trip.startDate).toLocaleDateString();
            const end = new Date(trip.endDate).toLocaleDateString();

            return (
            <div
                key={trip._id}
                className="flex items-center justify-between rounded-2xl text-black shadow p-4 bg-white"
            >
                <div className="flex flex-col space-y-2">
                <h2 className="text-lg font-semibold">{trip.title}</h2>
                <p className="text-sm text-blue-500">
                    {start} - {end}
                </p>
                <p className="text-xs text-gray-600">{trip.location}</p>
                {trip.description && (
                    <p className="text-xs text-gray-500 line-clamp-2">
                    {trip.description}
                    </p>
                )}
                <Button
                    onClick={() => router.push(`/trips/${trip._id}`)}
                    className="w-fit"
                >
                    View
                </Button>
                </div>
            </div>
            );
        })}
        </div>
    );
    }

export default TripsList;
