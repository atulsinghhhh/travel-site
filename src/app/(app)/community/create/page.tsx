"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

export default function CreatePostForm() {
    const [postForm, setPostForm] = useState({
        content: "",
        image: null as File | null,
        hashtags: "",
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
        const formData = new FormData();
        formData.append("content", postForm.content);
        formData.append("hashtags", postForm.hashtags);
        if (postForm.image) {
            formData.append("image", postForm.image);
        }

        console.log("Content: ",postForm.content);

        const res = await fetch("/api/community/post", {
            method: "POST",
            body: formData,
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.error);
        } else {
            alert("✅ Post Created Successfully");
            // reset form
            setPostForm({ content: "", image: null, hashtags: "" });
        }
        } catch (err) {
        console.error("Error creating post:", err);
        alert("Something went wrong!");
        } finally {
        setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto mt-20">
        <Card className="w-full border border-gray-200 shadow-sm">
            <h1 className="text-2xl text-center py-4">Create New Post</h1>
            <CardContent className="p-4">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
                {/* Content */}
                <Textarea
                placeholder="Share your travel experience..."
                value={postForm.content}
                onChange={(e) =>
                    setPostForm({ ...postForm, content: e.target.value })
                }
                className="resize-none col-span-1"
                />

                {/* Hashtags + Image */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 col-span-1">
                <Input
                    type="text"
                    placeholder="Add hashtags (comma separated)"
                    value={postForm.hashtags}
                    onChange={(e) =>
                    setPostForm({ ...postForm, hashtags: e.target.value })
                    }
                    className="w-full"
                />

                <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                    setPostForm({
                        ...postForm,
                        image: e.target.files ? e.target.files[0] : null,
                    })
                    }
                    className="w-full"
                />
                </div>

                {/* Button */}
                <Button
                type="submit"
                disabled={loading}
                className="bg-orange-500 hover:bg-orange-600 text-white w-full col-span-1"
                >
                {loading ? "Posting..." : "+ Create Post"}
                </Button>
            </form>
            </CardContent>
        </Card>
        </div>
    );
}
