import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  data: [],
  loading: true,
  err: false,
  now: false,
};

export const getNotifications = createAsyncThunk("get/Notifies", async () => {
  const getNotification = await axios.post(
    "http://localhost:9999/v2/order/notification",
    { user_id: JSON.parse(localStorage.getItem("manjamUser"))?.userId },
    { timeout: 8989898989 }
  );
  return getNotification?.data?.message;
});

const notSlice = createSlice({
  initialState,
  name: "OrderReducer",
  extraReducers: (builder) => {
    builder
      .addCase(getNotifications.fulfilled, (state, action) => {
        state.data.length = 0;
        if (action.payload && action.payload.length) {
          state.data.push(...action.payload);
        }
        state.now = true;
        state.loading = false;
      })
      .addCase(getNotifications.pending, (state, action) => {
        state.now = false;
        state.loading = true;
      })
      .addCase(getNotifications.rejected, (state, action) => {
        state.err = action.payload;
        state.now = false;
        state.loading = false;
      });
  },
  reducers: {
    updateOrder: (state, action) => {
      // state.data[0].amount = parseInt(state.data[0].amount) + action.payload;
      state.data[0].orderItems.map((item) => {
        // console.log(item.type);
        item.item_count =
          item.item_id == action.payload.item_id
            ? action.payload.type == "increase"
              ? parseInt(item.item_count) + 1
              : parseInt(item.item_count) !== 1
              ? parseInt(item.item_count) - 1
              : item.item_count
            : item.item_count;

        item.quntityprice =
          parseInt(item.item_count) * parseInt(item.single_price);
      });

      // getOrderDetails();
    },
    removeOrder: (state, action) => {
      state.data[0].orderItems.map();
      // getOrderDetails();
    },
  },
});

export const { updateOrder, removeOrder } = notSlice.actions;
export default notSlice.reducer;
