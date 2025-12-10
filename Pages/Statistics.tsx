import React, { useState, useEffect } from 'react';
import { api } from '@/components/api/apiClient';
import { motion } from 'framer-motion';
import {
	Trophy,
	Users,
	AlertTriangle,
	TrendingUp,
	Clock,
	Calendar,
	RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	LineChart,
	Line,
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	Legend,
} from 'recharts';

const kpiCards = [
	{
		label: 'Total Races Processed',
		key: 'totalRaces',
		icon: Trophy,
		color: 'from-orange-500 to-rose-500',
		defaultValue: '—'
	},
	{
		label: 'Total Entries Processed',
		key: 'totalEntries',
		icon: Users,
		color: 'from-blue-500 to-cyan-500',
		defaultValue: '—'
	},
	{
		label: 'Total Errors',
		key: 'totalErrors',
		icon: AlertTriangle,
		color: 'from-rose-500 to-pink-500',
		defaultValue: '—'
	},
	{
		label: 'API Success Rate',
		key: 'successRate',
		icon: TrendingUp,
		color: 'from-emerald-500 to-teal-500',
		defaultValue: '—%',
		suffix: '%'
	},
	{
		label: 'Last Bet Submission',
		key: 'lastBetSubmission',
		icon: Clock,
		color: 'from-purple-500 to-indigo-500',
		defaultValue: '—',
		isDate: true
	},
	{
		label: 'Last Race Ingestion',
		key: 'lastRaceIngestion',
		icon: Calendar,
		color: 'from-amber-500 to-orange-500',
		defaultValue: '—',
		isDate: true
	},
];

// Sample chart data - will be replaced when connected to backend
const sampleRaceData = [
	{ date: 'Mon', races: 12, errors: 1 },
	{ date: 'Tue', races: 19, errors: 2 },
	{ date: 'Wed', races: 15, errors: 0 },
	{ date: 'Thu', races: 22, errors: 1 },
	{ date: 'Fri', races: 28, errors: 3 },
	{ date: 'Sat', races: 35, errors: 2 },
	{ date: 'Sun', races: 30, errors: 1 },
];

export default function Statistics() {
	const [dateRange, setDateRange] = useState('7');
	const [customStart, setCustomStart] = useState('');
	const [customEnd, setCustomEnd] = useState('');
	const [stats, setStats] = useState({});
	const [chartData, setChartData] = useState(sampleRaceData);
	const [isLoading, setIsLoading] = useState(false);

	const fetchStats = async () => {
		setIsLoading(true);
		try {
			// This would fetch from a stats endpoint when available
			// const data = await api.get('/api/stats');
			// setStats(data);

			// For now, using placeholder
			setStats({});
		} catch (error) {
			console.error('Failed to fetch stats:', error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchStats();
	}, [dateRange, customStart, customEnd]);

	const formatValue = (card, value) => {
		if (!value || value === '—') return card.defaultValue;
		if (card.isDate) {
			return new Date(value).toLocaleString();
		}
		if (card.suffix) {
			return `${value}${card.suffix}`;
		}
		return value.toLocaleString?.() || value;
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
				<div>
					<h2 className="text-2xl font-bold text-slate-800">Statistics</h2>
					<p className="text-slate-500 text-sm mt-1">
						Track your system performance and metrics
					</p>
				</div>
				<Button variant="outline" onClick={fetchStats} className="gap-2" disabled={isLoading}>
					<RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
					Refresh
				</Button>
			</div>

			{/* Date Range Selector */}
			<Card>
				<CardContent className="p-4">
					<div className="flex flex-col sm:flex-row gap-4 items-end">
						<div className="flex-1">
							<Label className="text-sm text-slate-600 mb-2 block">Date Range</Label>
							<Select value={dateRange} onValueChange={setDateRange}>
								<SelectTrigger>
									<SelectValue placeholder="Select range" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="1">Today</SelectItem>
									<SelectItem value="7">Last 7 days</SelectItem>
									<SelectItem value="30">Last 30 days</SelectItem>
									<SelectItem value="custom">Custom range</SelectItem>
								</SelectContent>
							</Select>
						</div>

						{dateRange === 'custom' && (
							<>
								<div className="flex-1">
									<Label className="text-sm text-slate-600 mb-2 block">Start Date</Label>
									<Input
										type="date"
										value={customStart}
										onChange={(e) => setCustomStart(e.target.value)}
									/>
								</div>
								<div className="flex-1">
									<Label className="text-sm text-slate-600 mb-2 block">End Date</Label>
									<Input
										type="date"
										value={customEnd}
										onChange={(e) => setCustomEnd(e.target.value)}
									/>
								</div>
							</>
						)}
					</div>
				</CardContent>
			</Card>

			{/* KPI Cards */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
				{kpiCards.map((card, index) => {
					const Icon = card.icon;
					const value = stats[card.key];

					return (
						<motion.div
							key={card.key}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: index * 0.05 }}
						>
							<Card className="overflow-hidden">
								<CardContent className="p-6">
									<div className="flex items-start justify-between">
										<div className="space-y-2">
											<p className="text-sm font-medium text-slate-500">{card.label}</p>
											<p className="text-3xl font-bold text-slate-800">
												{formatValue(card, value)}
											</p>
										</div>
										<div className={`p-3 rounded-xl bg-gradient-to-br ${card.color} text-white`}>
											<Icon className="w-5 h-5" />
										</div>
									</div>
								</CardContent>
							</Card>
						</motion.div>
					);
				})}
			</div>

			{/* Charts */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Races Over Time */}
				<Card>
					<CardHeader>
						<CardTitle className="text-lg font-semibold text-slate-700">
							Races Processed Over Time
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="h-72">
							<ResponsiveContainer width="100%" height="100%">
								<LineChart data={chartData}>
									<CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
									<XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
									<YAxis stroke="#94a3b8" fontSize={12} />
									<Tooltip
										contentStyle={{
											backgroundColor: '#fff',
											border: '1px solid #e2e8f0',
											borderRadius: '8px',
											boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
										}}
									/>
									<Legend />
									<Line
										type="monotone"
										dataKey="races"
										stroke="#f97316"
										strokeWidth={2}
										dot={{ fill: '#f97316', strokeWidth: 2, r: 4 }}
										activeDot={{ r: 6 }}
									/>
								</LineChart>
							</ResponsiveContainer>
						</div>
						<p className="text-xs text-slate-400 text-center mt-4">
							Sample data - connect to backend for real metrics
						</p>
					</CardContent>
				</Card>

				{/* Errors Over Time */}
				<Card>
					<CardHeader>
						<CardTitle className="text-lg font-semibold text-slate-700">
							Errors Over Time
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="h-72">
							<ResponsiveContainer width="100%" height="100%">
								<BarChart data={chartData}>
									<CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
									<XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
									<YAxis stroke="#94a3b8" fontSize={12} />
									<Tooltip
										contentStyle={{
											backgroundColor: '#fff',
											border: '1px solid #e2e8f0',
											borderRadius: '8px',
											boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
										}}
									/>
									<Legend />
									<Bar
										dataKey="errors"
										fill="#ef4444"
										radius={[4, 4, 0, 0]}
									/>
								</BarChart>
							</ResponsiveContainer>
						</div>
						<p className="text-xs text-slate-400 text-center mt-4">
							Sample data - connect to backend for real metrics
						</p>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}