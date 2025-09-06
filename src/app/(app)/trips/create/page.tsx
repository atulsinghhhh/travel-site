"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import React, { useState } from 'react'

function CreateTripPage() {
    const [formState, setFormState] = useState({
        title: "",
        startDate: "",
        endDate: "",
        image: null as File | null,
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSumbit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("title", formState.title);
            formData.append("startDate", formState.startDate);
            formData.append("endDate", formState.endDate);
            if (formState.image) {
                formData.append("image", formState.image)
            }

            const response = await fetch("/api/trips", {
                method: "POST",
                body: formData
            })

            const data = await response.json();
            console.log("data: ", data);
            if (!response.ok) {
                throw new Error(data.error || "Failed to create trip");
            }

        } catch (error: unknown) {
            setError(error instanceof Error ? error.message : 'An error occurred')
        } finally {
            setLoading(false)
        }
    }
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, files } = e.target;
        if (name === "image" && files) {
            setFormState({ ...formState, image: files[0] as File });
        } else {
            setFormState({ ...formState, [name]: value });
        }
    }
    return (
        <div className='flex justify-center items-center min-h-screen bg-gray-50'>
            <Card className='w-full max-w-md shadow-lg rounded-2xl'>
                <CardHeader>
                    <CardTitle className='text-center'>Create New Trip</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSumbit} className="space-y-4">
                        <div>
                            <Label htmlFor="title">Trip Title</Label>
                            <Input
                                id="title"
                                name="title"
                                type="text"
                                placeholder="Enter trip title"
                                value={formState.title}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="startDate">Start Date</Label>
                            <Input
                                id="startDate"
                                name="startDate"
                                type="date"
                                value={formState.startDate}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="endDate">End Date</Label>
                            <Input
                                id="endDate"
                                name="endDate"
                                type="date"
                                value={formState.endDate}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="image">Trip Image</Label>
                            <Input
                                id="image"
                                name="image"
                                type="file"
                                accept="image/*"
                                onChange={handleChange}
                            />
                        </div>

                        {error && (
                            <p className="text-red-500 text-sm text-center">{error}</p>
                        )}

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...
                                </>
                            ) : (
                                "Create Trip"
                            )}
                        </Button>

                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

export default CreateTripPage
