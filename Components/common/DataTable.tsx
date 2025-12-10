import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export default function DataTable({
	columns,
	data,
	isLoading,
	onRowClick,
	emptyMessage = 'No data available',
	pagination,
	className = '',
}) {
	if (isLoading) {
		return (
			<div className={`rounded-xl border border-slate-200 overflow-hidden ${className}`}>
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead className="bg-slate-50 border-b border-slate-200">
							<tr>
								{columns.map((col, i) => (
									<th key={i} className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
										{col.header}
									</th>
								))}
							</tr>
						</thead>
						<tbody className="divide-y divide-slate-100 bg-white">
							{[...Array(5)].map((_, i) => (
								<tr key={i}>
									{columns.map((_, j) => (
										<td key={j} className="px-4 py-3">
											<Skeleton className="h-5 w-full" />
										</td>
									))}
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		);
	}

	if (!data || data.length === 0) {
		return (
			<div className={`rounded-xl border border-slate-200 bg-white p-12 text-center ${className}`}>
				<p className="text-slate-500">{emptyMessage}</p>
			</div>
		);
	}

	return (
		<div className={`rounded-xl border border-slate-200 overflow-hidden ${className}`}>
			<div className="overflow-x-auto">
				<table className="w-full">
					<thead className="bg-slate-50 border-b border-slate-200">
						<tr>
							{columns.map((col, i) => (
								<th
									key={i}
									className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider"
									style={{ width: col.width }}
								>
									{col.header}
								</th>
							))}
						</tr>
					</thead>
					<tbody className="divide-y divide-slate-100 bg-white">
						{data.map((row, rowIndex) => (
							<motion.tr
								key={row.id || rowIndex}
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ delay: rowIndex * 0.02 }}
								onClick={() => onRowClick?.(row)}
								className={`
                  ${onRowClick ? 'cursor-pointer hover:bg-slate-50' : ''}
                  transition-colors
                `}
							>
								{columns.map((col, colIndex) => (
									<td key={colIndex} className="px-4 py-3 text-sm text-slate-700">
										{col.render ? col.render(row[col.accessor], row) : row[col.accessor]}
									</td>
								))}
							</motion.tr>
						))}
					</tbody>
				</table>
			</div>

			{pagination && (
				<div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 bg-slate-50">
					<p className="text-sm text-slate-500">
						Showing {pagination.from} to {pagination.to} of {pagination.total} results
					</p>
					<div className="flex items-center gap-2">
						<Button
							variant="outline"
							size="sm"
							onClick={pagination.onPrev}
							disabled={pagination.page <= 1}
						>
							<ChevronLeft className="w-4 h-4" />
						</Button>
						<span className="text-sm text-slate-600 px-2">
							Page {pagination.page} of {pagination.totalPages}
						</span>
						<Button
							variant="outline"
							size="sm"
							onClick={pagination.onNext}
							disabled={pagination.page >= pagination.totalPages}
						>
							<ChevronRight className="w-4 h-4" />
						</Button>
					</div>
				</div>
			)}
		</div>
	);
}