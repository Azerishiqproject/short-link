import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import authReducer from "./slices/authSlice";
import linksReducer from "./slices/linksSlice";
import campaignsReducer from "./slices/campaignsSlice";
import usersReducer from "./slices/usersSlice";
import paymentsReducer from "./slices/paymentsSlice";
import supportReducer from "./slices/supportSlice";
import blogReducer from "./slices/blogSlice";
import referralReducer from "./slices/referralSlice";

export const store = configureStore({
  reducer: { auth: authReducer, links: linksReducer, campaigns: campaignsReducer, users: usersReducer, payments: paymentsReducer, support: supportReducer, blog: blogReducer, referral: referralReducer },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;


