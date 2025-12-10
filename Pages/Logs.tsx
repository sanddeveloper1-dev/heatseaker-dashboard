import React, { useState, useEffect, useRef } from 'react';
import { api } from '@/components/api/apiClient';
import { motion, AnimatePresence } from 'framer-motion';
import {
	RefreshCw,
	Search,
	Download,
	Play,
	Pause,
	AlertCircle,
	AlertTriangle,
	Info,
	ChevronDown,
	ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const levelConfig = {
	error: { icon: AlertCircle, color: 'bg-rose-100 text-rose-700 border-rose-200' },
	warn: { icon: AlertTriangle, color: 'bg-amber-100 text-amber-700 border-amber-200' },
	info: { icon: Info, color: 'bg-blue-100 text-blue-700 border-blue-200' },
};

function LogEntry({ log, isExpanded, onToggle }) {
	const config = levelConfig[log.level] || levelConfig.info;
	const Icon = config.icon;

	return (
		<motion.div
			initial={{ opacity: 0, x: -20 }}
			animate={{ opacity: 1, x: 0 }}
			className="border-b border-slate-100 last:border-0"
		>
			<div
				className="flex items-start gap-4 p-4 hover:bg-slate-50 cursor-pointer transition-colors"
				onClick={onToggle}
			>
				<div className="flex-shrink-0 mt-0.5">
					{log.context ? (
						isExpanded ? (
							<ChevronDown className="w-4 h-4 text-slate-400" />
						) : (
							<ChevronRight className="w-4 h-4 text-slate-400" />
						)
					) : (
						<div className="w-4" />
					)}
				</div>

				<Badge variant="outline" className={`${config.color} flex-shrink-0`}>
					<Icon className="w-3 h-3 mr-1" />
					{log.level.toUpperCase()}
				</Badge>

				<div className="flex-1 min-w-0">
					<p className="text-sm text-slate-700 break-words">{log.message}</p>
				</div>

				<span className="text-xs text-slate-400 flex-shrink-0 font-mono">
					{new Date(log.timestamp || log.created_date).toLocaleTimeString()}
				</span>
			</div>

			<AnimatePresence>
				{isExpanded && log.context && (
					<motion.div
						initial={{ height: 0, opacity: 0 }}
						animate={{ height: 'auto', opacity: 1 }}
						exit={{ height: 0, opacity: 0 }}
						className="overflow-hidden"
					>
						<div className="px-4 pb-4 ml-12">
							<pre className="p-3 rounded-lg bg-slate-900 text-slate-100 text-xs overflow-x-auto">
								{JSON.stringify(log.context, null, 2)}
							</pre>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</motion.div>
	);
}

export default function Logs() {
	const [logs, setLogs] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [level, setLevel] = useState('all');
	const [search, setSearch] = useState('');
	const [autoRefresh, setAutoRefresh] = useState(false);
	const [expandedLogs, setExpandedLogs] = useState(new Set());
	const intervalRef = useRef(null);

	const fetchLogs = async () => {
		try {
			const params = new URLSearchParams();
			if (level !== 'all') params.append('level', level);
			if (search) params.append('search', search);
			params.append('limit', '100');

			const data = await api.get(`/api/logs?${params.toString()}`);
			setLogs(Array.isArray(data) ? data : data.logs || []);
		} catch (error) {
			// If logs endpoint doesn't exist, show sample data
			setLogs([
				{ id: 1, level: 'info', message: 'Logs endpoint not configured - showing sample data', timestamp: new Date().toISOString() },
				{ id: 2, level: 'warn', message: 'Connect to backend /api/logs to see real logs', timestamp: new Date().toISOString() },
			]);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchLogs();
	}, [level]);

	useEffect(() => {
		if (autoRefresh) {
			intervalRef.current = setInterval(fetchLogs, 10000);
		} else {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
		}
		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
		};
	}, [autoRefresh, level, search]);

	const handleSearch = (e) => {
		e.preventDefault();
		fetchLogs();
	};

	const handleExport = () => {
		const blob = new Blob([JSON.stringify(logs, null, 2)], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `logs-${new Date().toISOString().split('T')[0]}.json`;
		a.click();
		URL.revokeObjectURL(url);
	};

	const toggleExpand = (logId) => {
		setExpandedLogs(prev => {
			const next = new Set(prev);
			if (next.has(logId)) {
				next.delete(logId);
			} else {
				next.add(logId);
			}
			return next;
		});
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
				<div>
					<h2 className="text-2xl font-bold text-slate-800">System Logs</h2>
					<p className="text-slate-500 text-sm mt-1">
						View and filter application logs
					</p>
				</div>
			</div>

			{/* Controls */}
			<div className="bg-white rounded-xl border border-slate-200 p-4">
				<div className="flex flex-col lg:flex-row gap-4">
					{/* Search */}
					<form onSubmit={handleSearch} className="flex-1">
						<div className="relative">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
							<Input
								type="text"
								placeholder="Search logs..."
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								className="pl-10"
							/>
						</div>
					</form>

					{/* Level Filter */}
					<Select value={level} onValueChange={setLevel}>
						<SelectTrigger className="w-full lg:w-40">
							<SelectValue placeholder="Filter by level" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Levels</SelectItem>
							<SelectItem value="info">Info</SelectItem>
							<SelectItem value="warn">Warning</SelectItem>
							<SelectItem value="error">Error</SelectItem>
						</SelectContent>
					</Select>

					{/* Auto-refresh Toggle */}
					<div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50">
						<Switch
							id="auto-refresh"
							checked={autoRefresh}
							onCheckedChange={setAutoRefresh}
						/>
						<Label htmlFor="auto-refresh" className="text-sm text-slate-600 cursor-pointer">
							{autoRefresh ? (
								<span className="flex items-center gap-1">
									<Play className="w-3 h-3" /> Auto-refresh
								</span>
							) : (
								<span className="flex items-center gap-1">
									<Pause className="w-3 h-3" /> Paused
								</span>
							)}
						</Label>
					</div>

					{/* Actions */}
					<div className="flex gap-2">
						<Button variant="outline" onClick={fetchLogs} className="gap-2">
							<RefreshCw className="w-4 h-4" />
							Refresh
						</Button>
						<Button variant="outline" onClick={handleExport} className="gap-2">
							<Download className="w-4 h-4" />
							Export
						</Button>
					</div>
				</div>
			</div>

			{/* Logs List */}
			<div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
				{isLoading ? (
					<div className="p-12">
						<LoadingSpinner text="Loading logs..." />
					</div>
				) : logs.length === 0 ? (
					<div className="p-12 text-center">
						<Info className="w-12 h-12 text-slate-300 mx-auto mb-4" />
						<p className="text-slate-500">No logs found</p>
						<p className="text-sm text-slate-400 mt-1">
							Try adjusting your filters or refresh
						</p>
					</div>
				) : (
					<div className="divide-y divide-slate-100">
						{logs.map((log, index) => (
							<LogEntry
								key={log.id || index}
								log={log}
								isExpanded={expandedLogs.has(log.id || index)}
								onToggle={() => toggleExpand(log.id || index)}
							/>
						))}
					</div>
				)}
			</div>
		</div>
	);
}