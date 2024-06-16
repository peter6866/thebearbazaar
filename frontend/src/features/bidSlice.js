import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  hasBid: false,
  isMatched: false,
};

const bidSlice = createSlice({
  name: "bid",
  initialState,
  reducers: {
    setHasBid(state, action) {
      state.hasBid = action.payload;
    },
    setIsMatched(state, action) {
      state.isMatched = action.payload;
    },
  },
});

export const { setHasBid, setIsMatched } = bidSlice.actions;

export default bidSlice.reducer;

export const selectHasBid = (state) => state.bid.hasBid;

export const selectIsMatched = (state) => state.bid.isMatched;
