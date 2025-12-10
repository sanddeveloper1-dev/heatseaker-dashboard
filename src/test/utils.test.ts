import { describe, it, expect } from 'vitest';
import { createPageUrl, cn } from '@/utils/utils';

describe('utils', () => {
  describe('createPageUrl', () => {
    it('should create a URL for a simple page name', () => {
      expect(createPageUrl('Dashboard')).toBe('/Dashboard');
    });

    it('should preserve query parameters', () => {
      expect(createPageUrl('RaceDetail?id=123')).toBe('/RaceDetail?id=123');
    });

    it('should handle page names with special characters', () => {
      expect(createPageUrl('ApiTest')).toBe('/ApiTest');
    });
  });

  describe('cn', () => {
    it('should combine class names', () => {
      expect(cn('class1', 'class2')).toBe('class1 class2');
    });

    it('should filter out falsy values', () => {
      expect(cn('class1', null, 'class2', undefined, false, 'class3')).toBe('class1 class2 class3');
    });

    it('should handle empty input', () => {
      expect(cn()).toBe('');
    });

    it('should handle single class', () => {
      expect(cn('single')).toBe('single');
    });
  });
});
