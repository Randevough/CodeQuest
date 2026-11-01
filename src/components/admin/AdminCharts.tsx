'use client';

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend
} from 'recharts';

interface ActivityData {
    date: string; // 'YYYY-MM-DD'
    count: number;
}

interface DifficultyData {
    name: string;
    value: number;
}

// Same semantic accents as quest list and submission review badges.
const DIFFICULTY_COLORS: Record<string, string> = {
    'Beginner': 'var(--color-success)',
    'Intermediate': 'var(--color-info)',
    'Advanced': 'var(--color-danger)',
    'Advance': 'var(--color-danger)',
    'Exclusive': 'var(--color-warning)',
};
const DEFAULT_COLOR = 'var(--color-text-muted)'; // slate-400

export function ActivityTrendChart({ data }: { data: ActivityData[] }) {
    return (
        <div className="min-w-0 w-full">
            <details className="mb-3 text-sm text-muted"><summary className="min-h-11 cursor-pointer">Activity data by date</summary><ul>{data.map(row => <li key={row.date}>{row.date}: {row.count}</li>)}</ul></details>
            <div className="h-64" aria-hidden="true">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={data}
                    margin={{
                        top: 10,
                        right: 30,
                        left: 0,
                        bottom: 0,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                    <XAxis
                        dataKey="date"
                        tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }}
                        tickFormatter={(str) => {
                            const date = new Date(str);
                            return `${date.getDate()}/${date.getMonth() + 1}`;
                        }}
                    />
                    <YAxis tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }} />
                    <Tooltip
                        contentStyle={{ backgroundColor: 'var(--color-surface-raised)', borderRadius: '8px', border: '1px solid var(--color-border)' }}
                        itemStyle={{ color: 'var(--color-info)' }}
                    />
                    <Area isAnimationActive={false} type="monotone" dataKey="count" stroke="var(--color-info)" fill="var(--color-surface-raised)" />
                </AreaChart>
            </ResponsiveContainer>
            </div>
        </div>
    );
}

export function DifficultyDistributionChart({ data }: { data: DifficultyData[] }) {
    // Custom label to show percentage? Or just legend?
    // Let's us Legend for cleaner look and tooltip.

    return (
        <div className="min-w-0 w-full">
            <ul className="mb-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted">{data.map(row => <li key={row.name}>{row.name}: {row.value}</li>)}</ul>
            <div className="h-64 w-full relative" aria-hidden="true">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie isAnimationActive={false}
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="var(--color-secondary)"
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={DIFFICULTY_COLORS[entry.name] || DEFAULT_COLOR}
                            />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{ backgroundColor: 'var(--color-surface-raised)', borderRadius: '8px', border: '1px solid var(--color-border)', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        itemStyle={{ color: 'var(--color-text)' }}
                        wrapperStyle={{ zIndex: 1000 }}
                        offset={20}
                        cursor={{ fill: 'transparent' }}
                    />
                    <Legend verticalAlign="bottom" height={36} formatter={value => <span className="text-muted">{value}</span>} />
                </PieChart>
            </ResponsiveContainer>
            {/* Center Text for Total */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
                <span className="text-2xl font-bold text-foreground">
                    {data.reduce((acc, curr) => acc + curr.value, 0)}
                </span>
                <span className="text-xs text-muted">Total</span>
            </div>
            </div>
        </div>
    );
}