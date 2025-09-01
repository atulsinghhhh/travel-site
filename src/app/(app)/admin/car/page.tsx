"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

interface Car {
    _id: string;
    brand: string;
    model: string;
    pricePerDay: number;
    image: string;
}

function Page() {
    const [carForm, setCarForm] = useState({
        brand: "",
        model: "",
        pricePerDay: 0,
        image: null as File | null,
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [cars, setCars] = useState<Car[]>([]);
    const [fetching, setFetching] = useState(false);

  // Fetch existing cars
    const fetchCars = async () => {
        setFetching(true);
        try {
        const res = await fetch("/api/booking/car/admin");
        const data = await res.json();
        setCars(data.cars || []);
        } catch (err) {
        console.log("Error fetching cars:", err);
        } finally {
        setFetching(false);
        }
    };

    useEffect(() => {
        fetchCars();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, files } = e.target;
        if (files) {
        setCarForm({ ...carForm, image: files[0] });
        } else {
        setCarForm({ ...carForm, [name]: value });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        const formData = new FormData();
        formData.append("brand", carForm.brand);
        formData.append("model", carForm.model);
        formData.append("pricePerDay", carForm.pricePerDay.toString());
        if (carForm.image) formData.append("image", carForm.image);

        try {
        const response = await fetch("/api/booking/car/admin", {
            method: "POST",
            body: formData,
        });

        if (response.ok) {
            setMessage("✅ Car created successfully!");
            // setCarForm({ brand: "", model: "", pricePerDay: 0, image: null });
            fetchCars(); // Refresh the car list
        } else {
            const err = await response.json();
            setMessage(`Error: ${err.error}`);
        }
        } catch (error) {
        setMessage("Something went wrong.");
        } finally {
        setLoading(false);
        }
    };

    return (
    <div className="min-h-screen p-8 bg-gray-50 text-gray-900">
    <h1 className="text-3xl font-bold mb-8 text-center">Add New Car</h1>

      {/* Add Car Form */}
        <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-12"
        >
            <div className="flex flex-col">
            <Label>Brand</Label>
            <Input
                name="brand"
                value={carForm.brand}
                onChange={handleChange}
                placeholder="Car Brand"
            />
            </div>

            <div className="flex flex-col">
            <Label>Model</Label>
            <Input
                name="model"
                value={carForm.model}
                onChange={handleChange}
                placeholder="Car Model"
            />
            </div>

            <div className="flex flex-col">
            <Label>Price per Day</Label>
            <Input
                type="number"
                name="pricePerDay"
                value={carForm.pricePerDay}
                onChange={handleChange}
                placeholder="Price per Day"
            />
            </div>

            <div className="flex flex-col md:col-span-2">
            <Label>Image</Label>
            <Input type="file" name="image" onChange={handleChange} />
            </div>

            <div className="md:col-span-2">
            <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Uploading..." : "Add Car"}
            </Button>
            </div>

            {message && (
            <div className="md:col-span-2 text-center mt-4">{message}</div>
            )}
        </form>

      {/* Display Existing Cars */}
        <h2 className="text-2xl font-bold mb-6 text-center">Existing Cars</h2>
        {fetching ? (
            <p className="text-center">Loading cars...</p>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {cars.length === 0 && (
                <p className="text-gray-500 text-center col-span-3">
                No cars available.
                </p>
            )}
            {cars.map((car) => (
                <Card key={car._id} className="border rounded-lg p-4 flex flex-col">
                {car.image && (
                    <div className="w-full h-48 relative mb-4">
                    <Image
                        src={car.image}
                        alt={`${car.brand} ${car.model}`}
                        fill
                        className="object-cover rounded-md"
                    />
                    </div>
                )}
                <CardContent className="flex flex-col flex-1">
                    <h3 className="font-bold text-lg">{car.brand}</h3>
                    <p className="text-gray-600">{car.model}</p>
                    <p className="font-semibold mt-2">${car.pricePerDay} / day</p>
                </CardContent>
                </Card>
            ))}
            </div>
        )}
    </div>
    );
}

export default Page;
