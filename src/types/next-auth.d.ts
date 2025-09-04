import NextAuth, { DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
    interface User{
        _id?: string
        username?: string
        fullname?: string
        avatar?: string
        bio?: string
        travelBudget:{
            total: number,
            spent: number
        },
        role?:string,
        wishlist: string[];
        savedTrips: string[];
        joinedAt? : Date;
    }
    interface Session {
        user: {
            _id?: string
            username?: string
            fullname?: string
            avatar?: string
            bio?: string
            travelBudget:{
                total: number,
                spent: number
            },
            role?:string,
            wishlist: string[];
            savedTrips: string[];
            joinedAt? : Date;
        } & DefaultSession['user']
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        _id?: string
        username?: string
        fullname?: string
        avatar?: string
        bio?: string
        travelBudget:{
            total: number,
            spent: number
        },
        role?:string,
        wishlist: string[];
        savedTrips: string[];
        joinedAt? : Date;
    }
}