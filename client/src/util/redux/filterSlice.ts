/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './store';

export interface FilterState {
  filters: any;
}

interface PayloadFilter {
  filters: any;
}

const initialStateFilters = {
  filters: {},
} as FilterState;

const filtersSlice = createSlice({
  name: 'filters',
  initialState: initialStateFilters,
  reducers: {
    load: (state, action: PayloadAction<PayloadFilter>) => {
      state.filters = action.payload.filters;
    },
  },
});

export const { load } = filtersSlice.actions;
export default filtersSlice.reducer;

export const selectFilters = (state: RootState) => state.filters;
