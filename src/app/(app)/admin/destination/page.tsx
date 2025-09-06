"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

type Destination = {
    _id: string;
    name: string;
    country: string;
    category:
        | "Beaches"
        | "Mountains"
        | "City"
        | "Adventure"
        | "Relaxation"
        | "Monument";
    image: string;
    description: string;
    createdBy: string;
};

function Page() {
    const [destination, setDestination] = useState({
        name: "",
        country: "",
        category: "",
        description: "",
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const [destinations, setDestinations] = useState<Destination[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);

    const router = useRouter();

    useEffect(() => {
        const fetchDestinations = async () => {
            setError("");
            setSuccess("");
            setLoading(true);
            try {
                const response = await fetch("/api/destinations", { method: "GET" });
                const data = await response.json();
                if (response.ok) {
                setDestinations(data.destinations);
                } else {
                setError(data.error || "Failed to fetch destinations");
                }
            } catch (error) {
                console.log("Error fetching destinations: ", error);
                setError("Failed to fetch destinations");
            } finally {
                setLoading(false);
            }
        };
        fetchDestinations();
    }, [router]);


    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setDestination({
        ...destination,
        [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("name", destination.name);
            formData.append("country", destination.country);
            formData.append("category", destination.category);
            formData.append("description", destination.description);
            if (imageFile) formData.append("image", imageFile);

        const url = editingId
            ? `/api/destinations/${editingId}`
            : "/api/destinations";
        const method = editingId ? "PUT" : "POST";

        const response = await fetch(url, {
            method,
            body: formData,
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || "Failed to save destination");
        }

        setSuccess(
            editingId
            ? "Destination updated successfully!"
            : "Destination created successfully!"
        );
            setDestination({ name: "", country: "", category: "", description: "" });
            setImageFile(null);
            setEditingId(null);
            router.refresh();
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this destination?")) return;

        setError("");
        setSuccess("");
        setLoading(true);

        try {
            const response = await fetch(`/api/destinations/${id}`, {
                method: "DELETE",
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to delete destination");
            }

            setSuccess("Destination deleted successfully!");
            router.refresh();
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };


    const handleEdit = (dest: Destination) => {
        setDestination({
            name: dest.name,
            country: dest.country,
            category: dest.category,
            description: dest.description,
        });
        setEditingId(dest._id);
        setImageFile(null);
    };

    return (
        <div className="p-6">
        <Card className="mb-6">
            <CardHeader>
            <CardTitle className="text-2xl">
                {editingId ? "Update Destination" : "Create Destination"}
            </CardTitle>
            </CardHeader>
            <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                <Label>Name</Label>
                <Input
                    name="name"
                    value={destination.name}
                    onChange={handleChange}
                    required
                />
                </div>
                <div>
                <Label>Country</Label>
                <Input
                    name="country"
                    value={destination.country}
                    onChange={handleChange}
                    required
                />
                </div>
                <div>
                <Label>Category</Label>
                <Select
                    value={destination.category}
                    onValueChange={(value) =>
                    setDestination({ ...destination, category: value })
                    }
                >
                    <SelectTrigger>
                    <SelectValue placeholder="Select category"/>
                    </SelectTrigger>
                    <SelectContent >
                        <SelectItem value="Beaches">Beaches</SelectItem>
                        <SelectItem value="Mountains">Mountains</SelectItem>
                        <SelectItem value="City">City</SelectItem>
                        <SelectItem value="Adventure">Adventure</SelectItem>
                        <SelectItem value="Relaxation">Relaxation</SelectItem>
                        <SelectItem value="Monument">Monument</SelectItem>
                    </SelectContent>
                </Select>
                </div>
                <div>
                <Label>Description</Label>
                <Textarea
                    name="description"
                    value={destination.description}
                    onChange={handleChange}
                />
                </div>
                <div>
                <Label>Image</Label>
                <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                    setImageFile(e.target.files ? e.target.files[0] : null)
                    }
                />
                </div>
                <div className="flex gap-3">
                <Button type="submit" disabled={loading}>
                    {editingId ? "Update" : "Create"}
                </Button>
                {editingId && (
                    <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                        setEditingId(null);
                        setDestination({
                        name: "",
                        country: "",
                        category: "",
                        description: "",
                        });
                    }}
                    >
                    Cancel
                    </Button>
                )}
                </div>
            </form>
            {error && <p className="text-red-500 mt-2">{error}</p>}
            {success && <p className="text-green-500 mt-2">{success}</p>}
            </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map((dest) => (
            <Card key={dest._id}>
                <CardHeader>
                    <CardTitle>{dest.name}</CardTitle>
                </CardHeader>
                <CardContent>
                <img
                    src={dest.image || "/placeholder.png"}
                    alt={dest.name}
                    className="w-full h-40 object-cover rounded-md mb-2"
                />
                <p className="text-sm text-gray-600">{dest.country}</p>
                <p className="text-sm">{dest.description}</p>
                <div className="flex gap-2 mt-3">
                    <Button size="sm" onClick={() => handleEdit(dest)}>
                    Edit
                    </Button>
                    <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(dest._id)}
                    >
                    Delete
                    </Button>
                </div>
                </CardContent>
            </Card>
            ))}
        </div>
        </div>
    );
}

export default Page;
