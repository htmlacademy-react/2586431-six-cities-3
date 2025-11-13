import { describe, it, expect } from 'vitest';
import filtersSlice from '../slice';
import { changeCity, changeSort } from '../actions';
import { CITIES } from '../../../constants';

describe('filtersSlice', () => {
  const initialState = filtersSlice.getInitialState();

  it('should return initial state', () => {
    expect(initialState).toEqual({
      city: CITIES[0],
      sort: 'popular',
    });
  });

  it('should change city', () => {
    const state = filtersSlice.reducer(initialState, changeCity('Amsterdam'));
    expect(state.city).toBe('Amsterdam');
  });

  it('should change sort', () => {
    const state = filtersSlice.reducer(
      initialState,
      changeSort('price-low-to-high')
    );
    expect(state.sort).toBe('price-low-to-high');
  });

  it('should reset sort to popular when undefined', () => {
    const stateWithSort = filtersSlice.reducer(
      initialState,
      changeSort('price-high-to-low')
    );
    const state = filtersSlice.reducer(stateWithSort, changeSort(undefined));
    expect(state.sort).toBe('popular');
  });
});
