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

// Difficulty colors mapping
// Difficulty colors mapping
const DIFFICULTY_COLORS: Record<string, string> = {
    'Beginner': '#10b981', // emerald-500
    'Intermediate': '#3b82f6', // blue-500
    'Advanced': '#8b5cf6', // violet-500
};
const DEFAULT_COLOR = '#94a3b8'; // slate-400

export function ActivityTrendChart({ data }: { data: ActivityData[] }) {
    return (
        <div className="h-64 w-full">
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
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis
                        dataKey="date"
                        tick={{ fontSize: 12, fill: '#64748b' }}
                        tickFormatter={(str) => {
                            const date = new Date(str);
                            return `${date.getDate()}/${date.getMonth() + 1}`;
                        }}
                    />
                    <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                        itemStyle={{ color: '#f97316' }}
                    />
                    <Area type="monotone" dataKey="count" stroke="#f97316" fill="#ffedd5" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}

export function DifficultyDistributionChart({ data }: { data: DifficultyData[] }) {
    // Custom label to show percentage? Or just legend?
    // Let's us Legend for cleaner look and tooltip.

    return (
        <div className="h-64 w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
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
                        contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        itemStyle={{ color: '#1e293b' }}
                        wrapperStyle={{ zIndex: 1000 }}
                        offset={20}
                        cursor={{ fill: 'transparent' }}
                    />
                    <Legend verticalAlign="bottom" height={36} />
                </PieChart>
            </ResponsiveContainer>
            {/* Center Text for Total */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
                <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {data.reduce((acc, curr) => acc + curr.value, 0)}
                </span>
                <span className="text-xs text-slate-500">Total</span>
            </div>
        </div>
    );
}
