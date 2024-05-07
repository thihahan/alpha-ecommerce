import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import Cookies from "js-cookie";

export const cartApi = createApi({
    reducerPath : "cartApi",
    baseQuery : fetchBaseQuery({baseUrl : "http://localhost:8000/api/"}),
    tagTypes : ["Cart"],
    endpoints : builder => ({
        getCart : builder.query({
            query : (token) => ({
                url : "/cart",
                headers : {"Authorization" : `Bearer ${token}`}
            }),
            providesTags : ["Cart"]
        }),
        addCart : builder.mutation({
            query : (data) => ({
                url : "/cart",
                method : "POST",
                body : data,
                headers : {"Authorization" : `Bearer ${Cookies.get("token")}`}
            }),
            invalidatesTags : ["Cart"]
        }),
        deleteCart : builder.mutation({
            query : (id) => ({
                url : `/cart/${id}`,
                method : "DELETE",
                headers : {"Authorization" : `Bearer ${Cookies.get("token")}`}
            }),
            invalidatesTags : ["Cart"]
        }),
        incCart : builder.mutation({
            query : (id) => ({
                url : `/cart/${id}/increase`,
                method : "PUT",
                headers : {"Authorization" : `Bearer ${Cookies.get("token")}`}
            }),
            invalidatesTags : ["Cart"]
        }),

        decCart : builder.mutation({
            query : (id) => ({
                url : `/cart/${id}/decrease`,
                method : "PUT",
                headers : {"Authorization" : `Bearer ${Cookies.get("token")}`}
            }),
            invalidatesTags : ["Cart"]
        }),
    })
})

export const { useGetCartQuery, useAddCartMutation, useDeleteCartMutation,
            useIncCartMutation, useDecCartMutation } = cartApi