"use client";
import React, { useState } from "react";
import { HoveredLink, Menu, MenuItem, ProductItem } from "./ui/navbar-menu";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useSession } from "next-auth/react";

export function Navbar({ className }: { className?: string }){
    const [active, setActive] = useState<string | null>(null);
    // const session =await useSession();

    return(
        <></>
    )

}