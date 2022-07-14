import { configureStore } from '@reduxjs/toolkit';
import adjustComponentSlice from './reducers/adjustComponentSlice';
import ListComponentSlice from './reducers/ListComponentSlice';
import BLESlice from './reducers/BLESlice';
import otherBLESlice from './reducers/otherBLESlice';
import ConstellationsSlice from './reducers/ConstellationsSlice';
import StarsSlice from './reducers/StarsSlice';

export default configureStore({
  reducer: {
    adjustComponent: adjustComponentSlice,
    ListComponent: ListComponentSlice,
    BLE: BLESlice,
    otherBLE: otherBLESlice,
    Constellations: ConstellationsSlice,
    Stars: StarsSlice
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: true
    })
});
