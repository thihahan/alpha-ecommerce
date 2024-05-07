import { createSlice } from "@reduxjs/toolkit";

export const usersSlice = createSlice({
    name : "usersSlice",
    initialState : { users : [], currentUser : {}},
    reducers : {
        addUsers : (state, action) => {
            state.users = action.payload
        },

        addCurrentUser : (state, action) => {
            state.currentUser = action.payload
        },

        removeUsers : (state, action) => {
            state.users = []
            state.currentUser = {}
        },

        changeUser : (state, action) => {
            const changedUser = action.payload?.newUser
            state.users = state.users.map(user => {
                if(user.id == changedUser?.id){
                    return changedUser
                }
                return user
            } )
        },

        removeUser : (state, action) => {
            const id = action.payload.id
            state.users = state.users.filter(user => user.id != id)
        }



    }
})

export const { addUsers, addCurrentUser, removeUsers, changeUser, removeUser } = usersSlice.actions