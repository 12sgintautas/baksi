import { createSlice } from "@reduxjs/toolkit";

export const StarsSlice = createSlice({
  name: "Stars",
  initialState: {
    stars: [],
  },
  reducers: {
    init_stars: (state, stars) => {
      state.stars = stars.payload;
    },
    add_star: (state, star) => {
      state.stars = [...state.stars, star.payload];
    },
    edit_star: (state, star) => {
      const s = state.stars.findIndex((item) => item.id === star.payload.id);
      state.stars[s] = star.payload;
    },
    remove_star: (state, id) => {
      state.stars = state.stars.filter((item) => item.id !== id.payload);
    },
  },
});

export const { init_stars, add_star, remove_star, edit_star } =
  StarsSlice.actions;

export default StarsSlice.reducer;
