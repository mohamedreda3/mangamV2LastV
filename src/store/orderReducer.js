import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  data: [],
  loading: true,
  err: false
};

export const getOrderDetails = createAsyncThunk("get/order", async () => {
  const getOrderDetails = await axios.get(
    "https://camp-coding.online/roma_store/admin/order/select_all_orders.php",{timeout:8989898989}
  );
  return getOrderDetails?.data?.message;
});

const orderSlice = createSlice({
  initialState,
  name: "OrderReducer",
  extraReducers: (builder) => {
    builder
      .addCase(getOrderDetails.fulfilled, (state, action) => {
        state.data.length = 0;
        state.data.push(action.payload[3]);
        state.data[0].orderItems.map((item) => {
          item.quntityprice =
            parseInt(item.item_count) * parseInt(item.single_price);
        });
        state.loading = false;
      })
      .addCase(getOrderDetails.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getOrderDetails.rejected, (state, action) => {
        state.err = action.payload;
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
      getOrderDetails();
    }
  }
});

export const { updateOrder, removeOrder } = orderSlice.actions;
export default orderSlice.reducer;
