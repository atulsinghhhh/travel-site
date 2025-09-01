"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "./ui/card";
import Image from "next/image";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface Resort {
    _id: string;
    name: string;
    location: string;
    pricePerNight: number;
    image: string;
    [key: string]: any;
}

interface ResortsTabProps {
    onSelectResort: (resort: any) => void;
}

function ResortTab({ onSelectResort }: ResortsTabProps) {
    const [resorts, setResorts] = useState<Resort[]>([]);
    const [checkIn, setCheckIn] = useState("");
    const [checkout, setCheckout] = useState("");
    const [selectedResort, setSelectedResort] = useState<Resort | null>(null);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const [locationFilter, setLocationFilter] = useState("");
    const [priceFilter, setPriceFilter] = useState("");

    const [locations, setLocations] = useState<string[]>([]);
    const [priceRanges, setPriceRanges] = useState<string[]>(["<100", "100-200", ">200"]);

    useEffect(() => {
        const fetchResorts = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/booking/resort/admin");
            const data = await res.json();
            const resortsData = (data.resorts || []) as Resort[];
            setResorts(resortsData);

            const uniqueLocations = Array.from(new Set(resortsData.map(r => r.location)));
            setLocations(uniqueLocations);

            const prices = resortsData.map(r => r.pricePerNight);
            if (prices.length) {
            const min = Math.min(...prices);
            const max = Math.max(...prices);
            setPriceRanges([`<${min + 50}`, `${min + 50}-${max - 50}`, `>${max - 50}`]);
            }
        } catch (err) {
            console.log("Error fetching resorts:", err);
        } finally {
            setLoading(false);
        }
        };
        fetchResorts();
    }, []);

    const handleBooking = async (resort: Resort) => {
        if (!checkIn || !checkout) {
        setMessage("Please select check-in and check-out dates.");
        return;
        }

        setLoading(true);
        setMessage("");

        try {
        const res = await fetch("/api/booking/resort", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ resortId: resort._id, checkIn, checkout }),
        });
        const data = await res.json();

        if (res.ok) {
            setMessage("Booking created successfully!");
            setSelectedResort(resort);
            onSelectResort({
                ...resort,
                bookingType: "resort",
                bookingId: data.booking._id,
                checkIn,
                checkout,
                totalPrice: data.booking.totalPrice,
            });
        } else {
            setMessage(`Error: ${data.error}`);
        }
        } catch (err) {
        setMessage("Something went wrong.");
        } finally {
        setLoading(false);
        }
    };

    // Filtered resorts
    const filteredResorts = resorts.filter(r => {
        const matchesLocation = locationFilter
        ? r.location.toLowerCase().includes(locationFilter.toLowerCase())
        : true;

        let matchesPrice = true;
        if (priceFilter) {
        const price = r.pricePerNight;
        if (priceFilter.startsWith("<")) matchesPrice = price < parseInt(priceFilter.slice(1));
        else if (priceFilter.includes("-")) {
            const [min, max] = priceFilter.split("-").map(Number);
            matchesPrice = price >= min && price <= max;
        } else if (priceFilter.startsWith(">")) matchesPrice = price > parseInt(priceFilter.slice(1));
        }

        return matchesLocation && matchesPrice;
    });

    return (
        <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">🏝️ Book Your Resort</h1>


        {/* Check-in / Check-out */}
        <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
                <label className="text-sm font-medium">Check-In</label>
                <Input type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)} />
            </div>
            <div>
                <label className="text-sm font-medium">Check-Out</label>
                <Input type="date" value={checkout} onChange={e => setCheckout(e.target.value)} />
            </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
            <Input
                placeholder="Search location..."
                value={locationFilter}
                onChange={e => setLocationFilter(e.target.value)}
                className="flex-1"
            />

            <div className="flex gap-2 flex-wrap">
            {priceRanges.map(range => (
                <Button
                key={range}
                variant={priceFilter === range ? "default" : "outline"}
                onClick={() => setPriceFilter(priceFilter === range ? "" : range)}
                >
                {range}
                </Button>
            ))}
            </div>

            <Button
            variant="outline"
            onClick={() => {
                setLocationFilter("");
                setPriceFilter("");
            }}
            >
            Clear Filters
            </Button>
        </div>

        {/* Resorts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredResorts.length === 0 && (
            <p className="text-gray-500 text-center col-span-2">No resorts match the filters.</p>
            )}

            {filteredResorts.map(resort => (
            <Card
                key={resort._id}
                className={`border p-4 rounded-lg flex flex-col justify-between ${
                selectedResort?._id === resort._id ? "border-2 border-orange-500" : "border-gray-200"
                }`}
            >
                <div className="mb-4 w-full h-48 relative">
                <Image src={resort.image} alt={resort.name} fill className="object-cover rounded-md" />
                </div>

                <CardContent className="flex flex-col flex-1">
                <h2 className="font-bold text-lg">{resort.name}</h2>
                <p className="text-gray-600">{resort.location}</p>
                <p className="font-semibold mt-2">${resort.pricePerNight} / night</p>

                <Button
                    className="mt-4 w-full"
                    onClick={() => {
                    setSelectedResort(resort);
                    handleBooking(resort);
                    }}
                    disabled={loading}
                >
                    {loading && selectedResort?._id === resort._id ? "Booking..." : "Book"}
                </Button>
                </CardContent>
            </Card>
            ))}
        </div>

        {message && <p className="mt-6 text-center font-medium text-sm">{message}</p>}
        </div>
    );
}

export default ResortTab;
