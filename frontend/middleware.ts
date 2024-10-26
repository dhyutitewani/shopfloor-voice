import { NextResponse } from "next/server";
import { withAuth, NextRequestWithAuth } from "next-auth/middleware";

export default withAuth(
    function middleware(request: NextRequestWithAuth) {
        // Extract the token from the request
        const { token } = request.nextauth;

        // Check if the path is for admin access
        if (request.nextUrl.pathname.startsWith("/admin") &&
            request.nextauth.token?.role !== "ADMIN" ) {
            // If the user is not authenticated, redirect to the admin login page
            if (!token) {
                return NextResponse.redirect(new URL("/denied", request.url));
            }
        }

        // Allow public access to the /users path
        if (request.nextUrl.pathname.startsWith("/users")) {
            return NextResponse.next(); // Public access, no redirection needed
        }

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
    matcher: [
		"/((?!api|_next/static|_next/image|favicon.ico|login|screen/).)",
	], // Adjust as needed
};