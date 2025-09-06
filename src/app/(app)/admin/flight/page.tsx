"use client";

import React, { useState } from 'react'
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

function AdminFlightPage() {
    const [flightForm, setFlightForm] = useState({
        airline: "",
        from: "",
        to: "",
        departure: "",
        arrival: "",
        price: 0,
        image: null as File | null
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, files } = e.target;
        if (files) {
            setFlightForm({ ...flightForm, image: files[0] });
        } else {
            setFlightForm({ ...flightForm, [name]: value });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        const formData = new FormData();
        formData.append("airline", flightForm.airline);
        formData.append("from", flightForm.from);
        formData.append("to", flightForm.to);
        formData.append("departure", flightForm.departure);
        formData.append("arrival", flightForm.arrival);
        formData.append("price", flightForm.price.toString());
        if (flightForm.image) formData.append("image", flightForm.image);
        try {
            const response = await fetch("/api/booking/flight/admin", {
                method: "POST",
                body: formData
            });

            if (response.ok) {
                setMessage("Flight created successfully!")
            }
            else {
                const err = await response.json()
                setMessage(`Error: ${err.error}`)
            }
        } catch (error) {
            setMessage("Something went wrong.")
        } finally {
            setLoading(false)
        }
    }
    return (
        <div className="min-h-screen p-8 bg-gray-50 text-gray-900">
            <h1 className="text-3xl font-bold mb-8 text-center">Add New Flight</h1>

            <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto"
            >
                <div className="flex flex-col">
                    <Label>Airline</Label>
                    <Input
                        name="airline"
                        value={flightForm.airline}
                        onChange={handleChange}
                        placeholder="Airline Name"
                    />
                </div>

                <div className="flex flex-col">
                    <Label>From</Label>
                    <Input
                        name="from"
                        value={flightForm.from}
                        onChange={handleChange}
                        placeholder="Source"
                    />
                </div>

                <div className="flex flex-col">
                    <Label>To</Label>
                    <Input
                        name="to"
                        value={flightForm.to}
                        onChange={handleChange}
                        placeholder="Destination"
                    />
                </div>

                <div className="flex flex-col">
                    <Label>Departure</Label>
                    <Input
                        type="datetime-local"
                        name="departure"
                        value={flightForm.departure}
                        onChange={handleChange}
                    />
                </div>

                <div className="flex flex-col">
                    <Label>Arrival</Label>
                    <Input
                        type="datetime-local"
                        name="arrival"
                        value={flightForm.arrival}
                        onChange={handleChange}
                    />
                </div>

                <div className="flex flex-col">
                    <Label>Price</Label>
                    <Input
                        type="number"
                        name="price"
                        value={flightForm.price}
                        onChange={handleChange}
                        placeholder="Price"
                    />
                </div>

                <div className="flex flex-col md:col-span-2">
                    <Label>Image</Label>
                    <Input type="file" name="image" onChange={handleChange} />
                </div>

                <div className="md:col-span-2">
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Uploading..." : "Add Flight"}
                    </Button>
                </div>

                {message && (
                    <div className="md:col-span-2 text-center mt-4">{message}</div>
                )}
            </form>
        </div>
    )
}

export default AdminFlightPage
