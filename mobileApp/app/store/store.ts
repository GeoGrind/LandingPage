import { configureStore } from "@reduxjs/toolkit";
import { ExpoTokenSlice } from "./features/expoTokenSlice";
import { LocationSlice } from "./features/locationSlice";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

export const store = configureStore({
  reducer: {
    expoToken: ExpoTokenSlice.reducer,
    location: LocationSlice.reducer,
  },
});

export const useAppDispatch: () => typeof store.dispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<
  ReturnType<typeof store.getState>
> = useSelector;
