"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";

type Post = {
    _id: string;
    content: string;
    hashtags: string[];
    name?: string;
    image?: string;
};

export default function SinglePostPage() {
    const { id } = useParams(); 
    const router = useRouter();
    const { data: session } = useSession();

    const [post, setPost] = useState<Post | null>(null);
    const [content, setContent] = useState("");
    const [hashtags, setHashtags] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await fetch(`/api/community/post/${id}`);
                const data = await res.json();
                if (res.ok) {
                    setPost(data.post);
                    setContent(data.post.content);
                    setHashtags(data.post.hashtags.join(", "));
                }
            } catch (err) {
                console.error("Error fetching post:", err);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchPost();
    }, [id]);

    const handleUpdate = async () => {
        try {
            const res = await fetch(`/api/community/post/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content, hashtags: hashtags.split(",") }),
            });
            const data = await res.json();
            if (res.ok) {
                setPost(data.post);
                alert("Post updated");
            } else {
                alert(data.error || "Update failed");
            }
        } catch (err) {
                console.error(err);
        }
    };

    const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
        const res = await fetch(`/api/community/post/${id}`, {
            method: "DELETE",
        });
        const data = await res.json();
        if (res.ok) {
            alert("Deleted successfully ");
            router.push("/community"); 
        } else {
            alert(data.error || "Delete failed");
        }
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <p className="p-4">Loading...</p>;
    if (!post) return <p className="p-4">Post not found</p>;

    return (
    <div className="max-w-2xl mx-auto p-6">
        <Card className="p-6 space-y-4">
        <h1 className="text-xl font-bold">Edit Post</h1>

        <label className="block text-sm font-medium">Content</label>
        <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
        />

        <label className="block text-sm font-medium mt-4">Hashtags</label>
        <Input
            value={hashtags}
            onChange={(e) => setHashtags(e.target.value)}
        />

        <div className="flex gap-3 mt-6">
            <Button onClick={handleUpdate}>Update</Button>
            <Button variant="destructive" onClick={handleDelete}>
            Delete
            </Button>
        </div>
        </Card>
    </div>
    );
}
