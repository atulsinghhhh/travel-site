"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import React, { useEffect, useState } from "react";

type Event = {
    _id: string;
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
};

function Page() {
    const [eventForm, setEventForm] = useState({
        title: "",
        description: "",
        date: "",
        location: "",
        time: ""
    });
    const [events, setEvents] = useState<Event[]>([]);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setEventForm({ ...eventForm, [e.target.name]: e.target.value });
    };

  // Fetch events
    const fetchEvents = async () => {
        setMessage("");
        setError("");
        try {
            const response = await fetch("/api/community/event", { method: "GET" });
            const data = await response.json();
            console.log("Event",data.events);
        if (!response.ok) {
            setError(data.error || "Failed to fetch events");
        } else {
            setEvents(data.events || []);
        }
        } catch (err) {
            console.error("Error fetching events:", err);
            setError("An unexpected error occurred");
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

  // Create event
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setMessage("");
        try {
        const response = await fetch("/api/community/event/admin", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(eventForm),
        });
        const data = await response.json();
        if (!response.ok) {
            setError(data.error || "Something went wrong");
        } else {
            setMessage(data.message || "Event created successfully");
            setEventForm({
            title: "",
            description: "",
            date: "",
            location: "",
            time: ""
            });
            fetchEvents(); // refresh event list
        }
        } catch (err) {
        console.error("Error submitting form:", err);
        setError("An unexpected error occurred");
        } finally {
        setLoading(false);
        }
    };

  // Delete event
    const handleDelete = async (eventId: string) => {
        if (!confirm("Are you sure you want to delete this event?")) {
        return;
        }
        try {
        const response = await fetch(`/api/community/event/${eventId}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();
        if (!response.ok) {
            setError(data.error || "Something went wrong");
        } else {
            setMessage(data.message || "Event deleted successfully");
            setEvents(events.filter((event) => event._id !== eventId));
        }
        } catch (err) {
        console.error("Error deleting event:", err);
        setError("An unexpected error occurred");
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-4">
        {/* Create Event Form */}
        <h1 className="text-2xl font-bold mb-4">Create Event</h1>
        <form onSubmit={handleSubmit} className="space-y-4 mb-8">
            {error && <p className="text-red-500">{error}</p>}
            {message && <p className="text-green-500">{message}</p>}
            <div>
            <Label htmlFor="title" className="block mb-1 font-medium">
                Title
            </Label>
            <Input
                type="text"
                id="title"
                name="title"
                value={eventForm.title}
                onChange={handleChange}
                className="w-full"
                required
            />
            </div>
            <div>
            <Label htmlFor="description" className="block mb-1 font-medium">
                Description
            </Label>
            <Textarea
                id="description"
                name="description"
                value={eventForm.description}
                onChange={handleChange}
                className="w-full"
                required
            />
            </div>
            <div>
            <Label htmlFor="date" className="block mb-1 font-medium">
                Date
            </Label>
            <Input
                type="date"
                id="date"
                name="date"
                value={eventForm.date}
                onChange={handleChange}
                className="w-full"
                required
            />
            </div>
            <div>
            <Label htmlFor="location" className="block mb-1 font-medium">
                Location
            </Label>
            <Input
                type="text"
                id="location"
                name="location"
                value={eventForm.location}
                onChange={handleChange}
                className="w-full"
                required
            />
            </div>
            <div>
            <Label htmlFor="time" className="block mb-1 font-medium">
                Time
            </Label>
            <Input
                type="time"
                id="time"
                name="time"
                value={eventForm.time}
                onChange={handleChange}
                className="w-full"
                required
            />
            </div>
            
            <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Event"}
            </Button>
        </form>

        {/* Event List */}
        <h2 className="text-xl font-semibold mb-2">Events</h2>
        {events.length === 0 ? (
            <p className="text-gray-500">No events found.</p>
        ) : (
            <ul className="space-y-4">
            {events.map((event) => (
                <li
                key={event._id}
                className="border rounded-md p-4 shadow-sm bg-white dark:bg-zinc-800"
                >
                <h3 className="text-lg font-bold">{event.title}</h3>
                <p className="text-gray-600">{event.description}</p>
                <p className="text-sm text-gray-500">
                    📍 {event.location} | 📅{" "}
                    {new Date(event.date).toLocaleDateString()}
                </p>
                <Button
                    variant="destructive"
                    size="sm"
                    className="mt-2"
                    onClick={() => handleDelete(event._id)}
                >
                    Delete
                </Button>
                </li>
            ))}
            </ul>
        )}
        </div>
    );
}

export default Page;
