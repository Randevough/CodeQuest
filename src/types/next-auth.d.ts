import { type DefaultSession } from "next-auth"
import "next-auth/jwt"

declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        user: {
            /** The user's role. */
            role: string | null | undefined
            points: number
            avatar: string | null
            image: string | null
            bio: string | null
            githubUrl: string | null
            linkedinUrl: string | null
        } & DefaultSession["user"]
    }

    interface User {
        role: string | null | undefined
        points: number
        avatar: string | null
        image: string | null
        bio: string | null
        githubUrl: string | null
        linkedinUrl: string | null
    }
}

declare module "next-auth/jwt" {
    /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
    interface JWT {
        /** The user's role. */
        role: string | null | undefined
        points: number
        avatar: string | null
        image: string | null
        bio: string | null
        githubUrl: string | null
        linkedinUrl: string | null
        /** Timestamp (ms) of the last DB refresh — used to debounce re-fetching */
        lastRefreshed?: number
    }
}
