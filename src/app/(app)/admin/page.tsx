"use client";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { Select,SelectContent,SelectItem,SelectTrigger,SelectValue } from "@/components/ui/select"

function page() {
    const [destination,setDestination]=useState({
        name: "",
        country: "",
        category: "",
        description: "",
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [error,setError]=useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const router=useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement |  HTMLTextAreaElement>)=>{
        setDestination({
            ...destination,
            [e.target.name]: e.target.value
        })
    }

    const handleSumbit=async(e:React.FormEvent)=>{
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

            const response=await fetch("/api/destinations",{
                method: "POST",
                // headers: {
                //     "Content-Type": "application/json"
                // },
                body: formData
            });
            const data=await response.json();

            if(!response.ok){
                throw new Error(data.error || "Failed to create destination");
            }

            setSuccess("Destination created successfully!");
            setDestination({name: "",country: "",category: "",description: ""});
            setImageFile(null);
            router.refresh();
        } catch (error:any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }
    return(
        <Card className='max-w-lg mx-auto mt-10 shadow-xl rounded-2xl'>
            <CardHeader>
                <CardTitle className='text-xl font-semibold'>Create New Destination</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSumbit} className='space-y-4'>

                    <div>
                    <Label htmlFor="image">Image</Label>
                    <Input
                        type="file"
                        id="image"
                        accept="image/*"
                        onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)}
                        required
                    />
                    </div>

                    <div>
                        <Label htmlFor='name'>Name</Label>
                        <Input
                            id='name'
                            name='name'
                            placeholder='e.g Paris'
                            value={destination.name}
                            onChange={handleChange}
                            required
                        />    
                    </div>

                    <div>
                        <Label htmlFor="country">Location</Label>
                        <Input
                            id="country"
                            name="country"
                            placeholder="E.g. France"
                            value={destination.country}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="category">Category</Label>
                        <Select
                            value={destination.category}
                            onValueChange={(value) =>
                            setDestination((prev) => ({ ...prev, category: value }))
                            }
                            required
                        >
                            <SelectTrigger id="category" className="w-full">
                            <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
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
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                        id="description"
                        name="description"
                        placeholder="Write a short description..."
                        value={destination.description}
                        onChange={handleChange}
                        required
                    />
                    </div>

                    {error && <p className='text-sm text-red-500'>{error}</p>}
                    {success && <p className="text-sm text-green-600">{success}</p>}

                    <Button type='submit' className='w-full' disabled={loading}>
                        {loading ? "Creating" : "Create Destination"}
                    </Button>

                </form>
            </CardContent>

        </Card>
    )
}

export default page
