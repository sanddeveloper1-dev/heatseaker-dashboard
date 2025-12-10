import * as React from 'react';
import { cn } from '@/utils';

interface SelectContextValue {
  value: string;
  onValueChange: (value: string) => void;
}

const SelectContext = React.createContext<SelectContextValue | undefined>(undefined);

export interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
}

export function Select({ value, onValueChange, children }: SelectProps) {
  return (
    <SelectContext.Provider value={{ value, onValueChange }}>
      {children}
    </SelectContext.Provider>
  );
}

export interface SelectTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function SelectTrigger({ className, children, ...props }: SelectTriggerProps) {
  const context = React.useContext(SelectContext);
  const [isOpen, setIsOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (triggerRef.current && !triggerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  return (
    <button
      ref={triggerRef}
      type="button"
      onClick={() => setIsOpen(!isOpen)}
      className={cn(
        'flex h-10 w-full items-center justify-between rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm',
        'ring-offset-white placeholder:text-slate-400',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    >
      {children}
      <svg
        className="h-4 w-4 opacity-50"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  );
}

export interface SelectValueProps {
  placeholder?: string;
}

export function SelectValue({ placeholder }: SelectValueProps) {
  const context = React.useContext(SelectContext);
  const selectedItem = React.useMemo(() => {
    // Find selected item from SelectContent
    return null;
  }, []);

  return <span>{context?.value || placeholder || 'Select...'}</span>;
}

export interface SelectContentProps {
  children: React.ReactNode;
}

export function SelectContent({ children }: SelectContentProps) {
  const context = React.useContext(SelectContext);
  const [isOpen, setIsOpen] = React.useState(false);

  // This is a simplified version - in production, use a proper dropdown library
  return (
    <div className="absolute z-50 min-w-[8rem] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-md">
      {children}
    </div>
  );
}

export interface SelectItemProps {
  value: string;
  children: React.ReactNode;
}

export function SelectItem({ value, children }: SelectItemProps) {
  const context = React.useContext(SelectContext);
  
  return (
    <div
      className={cn(
        'relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none',
        'hover:bg-slate-100 focus:bg-slate-100',
        context?.value === value && 'bg-slate-100'
      )}
      onClick={() => context?.onValueChange(value)}
    >
      {children}
    </div>
  );
}
