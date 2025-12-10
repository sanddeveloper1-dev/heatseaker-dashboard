import { useState, useEffect } from 'react';
import { ToastProvider } from '@/components/ui/Toast';
import Sidebar from '@/components/layout/Sidebar';
import TopNav from '@/components/layout/TopNat';
import { motion, AnimatePresence } from 'framer-motion';

// Page title mapping
const pageTitles = {
	Dashboard: 'Dashboard',
	Logs: 'System Logs',
	Statistics: 'Statistics',
	ApiTest: 'API Test Console',
	Races: 'Race Management',
	RaceDetail: 'Race Details',
	Documentation: 'Documentation',
};

import type { LayoutProps } from '@/types';

function AuthenticatedLayout({ children, currentPageName }: LayoutProps) {
	const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	// Check screen size on mount
	useEffect(() => {
		const checkWidth = () => {
			if (window.innerWidth < 1024) {
				setSidebarCollapsed(true);
			}
		};
		checkWidth();
		window.addEventListener('resize', checkWidth);
		return () => window.removeEventListener('resize', checkWidth);
	}, []);

	return (
		<div className="min-h-screen bg-slate-50">
			{/* Sidebar - Hidden on mobile by default */}
			<div className="hidden lg:block">
				<Sidebar
					currentPage={currentPageName}
					isCollapsed={sidebarCollapsed}
					onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
				/>
			</div>

			{/* Mobile sidebar overlay */}
			<AnimatePresence>
				{mobileMenuOpen && (
					<>
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className="fixed inset-0 bg-black/50 z-40 lg:hidden"
							onClick={() => setMobileMenuOpen(false)}
						/>
						<motion.div
							initial={{ x: -280 }}
							animate={{ x: 0 }}
							exit={{ x: -280 }}
							className="fixed left-0 top-0 z-50 lg:hidden"
						>
							<Sidebar
								currentPage={currentPageName}
								isCollapsed={false}
								onToggle={() => setMobileMenuOpen(false)}
							/>
						</motion.div>
					</>
				)}
			</AnimatePresence>

			{/* Main Content */}
			<div
				className={`
          transition-all duration-300
          ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-[280px]'}
        `}
			>
				<TopNav
					onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
					pageTitle={(pageTitles as Record<string, string>)[currentPageName] || currentPageName}
				/>

				<main className="p-6">
					<motion.div
						key={currentPageName}
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.2 }}
					>
						{children}
					</motion.div>
				</main>
			</div>
		</div>
	);
}

export default function Layout({ children, currentPageName }: LayoutProps) {
	return (
		<ToastProvider>
			<AuthenticatedLayout currentPageName={currentPageName}>
				{children}
			</AuthenticatedLayout>
		</ToastProvider>
	);
}