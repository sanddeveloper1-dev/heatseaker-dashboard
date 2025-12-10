// Utility functions

export function createPageUrl(page: string): string {
  // Handle query parameters
  if (page.includes('?')) {
    return `/${page}`;
  }
  return `/${page}`;
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
