// This slices is for demonstration purpose
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../types";

interface currentUserState {
  currentUser: User | null;
}

const initialState: currentUserState = {
  currentUser: null,
};

export const CurrentUserSlice = createSlice({
  name: "currentUser",
  initialState,
  reducers: {
    changeUserName: (state, action: PayloadAction<{ name: string }>) => {
      if (state.currentUser) {
        state.currentUser.name = action.payload.name;
      }
    },
    changeExpoToken: (state, action: PayloadAction<{ expoToken: string }>) => {
      if (state.currentUser) {
        state.currentUser.expoToken = action.payload.expoToken;
      }
    },
    // Todos
  },
});

export default CurrentUserSlice.reducer;
export const { changeUserName } = CurrentUserSlice.actions;
