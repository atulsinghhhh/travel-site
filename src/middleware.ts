import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware() {
        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token, req }) => {
            const { pathname } = req.nextUrl;

            // Public routes
            if (
                pathname === "/" ||
                pathname.startsWith("/login") ||
                pathname.startsWith("/signup") ||
                pathname.startsWith("/api/signup") ||
                pathname.startsWith("/api/destinations")
            ) {
                return true;
            }

            // Admin-only routes
            if (
                pathname.startsWith("/api/community/event/admin") ||
                pathname.startsWith("/api/booking/resort/admin") ||
                pathname.startsWith("/api/booking/flight/admin") ||
                pathname.startsWith("/api/destinations/admin") ||
                pathname.startsWith("/api/booking/car/admin")
            ) {
                return token?.role === "admin";
            }

            // Authenticated user routes
            if (
                pathname.startsWith("/api/users/") ||
                pathname.startsWith("/api/trips/") ||
                pathname.startsWith("/api/community/post") ||
                pathname.startsWith("/api/community/") ||
                pathname.startsWith("/api/booking/")
            ) {
                return !!token;
            }

            // Default → authenticated
            return !!token;
        },
        },
    }
);

// ✅ Apply middleware only to pages & APIs (excluding next-auth, static, images, favicon)
export const config = {
    matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
};
