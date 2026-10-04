import { handlers } from "@/auth"
import { NextRequest } from "next/server"

const originalGet = handlers.GET

const devGet = async (req: NextRequest) => {
    if (process.env.NODE_ENV === "development" && req.url.includes("/api/auth/session")) {
        const cookieHeader = req.headers.get("cookie") || ""
        const match = cookieHeader.match(/cq_dev_role=([^;]+)/)
        const devRole = match ? decodeURIComponent(match[1].trim()) : "admin"

        if (devRole === "admin") {
            return Response.json({
                user: {
                    id: 'dev-admin-id',
                    name: 'Admin Developer',
                    email: 'codequest@cyber-univ.ac.id',
                    role: 'Admin',
                    points: 1337,
                    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=AdminDev',
                    image: 'https://api.dicebear.com/7.x/bottts/svg?seed=AdminDev',
                },
                expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            })
        }

        if (devRole === "member") {
            return Response.json({
                user: {
                    id: 'dev-member-id',
                    name: 'Student Member',
                    email: 'student@cyber-univ.ac.id',
                    role: 'Member',
                    points: 450,
                    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=StudentDev',
                    image: 'https://api.dicebear.com/7.x/bottts/svg?seed=StudentDev',
                },
                expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            })
        }
    }
    return originalGet(req)
}

export const GET = devGet
export const POST = handlers.POST

