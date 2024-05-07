import { createSlice } from "@reduxjs/toolkit";

export const ordersSlice = createSlice({
    name : "ordersSlice",
    initialState : {orders : []},
    reducers : {
        setOrders : (state, action) => {
            state.orders = action.payload
        }
    }
})

export const {setOrders} = ordersSlice.actions