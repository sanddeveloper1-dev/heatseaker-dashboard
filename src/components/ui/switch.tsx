import * as React from 'react';
import { cn } from '@/utils';

export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, checked, onCheckedChange, ...props }, ref) => {
    return (
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={checked}
          onChange={(e) => onCheckedChange?.(e.target.checked)}
          ref={ref}
          {...props}
        />
        <div
          className={cn(
            "w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-500 rounded-full peer",
            "peer-checked:after:translate-x-full peer-checked:after:border-white after:content-['']",
            "after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border",
            "after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500",
            className
          )}
        />
      </label>
    );
  }
);
Switch.displayName = 'Switch';

export { Switch };
