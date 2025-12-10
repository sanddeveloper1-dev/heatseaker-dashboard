import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import LoadingSpinner from '@/components/common/LoadingSpinner';

describe('LoadingSpinner', () => {
  it('should render with default size', () => {
    const { container } = render(<LoadingSpinner />);
    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('should render with text', () => {
    render(<LoadingSpinner text="Loading..." />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const { container } = render(<LoadingSpinner className="custom-class" />);
    const spinner = container.querySelector('.custom-class');
    expect(spinner).toBeInTheDocument();
  });

  it('should render with different sizes', () => {
    const { container, rerender } = render(<LoadingSpinner size="sm" />);
    expect(container.querySelector('.w-4')).toBeInTheDocument();

    rerender(<LoadingSpinner size="md" />);
    expect(container.querySelector('.w-8')).toBeInTheDocument();

    rerender(<LoadingSpinner size="lg" />);
    expect(container.querySelector('.w-12')).toBeInTheDocument();
  });
});
