"use client";

import TripsList from '@/components/TripsList';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Sliderbar from '@/components/Sliderbar';

type Trip = {
    _id: string;
    title: string;
    startDate: string;
    endDate: string;
    image: string;
};

function Page() {
    const [upcomingTab, setUpcomingTab] = useState<Trip[]>([]);
    const [pastTab, setPastTab] = useState<Trip[]>([]);
    const [canceledTab, setCanceledTab] = useState<Trip[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router=useRouter();

    const fetchTrips = async (type: "upcoming" | "past" | "canceled") => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`/api/trips?type=${type}`, { method: "GET" });
            const data = await response.json();

            if (response.ok) {
                if (type === "upcoming") setUpcomingTab(data.trips || []);
                if (type === "past") setPastTab(data.trips || []);
                if (type === "canceled") setCanceledTab(data.trips || []);
            } else {
                setError(data.error || "Failed to fetch trips");
            }
        } catch (err) {
            console.error(err);
            setError("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTrips("upcoming");
        fetchTrips("past");
        fetchTrips("canceled");
    }, []);

    return (
        <div className='flex h-screen'>
            <Sliderbar/>

            <div className="flex-1 p-6 overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold">Trips</h1>
                    <Button
                        className="rounded-full"
                        onClick={() => router.push("/trips/create")}
                        >
                        Create
                    </Button>
                </div>

                {error && <p className="text-red-500 mb-4">{error}</p>}

                <Tabs defaultValue="upcoming">
                    <TabsList className="w-full flex justify-evenly border-b mb-6">
                        <TabsTrigger value="upcoming" className="flex-1 text-center">
                            Upcoming
                        </TabsTrigger>
                        <TabsTrigger value="past" className="flex-1 text-center">
                            Past
                        </TabsTrigger>
                        <TabsTrigger value="canceled" className="flex-1 text-center">
                            Canceled
                        </TabsTrigger>
                    </TabsList>


                    <TabsContent value="upcoming">
                        {loading ? <p>Loading upcoming trips...</p> : (
                            upcomingTab.length > 0 ? <TripsList trips={upcomingTab} /> : <p>No upcoming trips.</p>
                        )}
                    </TabsContent>

                    <TabsContent value="past">
                        {loading ? <p>Loading past trips...</p> : (
                            pastTab.length > 0 ? <TripsList trips={pastTab} /> : <p>No past trips.</p>
                        )}
                    </TabsContent>

                    <TabsContent value="canceled">
                        {loading ? <p>Loading canceled trips...</p> : (
                            canceledTab.length > 0 ? <TripsList trips={canceledTab} /> : <p>No canceled trips.</p>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}

export default Page;
