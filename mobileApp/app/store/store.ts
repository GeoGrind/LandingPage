import { configureStore } from "@reduxjs/toolkit";
import { LocationSlice } from "./features/locationSlice";
import { CurrentUserSlice } from "./features/currentUserSlice";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

export const store = configureStore({
  reducer: {
    location: LocationSlice.reducer,
    currentUser: CurrentUserSlice.reducer,
  },
});

export const useAppDispatch: () => typeof store.dispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<
  ReturnType<typeof store.getState>
> = useSelector;
