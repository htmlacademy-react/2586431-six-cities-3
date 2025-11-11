import { CITIES } from '../../constants';
import { TFiltersState } from './types';
import { createSlice } from '@reduxjs/toolkit';
import { changeCity, changeSort } from './actions';

const initialState: TFiltersState = {
  city: CITIES[0],
  sort: 'popular',
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // changeCity
    builder.addCase(changeCity, (state, action) => {
      state.city = action.payload;
    });

    // changeSort
    builder.addCase(changeSort, (state, action) => {
      state.sort = action.payload ?? 'popular';
    });
  },
});

export default filtersSlice;
