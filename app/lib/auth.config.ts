import { NextAuthConfig } from "next-auth"

export const authConfig = {
    providers: [],
    pages: {
        signIn: '/'
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            console.log({auth})
            const isLoggedIn = !!auth?.user;
            const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
            if (isOnDashboard) {
                if (isLoggedIn) return true;
                return false; // Redirect unauthenticated users to login page
            } else if (isLoggedIn) {
                return Response.redirect(new URL('/dashboard', nextUrl));
            }
            return true;
        },
    }    
} satisfies NextAuthConfig;