"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import Image from "next/image";

interface Car {
    _id: string;
    brand: string;
    model: string;
    pricePerDay: number;
    image: string;
    [key: string]: any;
}

interface CarTabProps {
    onSelectCar: (car: any) => void;
}

function CarTab({ onSelectCar }: CarTabProps) {
    const [cars, setCars] = useState<Car[]>([]);
    const [selectedCar, setSelectedCar] = useState<Car | null>(null);
    const [startDatesMap, setStartDatesMap] = useState<{ [key: string]: string }>({});
    const [endDatesMap, setEndDatesMap] = useState<{ [key: string]: string }>({});
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const [brandFilter, setBrandFilter] = useState("");
    const [priceFilter, setPriceFilter] = useState("");
    const [priceRanges, setPriceRanges] = useState<string[]>(["<50", "50-100", ">100"]);

    // Fetch cars
    useEffect(() => {
        const fetchCars = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/booking/car/admin");
            const data = await res.json();
            const carsData = data.cars || [];
            setCars(carsData);

            const prices = carsData.map((c: Car) => c.pricePerDay);
            if (prices.length) {
            const min = Math.min(...prices);
            const max = Math.max(...prices);
            setPriceRanges([`<${min + 20}`, `${min + 20}-${max - 20}`, `>${max - 20}`]);
            }
        } catch (err) {
            console.log("Error fetching cars:", err);
        } finally {
            setLoading(false);
        }
        };
        fetchCars();
    }, []);

    const handleBooking = async (car: Car) => {
        const startDate = startDatesMap[car._id];
        const endDate = endDatesMap[car._id];

        if (!startDate || !endDate) {
        setMessage("Please select start and end dates.");
        return;
        }

        setLoading(true);
        setMessage("");

        try {
        const res = await fetch("/api/booking/car", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ carId: car._id, startDate, endDate }),
        });
        const data = await res.json();

        if (res.ok) {
            setMessage("Car booked successfully!");
            setSelectedCar(car);
            onSelectCar({
            ...car,
            bookingType: "car",
            bookingId: data.booking._id,
            startDate,
            endDate,
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

    // Filtered cars
    const filteredCars = cars.filter((car) => {
        const matchesBrand = brandFilter
        ? car.brand.toLowerCase().includes(brandFilter.toLowerCase())
        : true;

        let matchesPrice = true;
        if (priceFilter) {
        const price = car.pricePerDay;
        if (priceFilter.startsWith("<")) matchesPrice = price < parseInt(priceFilter.slice(1));
        else if (priceFilter.includes("-")) {
            const [min, max] = priceFilter.split("-").map(Number);
            matchesPrice = price >= min && price <= max;
        } else if (priceFilter.startsWith(">")) matchesPrice = price > parseInt(priceFilter.slice(1));
        }

        return matchesBrand && matchesPrice;
    });

    return (
        <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Book Your Car</h1>

        {/* Brand & Price Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
            <Input
            placeholder="Search by brand..."
            value={brandFilter}
            onChange={(e) => setBrandFilter(e.target.value)}
            className="flex-1"
            />

            <div className="flex gap-2 flex-wrap">
            {priceRanges.map((range) => (
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
                setBrandFilter("");
                setPriceFilter("");
            }}
            >
                Clear Filters
            </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredCars.length === 0 && (
            <p className="text-gray-500 text-center col-span-2">No cars match the filters.</p>
            )}

            {filteredCars.map((car) => (
            <Card
                key={car._id}
                className={`border p-4 rounded-lg flex flex-col justify-between ${
                selectedCar?._id === car._id ? "border-2 border-orange-500" : "border-gray-200"
                }`}
            >
                {car.image && (
                <div className="mb-4 w-full h-48 relative">
                    <Image src={car.image} alt={car.brand} fill className="object-cover rounded-md" />
                </div>
                )}

                <CardContent className="flex flex-col flex-1">
                <h2 className="font-bold text-lg">{car.brand}</h2>
                <p className="text-gray-600">{car.model}</p>
                <p className="font-semibold mt-2">${car.pricePerDay} / day</p>

                <div className="flex gap-2 mt-3">
                    <Input
                    type="date"
                    value={startDatesMap[car._id] || ""}
                    onChange={(e) =>
                        setStartDatesMap({ ...startDatesMap, [car._id]: e.target.value })
                    }
                    />
                    <Input
                    type="date"
                    value={endDatesMap[car._id] || ""}
                    onChange={(e) =>
                        setEndDatesMap({ ...endDatesMap, [car._id]: e.target.value })
                    }
                    />
                </div>

                <Button
                    className="mt-3 w-full"
                    onClick={() => handleBooking(car)}
                    disabled={loading}
                >
                    {loading && selectedCar?._id === car._id ? "Booking..." : "Book"}
                </Button>
                </CardContent>
            </Card>
            ))}
        </div>

        {message && <p className="mt-6 text-center font-medium text-sm">{message}</p>}
        </div>
    );
}

export default CarTab;
