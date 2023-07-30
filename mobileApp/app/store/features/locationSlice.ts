// This slices is for demonstration purpose
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Location } from "../../types";
interface locationState {
  location: Location | null;
}

const initialState: locationState = {
  location: null,
};

export const LocationSlice = createSlice({
  name: "expoToken",
  initialState,
  reducers: {
    addExpoToken: (state, action: PayloadAction<{ location: Location }>) => {
      state.location = action.payload.location;
    },
  },
});

export default LocationSlice.reducer;
export const { addExpoToken } = LocationSlice.actions;
