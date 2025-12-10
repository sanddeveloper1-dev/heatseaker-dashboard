import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';

const ToastContext = createContext({
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

export function ToastProvider({ children }) {
	const [toasts, setToasts] = useState([]);

	const addToast = useCallback((message, type = 'info', duration = 5000) => {
		const id = Date.now();
		setToasts(prev => [...prev, { id, message, type }]);

		if (duration > 0) {
			setTimeout(() => {
				setToasts(prev => prev.filter(t => t.id !== id));
			}, duration);
		}
	}, []);

	const removeToast = useCallback((id) => {
		setToasts(prev => prev.filter(t => t.id !== id));
	}, []);

	const toast = {
		success: (msg) => addToast(msg, 'success'),
		error: (msg) => addToast(msg, 'error'),
		warning: (msg) => addToast(msg, 'warning'),
		info: (msg) => addToast(msg, 'info'),
	};

	return (
		<ToastContext.Provider value={toast}>
			{children}
			<div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
				<AnimatePresence>
					{toasts.map(t => {
						const Icon = icons[t.type];
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