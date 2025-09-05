"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";

export default function EventDetailPage() {
    const { id } = useParams(); // dynamic [id]
    const [event, setEvent] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const { data: session } = useSession();

    useEffect(() => {
        if (!id) return;

        const fetchEvent = async () => {
        try {
            const res = await fetch(`/api/community/event/${id}`);
            const data = await res.json();
            console.log("Event data:", data.event.createdBy);

            if (!res.ok) {
            setError(data.error || "Failed to fetch event");
            } else {
            setEvent(data.event);
            }
        } catch (err) {
            setError("Something went wrong.");
        } finally {
            setLoading(false);
        }
        };

        fetchEvent();
    }, [id]);

    if (loading) {
        return (
        <div className="flex h-screen items-center justify-center text-gray-600 dark:text-gray-300">
            <Loader2 className="animate-spin mr-2" /> Loading event...
        </div>
        );
    }

    if (error) {
        return (
        <div className="flex h-screen items-center justify-center text-red-500">
            {error}
        </div>
        );
    }

    if (!event) {
        return (
        <div className="flex h-screen items-center justify-center text-gray-500">
            Event not found
        </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto p-6">
        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {event.title}
        </h1>

        {/* Date + Location */}
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-6 space-x-6">
            <span>📅 {new Date(event.date).toDateString()}</span>
            <span>📍 {event.location}</span>
            {event.time && <span>⏰ {event.time}</span>}
        </div>

        {/* Description */}
        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
            {event.description}
        </p>

        {/* Created By */}
        {event.createdBy && (
            <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Event created by:
            </p>
            <p className="text-gray-900 dark:text-white font-medium">
                {event.createdBy.fullname || session?.user?.fullname} (@{event.createdBy.username || session?.user?.username})
            </p>
            </div>
        )}
        </div>
    );
    }
