import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type UserDetails = {
  access_token: string;
  refresh_token: string;
  permissions: string[];
  roles: string[];
};

type AuthState = {
  userDetails: UserDetails;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
};

const initialState: AuthState = {
  userDetails: {
    access_token: "",
    refresh_token: "",
    permissions: [],
    roles: []
  },
  isAuthenticated: false,
  isLoading: false,
  error: null
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<UserDetails>) => {
      console.log("Login Success Action Payload:", action.payload);
      state.userDetails = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
      console.log("Login Success - Updated State:", state);
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    },
    logOut: (state) => {
      state.userDetails = {
        access_token: "",
        refresh_token: "",
        permissions: [],
        roles: []
      };
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
    },
    updateTokens: (state, action: PayloadAction<{ access_token: string; refresh_token: string }>) => {
      state.userDetails.access_token = action.payload.access_token;
      state.userDetails.refresh_token = action.payload.refresh_token;
    }
  }
});

export const { loginStart, loginSuccess, loginFailure, logOut, updateTokens } = authSlice.actions;
export default authSlice.reducer;
