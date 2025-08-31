import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { connectDB } from "@/libs/db";
import { Users } from "@/model/user";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                identifier: { label: "Email or Username", type: "text" },
                password: { label: "Password", type: "password" },
            },

            async authorize(credentials: any): Promise<any> {
                if (!credentials?.identifier || !credentials?.password) {
                    throw new Error("Email/Username and password are required");
                }

                await connectDB();

                try {
                    const user = await Users.findOne({
                        $or: [
                            { email: credentials.identifier },
                            { username: credentials.identifier },
                        ],
                    });

                    if (!user) {
                        throw new Error("No user found with the given credentials");
                    }

                    // console.log("user details: ",user);

                    const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
                    if (!isPasswordValid) {
                        throw new Error("Invalid password");
                    } 

                    return {
                        _id: user._id.toString(),
                        email: user.email,
                        username: user.username,
                        fullname: user.fullname,
                        bio: user.bio,
                        travelBudget: user.travelBudget,
                        role: user.role,
                        wishlist: user.wishlist || [],
                        savedTrips: user.savedTrips || [],
                    };
                } catch (error) {
                    console.error("Error during authorization:", error);
                    throw new Error("Error during authorization");
                }
            }

        }),
        
    ],
    
    callbacks: {
        async jwt({ token, user }) {
        if (user) {
            token._id = user._id?.toString();
            token.username = user.username;
            token.fullname = user.fullname;
            token.bio = user.bio || "";
            token.travelBudget = user.travelBudget || { total: 0, spent: 0 };
            token.role = user.role || "user"
            token.wishlist = user.wishlist;
            token.savedTrips = user.savedTrips
        }
            // console.log("token: ",token);
            return token;
        },
        async session({ session, token }) {
        if (session.user) {
            session.user._id = token._id;
            session.user.username = token.username;
            session.user.fullname = token.fullname;

            // overwrite default name with your fullname
            session.user.name = token.fullname;

            session.user.bio = token.bio;
            session.user.travelBudget = token.travelBudget;
            session.user.role = token.role;
            session.user.wishlist = token.wishlist;
            session.user.savedTrips = token.savedTrips
        }
            // console.log("session: ",session.user)
            return session;
        },
    },

    pages: {
        signIn: "/login"
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET
}