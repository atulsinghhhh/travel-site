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

                if (pathname.startsWith("/api/users/") || pathname.startsWith("/api/trips/") || pathname.startsWith("/api/trips")) {
                    return true;
                }

                if (pathname.startsWith("/login") || pathname.startsWith("/api/signup")) {
                    return true;
                }

                // if (pathname.startsWith("/api/signup") || pathname.startsWith("/api/login")) {
                //     return true;
                // }

                // public routes
                if (pathname === "/" || pathname.startsWith("/api/destinations")) {
                    return true;
                }

                if (pathname.startsWith("/admin") || pathname.startsWith("/api/destinations")) {
                    return token?.role === "admin"; 
                }

                return !!token;
            },
        },
    }
);

// ✅ Add matcher to apply middleware to specific paths
export const config = {
    matcher: [
        "/((?!api/auth|_next/static|_next/image|favicon.ico).*)",
    ],
};
