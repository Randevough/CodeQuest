import { auth } from '@/auth'

/**
 * Requires the caller to be authenticated.
 * Throws if no valid session exists.
 */
export async function requireAuth() {
    const session = await auth()
    if (!session?.user?.id) {
        throw new Error('Unauthorized: You must be logged in.')
    }
    return session.user
}

/**
 * Requires the caller to be an authenticated Admin.
 * Throws with distinct messages for unauthenticated vs. forbidden.
 */
export async function requireAdmin() {
    const session = await auth()
    if (!session?.user?.id) {
        throw new Error('Unauthorized: You must be logged in.')
    }
    if (session.user.role !== 'Admin') {
        throw new Error('Forbidden: Admin access required.')
    }
    return session.user
}
