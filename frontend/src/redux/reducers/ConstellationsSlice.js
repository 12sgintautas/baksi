import { createSlice } from "@reduxjs/toolkit";

export const ConstellationsSlice = createSlice({
  name: "Constellations",
  initialState: {
    constellations: [],
  },
  reducers: {
    init_constellations: (state, constellations) => {
      state.constellations = constellations.payload;
    },
    add_constellations: (state, constellation) => {
      state.constellations = [...state.constellations, constellation.payload];
    },
    remove_constellations: (state, id) => {
      state.constellations = state.constellations.filter(
        (item) => item.id !== id.payload
      );
    },
    edit_constellations: (state, constellation) => {
      const c = state.constellations.findIndex(
        (item) => item.id === constellation.payload.id
      );
      state.constellations[c] = constellation.payload;
    },
  },
});

export const {
  edit_constellations,
  init_constellations,
  add_constellations,
  remove_constellations,
} = ConstellationsSlice.actions;

export default ConstellationsSlice.reducer;
