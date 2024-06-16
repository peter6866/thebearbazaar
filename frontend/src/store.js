import { configureStore } from "@reduxjs/toolkit";
import bidReducer from "./features/bidSlice";

const store = configureStore({
  reducer: {
    bid: bidReducer,
  },
});

export default store;
