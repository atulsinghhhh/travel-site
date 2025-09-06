"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type Trip = {
    _id: string;
    title: string;
    startDate: string;
    endDate: string;
    location: string;
    description?: string;
    activities?: string[];
    expenses?: { title: string; amount: number }[];
    isCanceled?: boolean;
};

export default function TripDetailPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();

    const [trip, setTrip] = useState<Trip | null>(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [form, setForm] = useState<Partial<Trip>>({});

    const fetchTrip = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/trips/${id}`);
            const data = await res.json();
            if (res.ok) {
                setTrip(data.trip);
                setForm(data.trip);
            } else {
                setError(data.error || "Failed to fetch trip");
            }
        } catch (err) {
            setError("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) fetchTrip();
    }, [id]);

    const handleUpdate = async () => {
        try {
            const res = await fetch(`/api/trips/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (res.ok) {
                setTrip(data.trip);
                setEditing(false);
            } else {
                setError(data.error || "Failed to update trip");
            }
        } catch {
            setError("Something went wrong");
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to cancel this trip?")) return;
        try {
            const res = await fetch(`/api/trips/${id}`, {
                method: "DELETE",
            });
            const data = await res.json();
            if (res.ok) {
                router.push("/trips"); 
            } else {
                setError(data.error || "Failed to delete trip");
            }
        } catch {
            setError("Something went wrong");
        }
    };

    if (loading) return <p className="text-center p-6">Loading...</p>;
    if (error) return <p className="text-red-500 p-6">{error}</p>;
    if (!trip) return <p className="p-6">Trip not found</p>;

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded-xl text-black">
        <h1 className="text-2xl font-bold mb-6">Trip Details</h1>

        {editing ? (
                <div className="space-y-4">
                <Input
                    value={form.title || ""}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
                <div className="flex gap-4">
                    <Input
                    type="date"
                    value={form.startDate || ""}
                    onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                    />
                    <Input
                    type="date"
                    value={form.endDate || ""}
                    onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                    />
                </div>
                <Input
                    value={form.location || ""}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                />
                <Textarea
                    value={form.description || ""}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
                <Textarea
                    placeholder="Activities (comma separated)"
                    value={form.activities?.join(", ") || ""}
                    onChange={(e) =>
                    setForm({ ...form, activities: e.target.value.split(",") })
                    }
                />

                {/* ✅ Expenses Editing */}
                <div className="space-y-2">
                    <h3 className="font-semibold text-lg">Expenses</h3>
                    {(form.expenses || []).map((expense, idx) => (
                    <div key={idx} className="flex gap-2">
                        <Input
                        placeholder="Expense Title"
                        value={expense.title}
                        onChange={(e) => {
                            const updated = [...(form.expenses || [])];
                            updated[idx].title = e.target.value;
                            setForm({ ...form, expenses: updated });
                        }}
                        />
                        <Input
                        type="number"
                        placeholder="Amount"
                        value={expense.amount}
                        onChange={(e) => {
                            const updated = [...(form.expenses || [])];
                            updated[idx].amount = parseFloat(e.target.value) || 0;
                            setForm({ ...form, expenses: updated });
                        }}
                        />
                        <Button
                        variant="destructive"
                        onClick={() => {
                            const updated = [...(form.expenses || [])];
                            updated.splice(idx, 1);
                            setForm({ ...form, expenses: updated });
                        }}
                        >
                        Remove
                        </Button>
                    </div>
                    ))}
                    <Button
                    onClick={() =>
                        setForm({
                        ...form,
                        expenses: [...(form.expenses || []), { title: "", amount: 0 }],
                        })
                    }
                    >
                    + Add Expense
                    </Button>
                </div>

                <Button onClick={handleUpdate}>Save</Button>
                <Button variant="outline" onClick={() => setEditing(false)}>
                    Cancel
                </Button>
                </div>
            ) : (
                <div className="space-y-4">
                <h2 className="text-xl font-semibold">{trip.title}</h2>
                <p>
                    {new Date(trip.startDate).toLocaleDateString()} -{" "}
                    {new Date(trip.endDate).toLocaleDateString()}
                </p>
                <p className="text-blue-600">{trip.location}</p>
                {trip.description && <p className="text-gray-600">{trip.description}</p>}
                {trip.activities && (
                    <p className="text-sm text-gray-500">
                    Activities: {trip.activities.join(", ")}
                    </p>
                )}

                {/* ✅ Expenses Display */}
                {trip.expenses && trip.expenses.length > 0 && (
                    <div className="mt-4">
                    <h3 className="font-semibold text-lg">Expenses</h3>
                    <ul className="list-disc list-inside text-sm text-gray-700">
                        {trip.expenses.map((exp, idx) => (
                        <li key={idx}>
                            {exp.title}: <span className="font-medium">${exp.amount}</span>
                        </li>
                        ))}
                    </ul>
                    <p className="mt-2 font-semibold text-gray-800">
                        Total: $
                        {trip.expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0)}
                    </p>
                    </div>
                )}

                <div className="flex gap-4 mt-4">
                    <Button onClick={() => setEditing(true)}>Edit</Button>
                    <Button variant="destructive" onClick={handleDelete}>
                    Cancel Trip
                    </Button>
                </div>
                </div>
        )}
</div>

    );
}
