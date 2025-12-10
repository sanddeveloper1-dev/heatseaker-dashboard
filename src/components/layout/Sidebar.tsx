import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import {
	LayoutDashboard,
	ScrollText,
	BarChart3,
	Terminal,
	Trophy,
	BookOpen,
	ChevronLeft,
	Flame
} from 'lucide-react';
import { motion } from 'framer-motion';

const navItems = [
	{ name: 'Dashboard', icon: LayoutDashboard, page: 'Dashboard' },
	{ name: 'Logs', icon: ScrollText, page: 'Logs' },
	{ name: 'Statistics', icon: BarChart3, page: 'Statistics' },
	{ name: 'API Test', icon: Terminal, page: 'ApiTest' },
	{ name: 'Races', icon: Trophy, page: 'Races' },
	{ name: 'Documentation', icon: BookOpen, page: 'Documentation' },
];

import type { SidebarProps } from '@/types';

export default function Sidebar({ currentPage, isCollapsed, onToggle }: SidebarProps) {
	return (
		<motion.aside
			initial={false}
			animate={{ width: isCollapsed ? 80 : 280 }}
			className="fixed left-0 top-0 h-screen bg-slate-900 flex flex-col z-40"
		>
			{/* Logo */}
			<div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
				<Link to={createPageUrl('Dashboard')} className="flex items-center gap-3">
					<div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-rose-600 flex items-center justify-center">
						<Flame className="w-6 h-6 text-white" />
					</div>
					{!isCollapsed && (
						<motion.span
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							className="text-lg font-bold text-white tracking-tight"
						>
							HeatSeaker
						</motion.span>
					)}
				</Link>
				<button
					onClick={onToggle}
					className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
				>
					<motion.div animate={{ rotate: isCollapsed ? 180 : 0 }}>
						<ChevronLeft className="w-5 h-5" />
					</motion.div>
				</button>
			</div>

			{/* Navigation */}
			<nav className="flex-1 py-6 px-3 space-y-1">
				{navItems.map((item) => {
					const isActive = currentPage === item.page;
					const Icon = item.icon;

					return (
						<Link
							key={item.page}
							to={createPageUrl(item.page)}
							className={`
                flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200
                ${isActive
									? 'bg-gradient-to-r from-orange-500/20 to-rose-500/20 text-orange-400'
									: 'text-slate-400 hover:text-white hover:bg-slate-800'
								}
              `}
						>
							<Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-orange-400' : ''}`} />
							{!isCollapsed && (
								<motion.span
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									className="font-medium"
								>
									{item.name}
								</motion.span>
							)}
							{isActive && !isCollapsed && (
								<motion.div
									layoutId="activeIndicator"
									className="ml-auto w-1.5 h-1.5 rounded-full bg-orange-400"
								/>
							)}
						</Link>
					);
				})}
			</nav>

			{/* Version */}
			{!isCollapsed && (
				<div className="p-4 border-t border-slate-800">
					<p className="text-xs text-slate-500 text-center">
						Admin Panel v1.0.0
					</p>
				</div>
			)}
		</motion.aside>
	);
}