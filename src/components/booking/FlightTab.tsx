"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "../ui/card";
import Image from "next/image";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface Flight {
    _id: string;
    airline: string;
    from: string;
    to: string;
    departure: string;
    arrival: string;
    price: number;
    image: string;
    [key: string]: any;
}

interface FlightsTabProps {
    onSelectFlight: (flight: any) => void;
}

function FlightTab({ onSelectFlight }: FlightsTabProps) {
    const [flights, setFlights] = useState<Flight[]>([]);
    const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
    const [seatsMap, setSeatsMap] = useState<{ [key: string]: number }>({});
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const [airlineFilter, setAirlineFilter] = useState("");
    const [priceFilter, setPriceFilter] = useState("");
    const [priceRanges, setPriceRanges] = useState<string[]>(["<100", "100-200", ">200"]);

    useEffect(() => {
        const fetchFlights = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/booking/flight");
            const data = await res.json();
            console.log("Data: ",data.flights);
            const flightsData = (data.flights || []) as Flight[];
            setFlights(flightsData);

            const prices = flightsData.map(f => f.price);
            if (prices.length) {
                const min = Math.min(...prices);
                const max = Math.max(...prices);
                setPriceRanges([`<${min + 50}`, `${min + 50}-${max - 50}`, `>${max - 50}`]);
            }
        } catch (err) {
            console.log("Error fetching flights:", err);
        } finally {
            setLoading(false);
        }
        };
        fetchFlights();
    }, []);

    const handleBooking = async (flight: Flight) => {
        const seats = seatsMap[flight._id];
        if (!seats || seats < 1) {
        setMessage("Please enter valid number of seats.");
        return;
        }

        setLoading(true);
        setMessage("");

        try {
        const res = await fetch("/api/booking/flight", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ flightId: flight._id, seats }),
        });

        const data = await res.json();
        if (res.ok) {
            setMessage("Flight booked successfully!");
            setSelectedFlight(flight);
            onSelectFlight({
            ...flight,
            bookingType: "flight",
            bookingId: data.booking?._id,
            seats,
            totalPrice: data.booking?.totalPrice,
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

    const filteredFlights = flights.filter(f => {
        const matchesAirline = airlineFilter
        ? f.airline.toLowerCase().includes(airlineFilter.toLowerCase())
        : true;

        let matchesPrice = true;
        if (priceFilter) {
            const price = f.price;
            if (priceFilter.startsWith("<")) matchesPrice = price < parseInt(priceFilter.slice(1));
            else if (priceFilter.includes("-")) {
                const [min, max] = priceFilter.split("-").map(Number);
                matchesPrice = price >= min && price <= max;
        } else if (priceFilter.startsWith(">")) matchesPrice = price > parseInt(priceFilter.slice(1));
        }

        return matchesAirline && matchesPrice;
    });

    return (
        <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">✈️ Book Your Flight</h1>

        {/* Airline & Price Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
            <Input
            placeholder="Search by airline..."
            value={airlineFilter}
            onChange={e => setAirlineFilter(e.target.value)}
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
                setAirlineFilter("");
                setPriceFilter("");
            }}
            >
            Clear Filters
            </Button>
        </div>

        {/* Flights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredFlights.length === 0 && (
            <p className="text-gray-500 text-center col-span-2">No flights match the filters.</p>
            )}

            {filteredFlights.map(flight => (
            <Card
                key={flight._id}
                className={`border p-4 rounded-lg flex flex-col justify-between ${
                selectedFlight?._id === flight._id ? "border-2 border-orange-500" : "border-gray-200"
                }`}
            >
                {flight.image && (
                <div className="mb-4 w-full h-48 relative">
                    <Image src={flight.image} alt={flight.airline} fill className="object-cover rounded-md" />
                </div>
                )}

                <CardContent className="flex flex-col flex-1">
                <h2 className="font-bold text-lg">{flight.airline}</h2>
                <p className="text-gray-600">{flight.from} → {flight.to}</p>
                <p className="font-semibold mt-2">${flight.price} per seat</p>

                <Input
                    type="number"
                    value={seatsMap[flight._id] || ""}
                    onChange={e =>
                        setSeatsMap({ ...seatsMap, [flight._id]: parseInt(e.target.value) })
                    }
                    placeholder="Seats"
                    className="mt-3"
                />


                <Button
                    className="mt-3 w-full"
                    onClick={() => handleBooking(flight)}
                    disabled={loading}
                >
                    {loading && selectedFlight?._id === flight._id ? "Booking..." : "Book"}
                </Button>
                </CardContent>
            </Card>
            ))}
        </div>

        {message && <p className="mt-6 text-center font-medium text-sm">{message}</p>}
        </div>
    );
}

export default FlightTab;
