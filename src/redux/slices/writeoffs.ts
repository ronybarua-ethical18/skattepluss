/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface savingState {
  businessSavings: number;
  personalSavings: number;
}

const initialState: savingState = {
  businessSavings: 0,
  personalSavings: 0,
};

const wirteOffsSlice = createSlice({
  name: 'writeOffs',
  initialState,
  reducers: {
    updateBusinesSavings(state, { payload }: PayloadAction<number>) {
      state.businessSavings = payload;
    },
    updatePersonalSavings(state, { payload }: PayloadAction<number>) {
      state.personalSavings = payload;
    },
  },
});

export const { updateBusinesSavings, updatePersonalSavings } =
  wirteOffsSlice.actions;

export const savingsSelector = (state: RootState) => state.writeOffs;

export default wirteOffsSlice.reducer;
