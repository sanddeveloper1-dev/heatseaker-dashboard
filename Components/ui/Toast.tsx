import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info, LucideIcon } from 'lucide-react';

interface Toast {
	id: number;
	message: string;
	type: 'success' | 'error' | 'warning' | 'info';
}

interface ToastContextType {
	success: (msg: string) => void;
	error: (msg: string) => void;
	warning: (msg: string) => void;
	info: (msg: string) => void;
}

const ToastContext = createContext<ToastContextType>({
	success: () => { },
	error: () => { },
	warning: () => { },
	info: () => { },
});

const icons = {
	success: CheckCircle,
	error: AlertCircle,
	warning: AlertTriangle,
	info: Info,
};

const colors = {
	success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
	error: 'bg-rose-50 border-rose-200 text-rose-800',
	warning: 'bg-amber-50 border-amber-200 text-amber-800',
	info: 'bg-blue-50 border-blue-200 text-blue-800',
};

const iconColors = {
	success: 'text-emerald-500',
	error: 'text-rose-500',
	warning: 'text-amber-500',
	info: 'text-blue-500',
};

export function ToastProvider({ children }: { children: ReactNode }) {
	const [toasts, setToasts] = useState<Toast[]>([]);

	const addToast = useCallback((message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info', duration = 5000) => {
		const id = Date.now();
		setToasts(prev => [...prev, { id, message, type }]);

		if (duration > 0) {
			setTimeout(() => {
				setToasts(prev => prev.filter(t => t.id !== id));
			}, duration);
		}
	}, []);

	const removeToast = useCallback((id: number) => {
		setToasts(prev => prev.filter(t => t.id !== id));
	}, []);

	const toast: ToastContextType = {
		success: (msg: string) => addToast(msg, 'success'),
		error: (msg: string) => addToast(msg, 'error'),
		warning: (msg: string) => addToast(msg, 'warning'),
		info: (msg: string) => addToast(msg, 'info'),
	};

	return (
		<ToastContext.Provider value={toast}>
			{children}
			<div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
				<AnimatePresence>
					{toasts.map(t => {
						const Icon: LucideIcon = icons[t.type];
						return (
							<motion.div
								key={t.id}
								initial={{ opacity: 0, y: -20, scale: 0.95 }}
								animate={{ opacity: 1, y: 0, scale: 1 }}
								exit={{ opacity: 0, x: 100, scale: 0.95 }}
								className={`flex items-start gap-3 p-4 rounded-xl border shadow-lg backdrop-blur-sm ${colors[t.type]}`}
							>
								<Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${iconColors[t.type]}`} />
								<p className="flex-1 text-sm font-medium">{t.message}</p>
								<button
									onClick={() => removeToast(t.id)}
									className="flex-shrink-0 p-1 hover:bg-black/5 rounded-lg transition-colors"
								>
									<X className="w-4 h-4" />
								</button>
							</motion.div>
						);
					})}
				</AnimatePresence>
			</div>
		</ToastContext.Provider>
	);
}

export function useToast() {
	const context = useContext(ToastContext);
	if (!context || !context.success) {
		throw new Error('useToast must be used within a ToastProvider');
	}
	return context;
}