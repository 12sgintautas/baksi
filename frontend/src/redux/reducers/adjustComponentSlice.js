import { createSlice } from "@reduxjs/toolkit";

export const adjustComponentSlice = createSlice({
  name: "adjustComponent",
  initialState: {
    amount: 10,
  },
  reducers: {
    set_amount: (state, amount) => {
      state.amount = amount.payload;
    },
  },
});

export const { set_amount } = adjustComponentSlice.actions;

export default adjustComponentSlice.reducer;
