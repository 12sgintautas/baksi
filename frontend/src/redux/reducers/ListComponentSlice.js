import { createSlice } from "@reduxjs/toolkit";

export const ListComponentSlice = createSlice({
  name: "ListComponent",
  initialState: {
    coordinates: [{ id: 0, x: 0, y: 0, rpm: 1, wait: 0, laser: 1 }],
    movement_type: 0,
    rpm: 5,
    wait: 1000,
    laser: 1,
  },
  reducers: {
    add_coordinate: (state) => {
      if (state.coordinates.length > 0) {
        const id = Math.max(...state.coordinates.map((x) => x.id)) + 1;
        const element = state.coordinates.slice(-1)[0];
        const newElement = {
          id,
          x: element.x,
          y: element.y,
          rpm: element.rpm,
          wait: element.wait,
          laser: element.laser,
        };
        state.coordinates = [...state.coordinates, newElement];
      } else {
        state.coordinates = [{ id: 0, x: 0, y: 0, rpm: 1, wait: 0, laser: 1 }];
      }
    },
    add_coordinate_param: (state, e) => {
      const x = e.payload.x;
      const y = e.payload.y;
      if (state.coordinates.length > 0) {
        const id = Math.max(...state.coordinates.map((x) => x.id)) + 1;
        const element = state.coordinates.slice(-1)[0];
        const newElement = {
          id,
          x: x,
          y: y,
          rpm: element.rpm,
          wait: element.wait,
          laser: element.laser,
        };
        state.coordinates = [...state.coordinates, newElement];
      } else {
        state.coordinates = [{ id: 0, x: x, y: y, rpm: 1, wait: 0, laser: 1 }];
      }
    },
    edit_coordinate: (state, e) => {
      const element = state.coordinates.findIndex(
        (item) => item.id === e.payload.row
      );
      state.coordinates[element][e.payload.col] = e.payload.value;
    },
    swap_coordinate: (state, e) => {
      const items = Array.from(state.coordinates);
      const [reorderItem] = items.splice(e.payload.source, 1);
      items.splice(e.payload.destination, 0, reorderItem);
      state.coordinates = items;
    },
    delete_coordinate: (state, e) => {
      state.coordinates = state.coordinates.filter(
        (item) => item.id !== e.payload
      );
    },
    set_movement_type: (state, e) => {
      state.movement_type = e.payload;
    },
    set_rpm: (state, e) => {
      state.rpm = e.payload;
    },
    set_wait: (state, e) => {
      state.wait = e.payload;
    },
    set_laser: (state, e) => {
      state.laser = e.payload;
    },
  },
});

export const {
  add_coordinate_param,
  add_coordinate,
  edit_coordinate,
  swap_coordinate,
  delete_coordinate,
  set_movement_type,
  set_rpm,
  set_wait,
  set_laser,
} = ListComponentSlice.actions;

export default ListComponentSlice.reducer;
