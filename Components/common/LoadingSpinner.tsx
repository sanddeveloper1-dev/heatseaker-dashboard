import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
	size?: 'sm' | 'md' | 'lg';
	text?: string;
	className?: string;
}

export default function LoadingSpinner({ size = 'md', text, className = '' }: LoadingSpinnerProps) {
	const sizes: Record<'sm' | 'md' | 'lg', string> = {
		sm: 'w-4 h-4',
		md: 'w-8 h-8',
		lg: 'w-12 h-12',
	};

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className={`flex flex-col items-center justify-center gap-3 ${className}`}
		>
			<Loader2 className={`${sizes[size]} text-orange-500 animate-spin`} />
			{text && (
				<p className="text-sm text-slate-500 font-medium">{text}</p>
			)}
		</motion.div>
	);
}