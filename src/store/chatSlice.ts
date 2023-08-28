import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "Chat",
  initialState: "",
  reducers: {
    setChatId: (undefne, action) => {
      return action.payload;
    },
  },
});

export const { setChatId } = chatSlice.actions;
export default chatSlice.reducer;
