import React, { useState, useEffect } from 'react';
import { api } from '@/components/api/apiClient';
import StatusCard from '@/components/common/StatusCard';
import { motion } from 'framer-motion';
import {
	Activity,
	Database,
	RefreshCw,
	Trophy,
	TrendingUp,
	Clock,
	Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { HealthResponse, DatabaseHealthResponse, StatusValue } from '@/types';

export default function Dashboard() {
	type HealthStatus = 'UP' | 'DOWN' | 'ERROR' | 'LOADING';
	type HealthData = Omit<Partial<HealthResponse>, 'status'> & { status: HealthStatus };
	type DbHealthData = Omit<Partial<DatabaseHealthResponse>, 'status'> & { status: HealthStatus };
	const [healthData, setHealthData] = useState<HealthData>({ status: 'LOADING' });
	const [dbHealthData, setDbHealthData] = useState<DbHealthData>({ status: 'LOADING' });
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

	const fetchHealth = async () => {
		setIsRefreshing(true);
		try {
			const [health, dbHealth] = await Promise.all([
				api.get<HealthResponse>('/health').catch(err => ({ status: 'DOWN' as const, message: err.message || 'Health check failed', timestamp: new Date().toISOString(), version: '' })),
				api.get<DatabaseHealthResponse>('/health/db').catch(err => ({ status: 'DOWN' as const, message: err.message || 'Database health check failed', timestamp: new Date().toISOString(), version: '' })),
			]);

			const healthStatus: HealthStatus = (health.status === 'UP' || (health as any).status === 'ok' || (health as any).healthy ? 'UP' : (health.status === 'DOWN' || health.status === 'ERROR' ? health.status : 'DOWN'));
			setHealthData({
				status: healthStatus,
				message: health.message || 'System operational',
				timestamp: health.timestamp || new Date().toISOString(),
				version: health.version,
			});

			const dbHealthStatus: HealthStatus = (dbHealth.status === 'UP' || (dbHealth as any).status === 'ok' || (dbHealth as any).connected ? 'UP' : (dbHealth.status === 'DOWN' || dbHealth.status === 'ERROR' ? dbHealth.status : 'DOWN'));
			setDbHealthData({
				status: dbHealthStatus,
				message: dbHealth.message || 'Database connected',
				timestamp: dbHealth.timestamp || new Date().toISOString(),
			});

			setLastUpdated(new Date());
		} catch (error) {
			console.error('Failed to fetch health status:', error);
		} finally {
			setIsRefreshing(false);
		}
	};

	useEffect(() => {
		fetchHealth();
		const interval = setInterval(fetchHealth, 30000);
		return () => clearInterval(interval);
	}, []);

	const quickStats = [
		{ label: 'Races Today', value: '—', icon: Trophy, color: 'text-orange-500' },
		{ label: 'API Calls', value: '—', icon: Zap, color: 'text-blue-500' },
		{ label: 'Success Rate', value: '—', icon: TrendingUp, color: 'text-emerald-500' },
		{ label: 'Last Sync', value: '—', icon: Clock, color: 'text-purple-500' },
	];

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
				<div>
					<h2 className="text-2xl font-bold text-slate-800">System Overview</h2>
					<p className="text-slate-500 text-sm mt-1">
						Monitor your system health and key metrics
					</p>
				</div>
				<div className="flex items-center gap-3">
					{lastUpdated && (
						<span className="text-xs text-slate-400">
							Last updated: {lastUpdated.toLocaleTimeString()}
						</span>
					)}
					<Button
						variant="outline"
						size="sm"
						onClick={fetchHealth}
						disabled={isRefreshing}
						className="gap-2"
					>
						<RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
						Refresh
					</Button>
				</div>
			</div>

			{/* Health Status Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<StatusCard
					title="Application Health"
					status={healthData.status as StatusValue}
					message={healthData.message}
					timestamp={healthData.timestamp}
					version={healthData.version || ''}
					icon={Activity}
				/>
				<StatusCard
					title="Database Health"
					status={dbHealthData.status as StatusValue}
					message={dbHealthData.message}
					timestamp={dbHealthData.timestamp}
					version={dbHealthData.version || ''}
					icon={Database}
				/>
			</div>

			{/* Quick Stats */}
			<Card>
				<CardHeader>
					<CardTitle className="text-lg font-semibold text-slate-700">Quick Stats</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
						{quickStats.map((stat, index) => (
							<motion.div
								key={stat.label}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: index * 0.1 }}
								className="p-4 rounded-xl bg-slate-50 border border-slate-100"
							>
								<div className="flex items-center gap-3">
									<div className={`p-2 rounded-lg bg-white shadow-sm ${stat.color}`}>
										<stat.icon className="w-5 h-5" />
									</div>
									<div>
										<p className="text-2xl font-bold text-slate-800">{stat.value}</p>
										<p className="text-xs text-slate-500">{stat.label}</p>
									</div>
								</div>
							</motion.div>
						))}
					</div>
					<p className="text-xs text-slate-400 text-center mt-4">
						Statistics will be populated when connected to the backend
					</p>
				</CardContent>
			</Card>

			{/* System Info */}
			<Card>
				<CardHeader>
					<CardTitle className="text-lg font-semibold text-slate-700">System Information</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
						<div className="p-4 rounded-lg bg-slate-50">
							<p className="text-slate-500 mb-1">API Endpoint</p>
							<p className="font-mono text-slate-700 break-all">
								{typeof window !== 'undefined' ? 'http://localhost:8080' : '—'}
							</p>
						</div>
						<div className="p-4 rounded-lg bg-slate-50">
							<p className="text-slate-500 mb-1">Auto-Refresh</p>
							<p className="text-slate-700">Every 30 seconds</p>
						</div>
						<div className="p-4 rounded-lg bg-slate-50">
							<p className="text-slate-500 mb-1">Client Version</p>
							<p className="text-slate-700">1.0.0</p>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}