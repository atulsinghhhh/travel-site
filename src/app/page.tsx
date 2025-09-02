
"use client";
import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";

type Destination = {
  _id: string;
  title: string;
  image: string;
  description?: string;
};

type Experience = {
  _id: string;
  title: string;
  image: string;
};

export default function HomePage() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [search, setSearch] = useState("");

  const router=useRouter();

  // Fetch data from backend later
  useEffect(() => {
    // TODO: Fetch destinations and  experiences from backend
  }, []);

  // Handle Search (later connect backend)
  const handleSearch = () => {
    // TODO: Call backend search API
    console.log("Searching for:", search);
  };

  return (
<>
    <Navbar/>
</>
  
  );
}

