import { combineReducers } from '@reduxjs/toolkit';
import questionnaireSlice from './slices/questionnaire';
import wirteOffsSlice from './slices/writeoffs';

export const reducer = combineReducers({
  questionnaire: questionnaireSlice,
  writeOffs: wirteOffsSlice,
  // Add other reducers here
});
