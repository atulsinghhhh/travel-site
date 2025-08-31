"use client";

import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function Page() {
    const [identifier, setIdentifier] = useState(""); // 🔥 username or email
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        const response = await signIn("credentials", {
            redirect: false,
            identifier, // 🔥 send identifier, not email
            password,
            callbackUrl: "/"
        });

        if (response?.error) {
        setError("Invalid email/username or password");
        return;
        }

        const session = await getSession();
        console.log("Logged in session:", session);

        router.push("/");
    };

    return (
        <Card className="w-full max-w-sm mx-auto mt-10 shadow-lg rounded-2xl">
            <CardHeader>
                <CardTitle className="text-center text-xl">Login</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="Email or Username"
                    required
                />
                <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                />
                <Button type="submit" className="w-full">
                    Login
                </Button>
                {error && (
                    <p className="text-red-500 text-sm text-center">{error}</p>
                )}
                </form>
            </CardContent>
        </Card>
    );
}

export default Page;
