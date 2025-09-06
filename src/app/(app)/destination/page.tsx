"use client";

import { BackgroundGradient } from '@/components/ui/background-gradient';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Heart } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

type Destination = {
    _id: string;
    name: string;
    country: string;
    category: string;
    description: string;
    image: string;
};

const categories = ["Beaches", "Mountains", "City", "Adventure", "Relaxation", "Momentum"];

function Page() {
    const { data: session } = useSession();

    const [destinations, setDestinations] = useState<Destination[]>([]);
    const [filter, setFilter] = useState("");
    const [search, setSearch] = useState("");
    const [error, setError] = useState("");
    const [wishlist, setWishlist] = useState<string[]>([]);
    const [loading, setLoading] = useState<string | null>(null);

    useEffect(() => {
        const fetchDestination = async () => {
            setError("");
            try {
                const response = await fetch("/api/destinations", { method: "GET" });
                const data = await response.json();
                setDestinations(data.destinations);
            } catch (error: any) {
                setError(error.message || "Failed to fetch destinations");
            }
        };
        fetchDestination();
    }, []);

    // filter and search logic
    const filteredDestination = destinations.filter((d) => {
        const Category = filter ? d.category === filter : true;
        const Search = search
            ? d.name.toLowerCase().includes(search.toLowerCase()) ||
            d.country.toLowerCase().includes(search.toLowerCase
                ())
            : true;

        return Category && Search;
    });

    // handle toggle wishlist
    const toggleWishlist = async (destinationId: string) => {
        if (!session || !(session.user as any)?._id) {
            alert("Please login first");
            return;
        }

        try {
            setLoading(destinationId);
            const response = await fetch(`/api/users/${(session.user as any)._id}/wishlist`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ destinationId }),
            });
            const data = await response.json();
            if (response.ok) {
                setWishlist(data.wishlist);
            } else {
                alert(data.error || "Something went wrong");
            }
        } catch (error: any) {
            setError(error.message || "Error updating wishlist");
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className="p-6 h-screen mx-auto bg-gray-800">
            <h1 className="text-3xl font-bold mb-6 text-white">Explore Tropical Destinations</h1>

            {/* Search */}
            <Input
                placeholder="Search for destination or activities"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="mb-4 bg-white"
            />

            {/* filters */}
            <div className="flex gap-2 mb-6 flex-wrap cursor-pointer">
                {categories.map((cat) => (
                    <Button
                        key={cat}
                        variant={filter === cat ? "default" : "outline"}
                        onClick={() => setFilter(filter === cat ? "" : cat)}
                    >
                        {cat}
                    </Button>
                ))}
            </div>

            {/* Destination Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 cursor-pointer">
                {filteredDestination.map((dest) => {
                    const isWishlisted = wishlist.includes(dest._id);

                    return (
                        <Link href={`/destination/${dest._id}`} key={dest._id}>
                            <BackgroundGradient className="rounded-xl">
                                <Card className="overflow-hidden shadow-lg rounded-xl">
                                    <img
                                        src={dest.image}
                                        alt={dest.name}
                                        className="h-40 w-full object-cover"
                                    />
                                    <CardContent>
                                        <h3 className="font-semibold">{dest.name}</h3>
                                        <p className="text-sm text-gray-500">{dest.country}</p>

                                        <Button
                                            variant={isWishlisted ? "destructive" : "outline"}
                                            size="sm"
                                            className="mt-3"
                                            disabled={loading === dest._id}
                                            onClick={() => toggleWishlist(dest._id)}
                                        >
                                            <Heart
                                                className={`h-4 w-4 mr-1 ${isWishlisted ? "fill-red-500" : ""
                                                    }`}
                                            />
                                            {isWishlisted ? "Remove" : "Wishlist"}
                                        </Button>

                                    </CardContent>
                                </Card>
                            </BackgroundGradient>
                        </Link>

                    );
                })}
            </div>
        </div>
    );
}

export default Page;
