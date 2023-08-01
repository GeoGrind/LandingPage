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
    setCurrentUser: (state, action: PayloadAction<User | null>) => {
      state.currentUser = action.payload;
    },
    updateCurrentUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.currentUser) {
        state.currentUser = { ...state.currentUser, ...action.payload };
      }
    },
  },
});

export default CurrentUserSlice.reducer;
export const { setCurrentUser, updateCurrentUser } = CurrentUserSlice.actions;
