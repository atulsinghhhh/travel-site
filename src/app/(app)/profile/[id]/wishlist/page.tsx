"use client";

import { useEffect, useState } from "react";

export default function WishlistPage() {
    const [wishlist, setWishlist] = useState<any[]>([]);

    useEffect(() => {
        const fetchWishlist = async () => {
        const res = await fetch("/api/users/wishlist"); // adjust API
        const data = await res.json();
        setWishlist(data || []);
        };
        fetchWishlist();
    }, []);

    return (
        <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Wishlist</h2>
        {wishlist.length > 0 ? (
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {wishlist.map((item) => (
                <li key={item._id} className="bg-gray-700 p-3 rounded-lg shadow-md">
                <img
                    src={item.image || "/placeholder.png"}
                    alt={item.title}
                    className="w-full h-32 object-cover rounded-md mb-2"
                />
                <p className="font-semibold">{item.title}</p>
                </li>
            ))}
            </ul>
        ) : (
            <p className="text-gray-400">No items in wishlist.</p>
        )}
        </div>
    );
    }
