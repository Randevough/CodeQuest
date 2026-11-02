import { ImageResponse } from 'next/og'
import { prisma } from '@/lib/db'

export const size = {
    width: 1200,
    height: 630,
}

export const contentType = 'image/png'

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const quest = await prisma.quest.findUnique({
        where: { id },
        select: {
            title: true,
            difficulty: true,
            points: true,
            category: true,
        },
    })

    const title = quest?.title ?? 'Quest Challenge'
    const category = quest?.category ?? 'Developer Arena'
    const difficulty = quest?.difficulty ?? 'Active'
    const xp = quest?.points ? `${quest.points} XP` : 'CodeQuest'

    return new ImageResponse(
        (
            <div
                style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '60px 80px',
                    backgroundColor: '#0a0b10',
                    color: '#ffffff',
                    fontFamily: 'sans-serif',
                    border: '8px solid #00f0ff',
                    boxSizing: 'border-box',
                }}
            >
                {/* Top bar: Badge and platform identity */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                        }}
                    >
                        <div
                            style={{
                                padding: '8px 18px',
                                borderRadius: '9999px',
                                border: '2px solid #00f0ff',
                                color: '#00f0ff',
                                fontSize: '20px',
                                fontWeight: 'bold',
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em',
                            }}
                        >
                            CodeQuest
                        </div>
                        <div
                            style={{
                                padding: '8px 16px',
                                borderRadius: '9999px',
                                backgroundColor: '#131722',
                                color: '#94a3b8',
                                fontSize: '18px',
                                border: '1px solid #1e293b',
                            }}
                        >
                            {category}
                        </div>
                    </div>
                    <div
                        style={{
                            fontSize: '24px',
                            color: '#00f0ff',
                            fontWeight: 'bold',
                            letterSpacing: '0.05em',
                        }}
                    >
                        {xp}
                    </div>
                </div>

                {/* Main title */}
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px',
                    }}
                >
                    <div
                        style={{
                            fontSize: '60px',
                            fontWeight: 900,
                            lineHeight: 1.1,
                            color: '#ffffff',
                            textShadow: '0 0 20px rgba(0, 240, 255, 0.4)',
                        }}
                    >
                        {title}
                    </div>
                </div>

                {/* Bottom stats row */}
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderTop: '2px solid #1e293b',
                        paddingTop: '24px',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            gap: '24px',
                            color: '#94a3b8',
                            fontSize: '20px',
                        }}
                    >
                        <span>
                            Tier: <strong style={{ color: '#00f0ff' }}>{difficulty}</strong>
                        </span>
                        <span>•</span>
                        <span>Gamified Developer Arena</span>
                    </div>
                    <div
                        style={{
                            color: '#64748b',
                            fontSize: '18px',
                        }}
                    >
                        codequest.dev
                    </div>
                </div>
            </div>
        ),
        {
            ...size,
        }
    )
}
