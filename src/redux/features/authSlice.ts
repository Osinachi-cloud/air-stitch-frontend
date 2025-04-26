import {createSlice, PayloadAction}  from '@reduxjs/toolkit';

type InitialState = {
    value: UserDetails;
}

type UserDetails = {
    access_token: string
    refresh_token: string
    permissions: string []
    roles: string []
}

type AuthState = {
    isAuth: boolean
    email: string
    role: string
    token: string
}

// const initialState = {
//     value: {
//         isAuth: false,
//         email: "",
//         role:"",
//         token: ""
//     } as AuthState
// } as InitialState

const initialState = {
    value: {
        access_token: "",
        refresh_token: "",
        permissions:[],
        roles: []
    } as UserDetails
} as InitialState

export const auth = createSlice({
    name: "auth",
    initialState:initialState,
    reducers: {
        logOut: () => {
            return initialState;
        },
        // login: (state, action: PayloadAction<string>) => {
        //     return {
        //         value: {
        //             isAuth: true,
        //             email: action.payload,
        //             role:"",
        //             token:""
        //         }
        //     }
        // },
        getAuthResponse: (state, action: PayloadAction<UserDetails>) => {
            console.log("=================");
            console.log(state);
            console.log("++++++++++++++++++");
            console.log(action);
            console.log("=================")

            return {
                value: {
                    access_token: action.payload.access_token,
                    refresh_token: action.payload.refresh_token,
                    permissions:action.payload.permissions,
                    roles: action.payload.roles
                }
            }
        }
    }
})

export const { logOut, getAuthResponse } = auth.actions;
export default auth.reducer;
