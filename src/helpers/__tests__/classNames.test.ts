import { describe, it, expect } from 'vitest';
import { classNames } from '../class-names';

describe('classNames', () => {
  it('should return base class when classMap is empty', () => {
    const result = classNames('base-class', {});
    expect(result).toBe('base-class');
  });

  it('should return base class with additional classes when all are true', () => {
    const result = classNames('base-class', {
      'additional-1': true,
      'additional-2': true,
    });
    expect(result).toBe('base-class additional-1 additional-2');
  });

  it('should ignore classes with false values', () => {
    const result = classNames('base-class', {
      'additional-1': true,
      'additional-2': false,
      'additional-3': true,
    });
    expect(result).toBe('base-class additional-1 additional-3');
  });

  it('should handle all false values', () => {
    const result = classNames('base-class', {
      'additional-1': false,
      'additional-2': false,
    });
    expect(result).toBe('base-class');
  });

  it('should handle empty base class', () => {
    const result = classNames('', {
      'additional-1': true,
    });
    expect(result).toBe('additional-1');
  });

  it('should handle complex classMap', () => {
    const result = classNames('button', {
      'button--primary': true,
      'button--disabled': false,
      'button--large': true,
      'button--small': false,
    });
    expect(result).toBe('button button--primary button--large');
  });
});
