import { createSlice } from "@reduxjs/toolkit";

const darkModeSlice = createSlice({
    name : "darkMode",
    initialState : {darkMode : false},
    reducers : ({
        changeMode : (state) => {
            state.darkMode = !state.darkMode
        }
    })
})

export const { changeMode } = darkModeSlice.actions

export default darkModeSlice.reducer