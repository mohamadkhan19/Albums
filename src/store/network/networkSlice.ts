import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import type {RootState} from '..';
import {Network} from './networkTypes';

export const networkInitialState = null as Partial<Network> | null;

const slice = createSlice({
  name: 'network',
  initialState: networkInitialState,
  reducers: {
    resetNetwork: () => networkInitialState,
    setNetworkStatus: (state, action: PayloadAction<Partial<Network>>) => {
      return (state = {...action.payload});
    },
  },
});

export const {resetNetwork, setNetworkStatus} = slice.actions;
export default slice.reducer;

export const getNetworkStatus = (state: RootState) => state.network?.isOnline;
