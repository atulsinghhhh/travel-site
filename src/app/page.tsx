"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  // 1️⃣ Hooks always at the top
  const { data: session, status } = useSession();
  const [destinations, setDestinations] = useState<any[]>([]);
  const [error, setError] = useState("");
  const router = useRouter();

  // 2️⃣ Fetch destinations
  useEffect(() => {
    const fetchDestinations = async () => {
      setError("");
      try {
        const response = await fetch("/api/destinations", { method: "GET" });
        if (!response.ok) throw new Error("Failed to fetch destinations");
        const data = await response.json();
        setDestinations(data.destinations || []);
      } catch (err: any) {
        setError(err.message);
      }
    };
    fetchDestinations();
  }, []);

  // 3️⃣ Conditional rendering of JSX, not hooks
  if (status === "loading") return <p>Loading...</p>;
  if (status === "unauthenticated") return <p>You must be logged in</p>;

  // 4️⃣ Now safe to use session and render UI
  return (
    <div>
      <h1>Welcome {session?.user?.username}</h1>
      <button onClick={() => signOut({ callbackUrl: "/login" })}>Logout</button>

      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {destinations.map((dest) => (
          <div key={dest._id} className="border p-4 rounded shadow">
            <h2>{dest.name}</h2>
            {dest.image && <img src={dest.image} alt={dest.name} />}
            <p>{dest.country}</p>
            <p>{dest.category}</p>
            <p>{dest.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
