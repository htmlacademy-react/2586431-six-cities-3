import { describe, it, expect } from 'vitest';
import { changeCity, changeSort } from '../actions';
import { USortingOptionValue } from '../../../constants';

describe('filters actions', () => {
  describe('changeCity', () => {
    it('should create action with correct type and payload', () => {
      const action = changeCity('Amsterdam');

      expect(action.type).toBe('city/change');
      expect(action.payload).toBe('Amsterdam');
    });

    it('should create action with different city', () => {
      const action = changeCity('Paris');

      expect(action.type).toBe('city/change');
      expect(action.payload).toBe('Paris');
    });
  });

  describe('changeSort', () => {
    it('should create action with correct type and payload for valid sort option', () => {
      const sortOption: USortingOptionValue = 'price-low-to-high';
      const action = changeSort(sortOption);

      expect(action.type).toBe('sort/change');
      expect(action.payload).toBe(sortOption);
    });

    it('should create action with undefined payload', () => {
      const action = changeSort(undefined);

      expect(action.type).toBe('sort/change');
      expect(action.payload).toBeUndefined();
    });

    it('should create action for all sort options', () => {
      const sortOptions: USortingOptionValue[] = [
        'popular',
        'price-low-to-high',
        'price-high-to-low',
        'top-rated-first',
      ];

      sortOptions.forEach((sortOption) => {
        const action = changeSort(sortOption);
        expect(action.type).toBe('sort/change');
        expect(action.payload).toBe(sortOption);
      });
    });
  });
});
