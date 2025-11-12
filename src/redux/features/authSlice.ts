// import {createSlice, PayloadAction}  from '@reduxjs/toolkit';

// type InitialState = {
//     value: UserDetails;
// }

// type UserDetails = {
//     access_token: string
//     refresh_token: string
//     permissions: string []
//     roles: string []
// }

// type AuthState = {
//     isAuth: boolean
//     email: string
//     role: string
//     token: string
// }

// // const initialState = {
// //     value: {
// //         isAuth: false,
// //         email: "",
// //         role:"",
// //         token: ""
// //     } as AuthState
// // } as InitialState

// const initialState = {
//     value: {
//         access_token: "",
//         refresh_token: "",
//         permissions:[],
//         roles: []
//     } as UserDetails
// } as InitialState

// export const auth = createSlice({
//     name: "auth",
//     initialState:initialState,
//     reducers: {
//         logOut: () => {
//             return initialState;
//         },
//         // login: (state, action: PayloadAction<string>) => {
//         //     return {
//         //         value: {
//         //             isAuth: true,
//         //             email: action.payload,
//         //             role:"",
//         //             token:""
//         //         }
//         //     }
//         // },
//         loginSuccess: (state, action: PayloadAction<UserDetails>) => {
//             console.log("=================");
//             console.log("action payload :",action.payload);
//             console.log("++++++++++++++++++");
//             console.log("state.value", state.value);
//             console.log("=================")

//             return {
//                 value: {
//                     access_token: action.payload.access_token,
//                     refresh_token: action.payload.refresh_token,
//                     permissions:action.payload.permissions,
//                     roles: action.payload.roles
//                 }
//             }
//         }
//     }
// })

// export const { logOut, loginSuccess } = auth.actions;
// export default auth.reducer;


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
