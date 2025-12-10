// Component Prop Types

import { LucideIcon } from 'lucide-react';
import { LogEntry } from './api';

// DataTable Types
export interface Column<T = any> {
  header: string;
  accessor: string | keyof T;
  render?: (value: any, row?: T) => React.ReactNode;
}

export interface DataTableProps<T = any> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
  pagination?: any;
  className?: string;
}

// StatusCard Types
export type StatusValue = 'UP' | 'DOWN' | 'ERROR' | 'LOADING';

export interface StatusCardProps {
  title: string;
  status?: StatusValue;
  message?: string;
  timestamp?: string;
  version?: string;
  icon?: LucideIcon;
  className?: string;
}

// JsonViewer Types
export interface JsonViewerProps {
  data: any;
  title?: string;
  className?: string;
}

// Layout Types
export interface LayoutProps {
  children: React.ReactNode;
  currentPageName: string;
}

export interface SidebarProps {
  currentPage: string;
  isCollapsed: boolean;
  onToggle: () => void;
}

export interface TopNavProps {
  onMobileMenuToggle: () => void;
  pageTitle: string;
}

// LogEntry Component Types
export interface LogEntryProps {
  log: LogEntry;
  isExpanded: boolean;
  onToggle: () => void;
}
