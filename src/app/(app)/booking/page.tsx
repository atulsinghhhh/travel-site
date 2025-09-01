"use client";

import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ResortTab from "@/components/ResortTab";
import BookingSummary from "@/components/BookingSummary";
import FlightTab from "@/components/FlightTab";
import CarTab from "@/components/CarTab";

function Page() {
    const [booking, setBooking] = useState({
        flight: null,
        resort: null,
        car: null,
    });

    return (
        <div className="p-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
                <h1 className="text-3xl font-extrabold mb-6 text-gray-900 tracking-tight">Find Your Perfect Getaway </h1>

                <Tabs defaultValue="flight" className="w-full space-y-8">
                    <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-200">
                        <TabsList className="flex w-full justify-between rounded-xl bg-gray-100 shadow-sm p-1">
                        <TabsTrigger
                            value="flight"
                            className="flex-1 text-center rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all"
                        >
                            Flights
                        </TabsTrigger>
                        <TabsTrigger
                            value="resort"
                            className="flex-1 text-center rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all"
                        >
                            Resorts
                        </TabsTrigger>
                        <TabsTrigger
                            value="car"
                            className="flex-1 text-center rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all"
                        >
                            Cars
                        </TabsTrigger>
                        </TabsList>

                        <div className="mt-6">
                        <TabsContent value="flight">
                            <FlightTab 
                                onSelectFlight={(flight) => setBooking({ ...booking, flight })}
                            />
                        </TabsContent>

                        <TabsContent value="resort">
                            <ResortTab
                                onSelectResort={(resort) => setBooking({ ...booking, resort })}
                            />
                        </TabsContent>

                        <TabsContent value="car">
                            <CarTab 
                                onSelectCar={(car) => setBooking({ ...booking, car })}
                            />
                        </TabsContent>
                        </div>
                    </div>
                </Tabs>
            </div>

            <div className="lg:col-span-1">
                <div className="sticky top-8">
                <BookingSummary
                    booking={booking.resort || booking.flight || booking.car}
                />
                </div>
            </div>
        </div>
    );
}

export default Page;
