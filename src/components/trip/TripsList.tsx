"use client"

import React from 'react'
import { Button } from '../ui/button'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

type Trip = {
    _id: string
    startDate: string
    endDate: string
    image: string
    title: string
}

function TripsList({ trips }: { trips: Trip[] }) {
    const router = useRouter();

    if (trips.length === 0) {
        return <p className="text-gray-500">No trips available.</p>;
    }

    return (
        <div className="space-y-6">
            {trips.map((trip) => {
                // Format the dates nicely
                const start = new Date(trip.startDate).toLocaleDateString();
                const end = new Date(trip.endDate).toLocaleDateString();

                return (
                    <div
                        key={trip._id}
                        className="flex items-center justify-between rounded-2xl bg-white shadow p-4"
                    >
                        <div className="flex flex-col space-y-2">
                            <h2 className="text-lg font-semibold">{trip.title}</h2>
                            <p className="text-sm text-blue-500">
                                {start} - {end}
                            </p>
                            <Button
                                onClick={() => router.push(`/trips/${trip._id}`)}
                                className="w-fit"
                            >
                                View
                            </Button>
                        </div>
                        {trip.image ? (
                            <Image
                                src={trip.image}
                                alt={trip.title}
                                width={160}
                                height={100}
                                className="rounded-lg object-cover"
                            />
                        ) : (
                            <div className="w-[160px] h-[100px] bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                                No Image
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    )
}

export default TripsList;
