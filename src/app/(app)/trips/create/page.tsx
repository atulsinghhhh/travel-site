"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

function CreateTripPage() {
    const [title, setTitle] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [location, setLocation] = useState("");
    const [description, setDescription] = useState("");
    const [activities, setActivities] = useState<string[]>([]);
    const [expenses, setExpenses] = useState<{ title: string; amount: number }[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
        const response = await fetch("/api/trips", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
            title,
            startDate,
            endDate,
            location,
            description,
            activities,
            expenses,
            }),
        });

        const data = await response.json();

        if (response.ok) {
            router.push("/trips"); 
        } else {
            setError(data.error || "Failed to create trip");
        }
        } catch (err) {
        setError("Something went wrong");
        } finally {
        setLoading(false);
        }
    };


    const addExpense = () => {
        setExpenses([...expenses, { title: "", amount: 0 }]);
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded-xl text-black">
        <h1 className="text-2xl font-bold mb-6">Create New Trip</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
            <Input
            placeholder="Trip Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            />

            <div className="flex gap-4">
            <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
            />
            <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
            />
            </div>

            <Input
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            />

            <Textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            />

            <Textarea
            placeholder="Activities (comma separated)"
            value={activities.join(", ")}
            onChange={(e) => setActivities(e.target.value.split(","))}
            />

            <div>
            <h2 className="text-lg font-semibold mb-2">Expenses</h2>
            {expenses.map((expense, idx) => (
                <div key={idx} className="flex gap-2 mb-2">
                <Input
                    placeholder="Title"
                    value={expense.title}
                    onChange={(e) => {
                    const updated = [...expenses];
                    updated[idx].title = e.target.value;
                    setExpenses(updated);
                    }}
                />
                <Input
                    type="number"
                    placeholder="Amount"
                    value={expense.amount}
                    onChange={(e) => {
                    const updated = [...expenses];
                    updated[idx].amount = Number(e.target.value);
                    setExpenses(updated);
                    }}
                />
                </div>
            ))}
            <Button type="button" variant="outline" onClick={addExpense}>
                Add Expense
            </Button>
            </div>

            <Button type="submit" disabled={loading}>
            {   loading ? "Creating..." : "Create Trip"}
            </Button>
        </form>
        </div>
    );
}

export default CreateTripPage;
