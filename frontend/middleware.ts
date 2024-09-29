// middleware.ts
import { withAuth, NextRequestWithAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(request: NextRequestWithAuth) {
        // Extract the token from the request
        const { token } = request.nextauth;

        // Check if the path is for admin access
        if (request.nextUrl.pathname.startsWith("/")) {
            // If the user is not authenticated, redirect to the admin login page
            if (!token) {
                return NextResponse.redirect(new URL("/login", request.url));
            }
        }

        // Allow public access to the /users path
        if (request.nextUrl.pathname.startsWith("/users")) {
            return NextResponse.next(); // Public access, no redirection needed
        }

        // Redirect authenticated users to /users by default for any other paths
        if (token) {
            return NextResponse.redirect(new URL("/users", request.url));
        }

        // Allow public access to other routes
        return NextResponse.next();
    },
    {
        callbacks: {
            // Ensure that the token exists to authorize
            authorized: ({ token }) => !!token,
        },
    }
);

// Applies the middleware only to paths you want to protect
export const config = {
    matcher: ["/:path*", "/users/:path*"], // Adjust as needed
};