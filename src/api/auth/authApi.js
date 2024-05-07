import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import Cookies from "js-cookie"

export const authApi = createApi({
    reducerPath : "authApi",
    baseQuery : fetchBaseQuery({ baseUrl : "http://localhost:8000/api" }),
    tagTypes : ["Owner", "User"],
    endpoints : builder => ({
        // for admin
        getUsersByAdmin : builder.query({
            query : (params) => ({
                url : `/users?${params}`,
                headers : {"Authorization" : `Bearer ${Cookies.get("token")}`}
            }),
            providesTags : ["User"]
        }),

        getOwner : builder.query({
            query : () => ({
                url : "/user",
                headers : {"Authorization" : `Bearer ${Cookies.get("token")}`}
            }),
            providesTags : ["Owner"]
        }),
        register : builder.mutation({
            query : (data) => ({
                url : "/user/register",
                method : "POST",
                body : data
            }),
        }),
        login : builder.mutation({
            query : (data) => ({
                url : "/user/login",
                method : "POST",
                body : data
            }),
            invalidatesTags : ["Owner", "User"]
        }),

        

        logout : builder.mutation({
            query : () => ({
                url : "/user/logout",
                method : "POST",
                headers : {"Authorization" : `Bearer ${Cookies.get("token")}`}
            }),
            invalidatesTags : ["Owner", "User"]
        }),

        updateOwner : builder.mutation({
            query : (body) => ({
                url : "/user/",
                method : "PATCH",
                body,
                headers : {"Authorization" : `Bearer ${Cookies.get("token")}`}
            }),
            invalidatesTags : ["Owner", "User"]
        }),

        updateOwnerProfilePhoto : builder.mutation({
            query : ({formData}) => ({
                url : `/user/profile-photo`,
                method : "POST",
                body : formData,
                headers : {"Authorization" : `Bearer ${Cookies.get("token")}`}
            }),
            invalidatesTags : ["Owner", "User"]
        }),

        deleteOwner : builder.mutation({
            query : () => ({
                url : "/user",
                method : "DELETE",
                headers : {"Authorization" : `Bearer ${Cookies.get("token")}`}
            }),
            invalidatesTags : ["Owner", "User"]
        }),

        
    })
})

export const { useRegisterMutation, useLoginMutation, useLogoutMutation,
        useUpdateOwnerMutation, useGetOwnerQuery,
        useUpdateOwnerProfilePhotoMutation, 
        useDeleteOwnerMutation, useGetUsersByAdminQuery } = authApi