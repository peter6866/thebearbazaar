import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchInitialData = createAsyncThunk(
  "bid/fetchInitialData",
  async ({ authToken, config }, { rejectWithValue }) => {
    if (!authToken) {
      return rejectWithValue("Unauthorized");
    }

    try {
      let isMatched = false;
      let hasBid = false;
      let matchedType, email, phoneNum, price;
      let bidType, bidPrice;

      const matchResponse = await axios.post(
        `${config.REACT_APP_API_URL}/v1/match/match-info`,
        {},
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (matchResponse.status === 200 && matchResponse.data.data) {
        isMatched = true;
        const matchDetails = matchResponse.data.data.matchDetails;
        matchedType = matchDetails.matchedType;
        email = matchDetails.email;
        phoneNum = matchDetails.phoneNum;
        price = matchDetails.price;
      }

      const bidResponse = await axios.get(
        `${config.REACT_APP_API_URL}/v1/bids/get-bid`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (bidResponse.status === 200 && bidResponse.data.hasBid) {
        bidType = bidResponse.data.trans;
        bidPrice = bidResponse.data.price;
        hasBid = true;
      }

      return {
        isMatched,
        hasBid,
        matchedType,
        email,
        phoneNum,
        price,
        bidType,
        bidPrice,
      };
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const initialState = {
  hasBid: false,
  isMatched: false,
  matchedType: "",
  matchedEmail: "",
  matchedPhone: "",
  matchedPrice: 0,
  bidType: "",
  bidPrice: 0,
  loading: false,
  error: null,
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
    setBidType(state, action) {
      state.bidType = action.payload;
    },
    setBidPrice(state, action) {
      state.bidPrice = action.payload;
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(fetchInitialData.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInitialData.fulfilled, (state, action) => {
        state.loading = false;
        state.hasBid = action.payload.hasBid;
        state.isMatched = action.payload.isMatched;
        state.matchedType = action.payload.matchedType;
        state.matchedEmail = action.payload.email;
        state.matchedPhone = action.payload.phoneNum;
        state.matchedPrice = action.payload.price;
        state.bidType = action.payload.bidType;
        state.bidPrice = action.payload.bidPrice;
      })
      .addCase(fetchInitialData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
        state.isMatched = false;
        state.hasBid = false;
      }),
});

export const { setHasBid, setIsMatched, setBidType, setBidPrice } =
  bidSlice.actions;

export default bidSlice.reducer;

export const selectHasBid = (state) => state.bid.hasBid;
export const selectIsMatched = (state) => state.bid.isMatched;
export const selectLoading = (state) => state.bid.loading;
export const selectError = (state) => state.bid.error;
export const selectMatchedType = (state) => state.bid.matchedType;
export const selectMatchedEmail = (state) => state.bid.matchedEmail;
export const selectMatchedPhone = (state) => state.bid.matchedPhone;
export const selectMatchedPrice = (state) => state.bid.matchedPrice;
export const selectBidType = (state) => state.bid.bidType;
export const selectBidPrice = (state) => state.bid.bidPrice;
