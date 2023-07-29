// This slices is for demonstration purpose
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface expoTokenState {
  expoToken: string;
}

const initialState: expoTokenState = {
  expoToken: "",
};

export const ExpoTokenSlice = createSlice({
  name: "expoToken",
  initialState,
  reducers: {
    addExpoToken: (state, action: PayloadAction<{ token: string }>) => {
      state.expoToken = action.payload.token;
    },
  },
});

export default ExpoTokenSlice.reducer;
export const { addExpoToken } = ExpoTokenSlice.actions;
