import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
    name : "auth",
    initialState : {user : null, token : null, isAuth : false},
    reducers : {
        addUser : (state, action) => {
            state.user = action.payload.user
            state.isAuth = true
        },

        addToken : (state, action) => {
            state.token = action.payload
            state.isAuth = true
        },

        removeAuth : (state) => {
            state.user = null
            state.token = null
            state.isAuth = false
        }
    }
})

export const {addUser, addToken, removeAuth} = authSlice.actions