import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./api/auth/authApi";
import { productApi } from "./api/productApi";
import  darkModeSlice  from "./features/DarkModeSlice";
import { productSlice } from "./features/ProductSlice";
import { authSlice } from "./features/AuthSlice";
import userApi from "./api/UserApi";
import { usersSlice } from "./features/UsersSlice";
import { ordersSlice } from "./features/OrdersSlice";
import { cartApi } from "./api/cartApi";

const store = configureStore({
    reducer : {
        [authApi.reducerPath] : authApi.reducer,
        [productApi.reducerPath] : productApi.reducer,
        darkMode : darkModeSlice,
        products : productSlice.reducer,
        auth : authSlice.reducer,
        [userApi.reducerPath] : userApi.reducer,
        [cartApi.reducerPath] : cartApi.reducer,
        usersSlice : usersSlice.reducer,
        orders : ordersSlice.reducer,
    },
    middleware : getDefaultMiddleware => getDefaultMiddleware()
    .concat([authApi.middleware, productApi.middleware, userApi.middleware, cartApi.middleware])
})

export default store