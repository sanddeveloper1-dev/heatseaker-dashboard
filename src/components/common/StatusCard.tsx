import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const statusConfig = {
	UP: {
		icon: CheckCircle,
		color: 'text-emerald-500',
		bg: 'bg-emerald-50',
		border: 'border-emerald-200',
		label: 'Healthy',
	},
	DOWN: {
		icon: XCircle,
		color: 'text-rose-500',
		bg: 'bg-rose-50',
		border: 'border-rose-200',
		label: 'Down',
	},
	ERROR: {
		icon: AlertTriangle,
		color: 'text-amber-500',
		bg: 'bg-amber-50',
		border: 'border-amber-200',
		label: 'Error',
	},
	LOADING: {
		icon: Loader2,
		color: 'text-slate-400',
		bg: 'bg-slate-50',
		border: 'border-slate-200',
		label: 'Checking...',
	},
};

export default function StatusCard({
	title,
	status = 'LOADING',
	message,
	timestamp,
	version,
	icon: CustomIcon,
	className = ''
}) {
	const config = statusConfig[status] || statusConfig.LOADING;
	const Icon = CustomIcon || config.icon;
	const isLoading = status === 'LOADING';

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
		>
			<Card className={`overflow-hidden ${className}`}>
				<CardHeader className="pb-2">
					<div className="flex items-center justify-between">
						<CardTitle className="text-base font-medium text-slate-600">
							{title}
						</CardTitle>
						<div className={`p-2 rounded-lg ${config.bg}`}>
							<Icon className={`w-5 h-5 ${config.color} ${isLoading ? 'animate-spin' : ''}`} />
						</div>
					</div>
				</CardHeader>
				<CardContent>
					<div className="space-y-3">
						<div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${config.bg} ${config.color} border ${config.border}`}>
							<span className={`w-2 h-2 rounded-full ${config.color.replace('text-', 'bg-')} ${isLoading ? '' : 'animate-pulse'}`} />
							{config.label}
						</div>

						{message && (
							<p className="text-sm text-slate-600 line-clamp-2">{message}</p>
						)}

						<div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-100">
							{timestamp && (
								<span>Updated: {new Date(timestamp).toLocaleTimeString()}</span>
							)}
							{version && (
								<span className="font-mono bg-slate-100 px-2 py-0.5 rounded">
									v{version}
								</span>
							)}
						</div>
					</div>
				</CardContent>
			</Card>
		</motion.div>
	);
}