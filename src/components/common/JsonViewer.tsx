import { useState } from 'react';
import { ChevronDown, ChevronRight, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { JsonViewerProps } from '@/types';

function JsonNode({ data, depth = 0, initialExpanded = true }: { data: any; depth?: number; initialExpanded?: boolean }) {
	const [isExpanded, setIsExpanded] = useState(initialExpanded && depth < 2);

	if (data === null) {
		return <span className="text-slate-400">null</span>;
	}

	if (data === undefined) {
		return <span className="text-slate-400">undefined</span>;
	}

	if (typeof data === 'boolean') {
		return <span className="text-purple-600">{data.toString()}</span>;
	}

	if (typeof data === 'number') {
		return <span className="text-blue-600">{data}</span>;
	}

	if (typeof data === 'string') {
		return <span className="text-emerald-600">"{data}"</span>;
	}

	if (Array.isArray(data)) {
		if (data.length === 0) {
			return <span className="text-slate-500">[]</span>;
		}

		return (
			<div>
				<button
					onClick={() => setIsExpanded(!isExpanded)}
					className="inline-flex items-center gap-1 hover:bg-slate-100 rounded px-1 -ml-1"
				>
					{isExpanded ? (
						<ChevronDown className="w-3 h-3 text-slate-400" />
					) : (
						<ChevronRight className="w-3 h-3 text-slate-400" />
					)}
					<span className="text-slate-500">[{data.length}]</span>
				</button>
				{isExpanded && (
					<div className="ml-4 border-l border-slate-200 pl-3">
						{data.map((item, index) => (
							<div key={index} className="py-0.5">
								<span className="text-slate-400">{index}: </span>
								<JsonNode data={item} depth={depth + 1} />
							</div>
						))}
					</div>
				)}
			</div>
		);
	}

	if (typeof data === 'object') {
		const keys = Object.keys(data);
		if (keys.length === 0) {
			return <span className="text-slate-500">{'{}'}</span>;
		}

		return (
			<div>
				<button
					onClick={() => setIsExpanded(!isExpanded)}
					className="inline-flex items-center gap-1 hover:bg-slate-100 rounded px-1 -ml-1"
				>
					{isExpanded ? (
						<ChevronDown className="w-3 h-3 text-slate-400" />
					) : (
						<ChevronRight className="w-3 h-3 text-slate-400" />
					)}
					<span className="text-slate-500">{'{...}'}</span>
				</button>
				{isExpanded && (
					<div className="ml-4 border-l border-slate-200 pl-3">
						{keys.map((key) => (
							<div key={key} className="py-0.5">
								<span className="text-rose-600">"{key}"</span>
								<span className="text-slate-400">: </span>
								<JsonNode data={data[key]} depth={depth + 1} />
							</div>
						))}
					</div>
				)}
			</div>
		);
	}

	return <span className="text-slate-600">{String(data)}</span>;
}

export default function JsonViewer({ data, title, className = '' }: JsonViewerProps) {
	const [copied, setCopied] = useState(false);

	const handleCopy = async () => {
		await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<div className={`rounded-xl border border-slate-200 bg-slate-50 overflow-hidden ${className}`}>
			{title && (
				<div className="flex items-center justify-between px-4 py-2 border-b border-slate-200 bg-white">
					<span className="text-sm font-medium text-slate-600">{title}</span>
					<Button
						variant="ghost"
						size="sm"
						onClick={handleCopy}
						className="h-7 px-2"
					>
						{copied ? (
							<Check className="w-4 h-4 text-emerald-500" />
						) : (
							<Copy className="w-4 h-4" />
						)}
					</Button>
				</div>
			)}
			<div className="p-4 font-mono text-sm overflow-auto max-h-96">
				<JsonNode data={data} />
			</div>
		</div>
	);
}