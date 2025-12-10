import React from 'react';
import { useToast } from '../ui/Toast';
import { User, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function TopNav({ onMobileMenuToggle, pageTitle }) {

	return (
		<header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-30">
			<div className="flex items-center gap-4">
				<button
					onClick={onMobileMenuToggle}
					className="lg:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-600"
				>
					<Menu className="w-5 h-5" />
				</button>
				<h1 className="text-xl font-semibold text-slate-800">
					{pageTitle || 'Dashboard'}
				</h1>
			</div>

			<div className="flex items-center gap-4">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="flex items-center gap-2">
							<div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-rose-600 flex items-center justify-center">
								<User className="w-4 h-4 text-white" />
							</div>
							<span className="hidden sm:inline text-sm font-medium text-slate-700">
								Admin
							</span>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-48">
						<div className="px-2 py-1.5">
							<p className="text-sm font-medium">Admin</p>
							<p className="text-xs text-slate-500">Administrator</p>
						</div>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</header>
	);
}