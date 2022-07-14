import { createSlice } from "@reduxjs/toolkit";

export const otherBLESlice = createSlice({
  name: "otherBLE",
  initialState: {
    t_xy: {
      rpm: 5,
      x: 0,
      y: 0,
      start_laser: 1,
      end_laser: 1,
    },
    t_adjust: {
      rpm: 5,
      x: 0,
      y: 0,
      start_laser: 1,
      end_laser: 1,
    },
    t_00: {
      rpm: 5,
      start_laser: 1,
      end_laser: 1,
    },
    laser: 2,
    pause: 0,
  },
  reducers: {
    set_xy: (state, e) => {
      state.t_xy[e.payload.col] = e.payload.value;
    },
    set_adjust: (state, e) => {
      state.t_adjust[e.payload.col] = e.payload.value;
    },
    set_00: (state, e) => {
      state.t_00[e.payload.col] = e.payload.value;
    },
    set_laser: (state, val) => {
      state.laser = val.payload;
    },
    set_pause: (state, val) => {
      state.pause = val.payload;
    },
  },
});

export const { set_xy, set_adjust, set_00, set_laser, set_pause } =
  otherBLESlice.actions;

export default otherBLESlice.reducer;
