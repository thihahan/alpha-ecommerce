import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

export const productSlice = createSlice({
    name : "productSlice",
    initialState : {originalProducts : [], 
        cart : [],
        orderCart : [],
        orders : [],
        selectCategory : "",
        totalProducts : 0
    },
    reducers : {
        addCart : (state, action) => {
            const cartItem = action?.payload?.cartItem
            state.cart.push(cartItem)
        },

        addOrderCart : (state, action) => {
            state.orderCart = action.payload
        },

        removeCart : (state, action) => {
            if(action.payload.quantity == 1){
                state.cart = state.cart.filter(ele => ele.id != action.payload.id)
            }else{
                state.cart = state.cart.map(ele => {
                    if(ele.id == action.payload.id){
                        return {...ele, quantity : ele.quantity - 1}
                    }
                    return ele
                })
            }
        },


        deleteItemFromCart : (state, action) => {
            state.cart = state.cart.filter(cartItem => cartItem.id != action.payload.id)
            // Cookies.set("cart", JSON.stringify(state.cart))
        },

        removeOrderCart : (state) => {
            state.orderCart = []
        },

        removeOrderCartById: (state, action) => {
            const id = action.payload?.id 
            state.orderCart = state.orderCart.filter(cartItem => cartItem.id != id)
        },

        replaceCart : (state, action) => {
            state.cart = action?.payload?.cart
        },

        //orders
        setOrders : (state, action) => {
            state.orders = action.payload
        },

        removeAll : (state, action) => {
            state.cart = []
            state.orderCart = [] 
            state.orders = []
        },

        addTotalProducts : (state, action) => {
            
        }

    }
})

export const {deleteItemFromCart, addCart, removeCart, replaceCart,
    addOrderCart, removeOrderCart,
    setOrders, removeOrderCartById, removeAll, addTotalProducts} = productSlice.actions 