"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface Trip {
    _id: string;
    title: string;
    startDate: string;
    endDate: string;
    image?: string;
    isCanceled?: boolean;
}

function TripsDashboard() {
    const [formState, setFormState] = useState({
        title: "",
        startDate: "",
        endDate: "",
        image: null as File | null,
    });
    const [trips, setTrips] = useState<Trip[]>([]);
    const [loading, setLoading] = useState(false);
    const [formLoading, setFormLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [editTripId, setEditTripId] = useState<string | null>(null);

  // Fetch trips
    const fetchTrips = async () => {
        setLoading(true);
        setError("");
        try {
        const response = await fetch("/api/trips?type=upcoming");
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Failed to fetch trips");
        setTrips(data.trips);
        } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
        setLoading(false);
        }
    };

    useEffect(() => {
        fetchTrips();
    }, []);

    // Handle form change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, files } = e.target;
        if (name === "image" && files) setFormState({ ...formState, image: files[0] });
        else setFormState({ ...formState, [name]: value });
    };

  // Submit form (Create / Update)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormLoading(true);
        setError("");
        setSuccess("");
        try {
        const formData = new FormData();
        formData.append("title", formState.title);
        formData.append("startDate", formState.startDate);
        formData.append("endDate", formState.endDate);
        if (formState.image) formData.append("image", formState.image);

        const method = editTripId ? "PUT" : "POST";
        const url = editTripId ? `/api/trips/${editTripId}` : "/api/trips";

        const response = await fetch(url, { method, body: formData });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Operation failed");

        setSuccess(editTripId ? "Trip updated successfully!" : "Trip created successfully!");
        setFormState({ title: "", startDate: "", endDate: "", image: null });
        setEditTripId(null);
        fetchTrips();
        } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
        setFormLoading(false);
        }
    };

    // Edit trip
    const handleEdit = (trip: Trip) => {
        setEditTripId(trip._id);
        setFormState({
        title: trip.title,
        startDate: trip.startDate.split("T")[0],
        endDate: trip.endDate.split("T")[0],
        image: null,
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

  // Cancel trip
    const handleCancel = async (id: string) => {
        if (!confirm("Are you sure you want to cancel this trip?")) return;
        setError("");
        setSuccess("");
        setLoading(true);
        try {
        const response = await fetch(`/api/trips/${id}`, { method: "DELETE" });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Failed to cancel trip");
        setSuccess("Trip canceled successfully!");
        fetchTrips();
        } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
        setLoading(false);
        }
    };

    return (
        <div className="p-6">
        {/* Create / Edit Form */}
        <Card className="mb-6">
            <CardHeader>
            <CardTitle>{editTripId ? "Update Trip" : "Create Trip"}</CardTitle>
            </CardHeader>
            <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                <Label>Title</Label>
                <Input name="title" value={formState.title} onChange={handleChange} required />
                </div>
                <div>
                <Label>Start Date</Label>
                <Input type="date" name="startDate" value={formState.startDate} onChange={handleChange} required />
                </div>
                <div>
                <Label>End Date</Label>
                <Input type="date" name="endDate" value={formState.endDate} onChange={handleChange} required />
                </div>
                <div>
                <Label>Image</Label>
                <Input type="file" accept="image/*" name="image" onChange={handleChange} />
                </div>
                <div className="flex gap-3">
                <Button type="submit" disabled={formLoading}>
                    {formLoading ? <Loader2 className="animate-spin h-5 w-5" /> : editTripId ? "Update" : "Create"}
                </Button>
                {editTripId && (
                    <Button variant="outline" type="button" onClick={() => { setEditTripId(null); setFormState({ title: "", startDate: "", endDate: "", image: null }); }}>
                    Cancel
                    </Button>
                )}
                </div>
                {error && <p className="text-red-500 mt-2">{error}</p>}
                {success && <p className="text-green-500 mt-2">{success}</p>}
            </form>
            </CardContent>
        </Card>

        {/* Trips List */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
            <p>Loading trips...</p>
            ) : trips.length === 0 ? (
            <p>No trips found.</p>
            ) : (
            trips.map((trip) => (
                <Card key={trip._id}>
                <CardHeader>
                    <CardTitle>{trip.title}</CardTitle>
                </CardHeader>
                <CardContent>
                    {trip.image && <img src={trip.image} alt={trip.title} className="w-full h-40 object-cover rounded-md mb-2" />}
                    <p className="text-sm">{new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}</p>
                    <div className="flex gap-2 mt-3">
                    <Button size="sm" onClick={() => handleEdit(trip)}>Edit</Button>
                    <Button size="sm" variant="destructive" onClick={() => handleCancel(trip._id)}>Cancel</Button>
                    </div>
                </CardContent>
                </Card>
            ))
            )}
        </div>
        </div>
    );
    }

export default TripsDashboard;
