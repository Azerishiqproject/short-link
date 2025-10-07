import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import authReducer from "./slices/authSlice";
import linksReducer from "./slices/linksSlice";
import campaignsReducer from "./slices/campaignsSlice";
import usersReducer from "./slices/usersSlice";
import paymentsReducer from "./slices/paymentsSlice";

export const store = configureStore({
  reducer: { auth: authReducer, links: linksReducer, campaigns: campaignsReducer, users: usersReducer, payments: paymentsReducer },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;


