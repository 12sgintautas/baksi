import { createSlice } from "@reduxjs/toolkit";

export const BLESlice = createSlice({
  name: "BLE",
  initialState: {
    enabled: false,
    interval_id: null,
    connected: 0,
    x: 0,
    y: 0,
    rpm: 0,
    laser: 0,

    upload_speed: 1,
    upload_movement_type: 0,
    upload_wait_time: 0,
    upload_pasue_time: 1000,
  },
  reducers: {
    set_enabled: (state, enabled) => {
      state.enabled = enabled.payload;
    },
    set_connected: (state, connected) => {
      state.connected = connected.payload;
    },
    set_x: (state, x) => {
      state.x = x.payload;
    },
    set_y: (state, y) => {
      state.y = y.payload;
    },
    set_rpm: (state, rpm) => {
      state.rpm = rpm.payload;
    },
    set_laser: (state, laser) => {
      state.laser = laser.payload;
    },

    set_upload_speed: (state, val) => {
      state.upload_speed = val.payload;
    },

    set_upload_movement_type: (state, val) => {
      state.upload_movement_type = val.payload;
    },

    set_upload_wait_time: (state, val) => {
      state.upload_wait_time = val.payload;
    },

    set_upload_pasue_time: (state, val) => {
      state.upload_pasue_time = val.payload;
    },
  },
});

export const {
  set_upload_speed,
  set_upload_movement_type,
  set_upload_wait_time,
  set_upload_pasue_time,
  set_enabled,
  set_connected,
  set_x,
  set_y,
  set_rpm,
  set_laser,
} = BLESlice.actions;

export default BLESlice.reducer;
