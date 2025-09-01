"use client";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import React, { useState } from 'react'

function page() {
    const [resortform,setResortForm]=useState({
        name: "",
        location: "",
        pricePerNight: "",
        avatar: null as File | null
    });
    const [loading,setLoading]=useState(false);
    const [message,setMessage]=useState("");


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
        if (files) {
            setResortForm({ ...resortform, avatar: files[0] });
        } else {
            setResortForm({ ...resortform, [name]: value });
        }
    };

    const handleSubmit=async(e:React.FormEvent)=>{
        e.preventDefault();
        setLoading(true);
        setMessage("");

        const formData=new FormData();
        formData.append("name", resortform.name);
        formData.append("location", resortform.location)
        formData.append("pricePerNight",resortform.pricePerNight)
        if (resortform.avatar) formData.append("image", resortform.avatar);
        try {
            const response=await fetch("/api/booking/resort/admin",{
                method: "POST",
                body: formData
            });

            if(response.ok){
                setMessage("✅ Resort created successfully!")
            }
            else{
                const err = await response.json()
                setMessage(`Error: ${err.error}`)
            }
        } catch (error) {
            setMessage("Something went wrong.")
        } finally {
            setLoading(false)
        }
    }
    return (
        <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-2xl">
        <h1 className="text-2xl font-bold mb-6">🏝️ Add New Resort</h1>
        <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
            <Label htmlFor="name">Resort Name</Label>
            <Input
                id="name"
                name="name"
                placeholder="e.g. Beach Paradise Resort"
                value={resortform.name}
                onChange={handleChange}
                required
            />
            </div>

            <div>
            <Label htmlFor="location">Location</Label>
            <Input
                id="location"
                name="location"
                placeholder="e.g. Hawaii"
                value={resortform.location}
                onChange={handleChange}
                required
            />
            </div>

            <div>
            <Label htmlFor="pricePerNight">Price Per Night ($)</Label>
            <Input
                id="pricePerNight"
                name="pricePerNight"
                type="number"
                placeholder="200"
                value={resortform.pricePerNight}
                onChange={handleChange}
                required
            />
            </div>

            <div>
            <Label htmlFor="avatar">Resort Image</Label>
            <Input
                id="avatar"
                name="avatar"
                type="file"
                accept="image/*"
                onChange={handleChange}
                required
            />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Uploading..." : "Add Resort"}
            </Button>

            {message && (
            <p className="mt-4 text-center font-medium text-sm">
                {message}
            </p>)}
        </form>
        
        </div>
    )
}

export default page
