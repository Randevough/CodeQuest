export interface LeaderboardUser {
    id: string
    name: string | null
    avatar: string | null
    role: string
    handle: string
    points: number
    completedQuests: number
    email: string
}
