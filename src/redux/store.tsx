import  { configureStore } from '@reduxjs/toolkit';
import authReducer from "./features/authSlice"
import { TypedUseSelectorHook, useSelector } from 'react-redux';
export const store = configureStore({
    reducer: {
        authReducer,
    },
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.getState;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
 