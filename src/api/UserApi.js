import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

const userApi = createApi({
    reducerPath : "userApi",
    baseQuery : fetchBaseQuery({baseUrl : "http://localhost:8000/api/users"}),
    tagTypes : ["Users", "User"],
    endpoints : builder => ({

        addProfilePhoto : builder.mutation({
            query : ({body, id}) => ({
                url : `/profile-photos/${id}`,
                method : "POST",
                body,
                headers : {"Authorization" : `Bearer ${Cookies.get("token")}`}
            }),
            invalidatesTags : ["User", "Users"]
        }),

        updateUser : builder.mutation({
            query : ({body, id}) => ({
                url : `/${id}`,
                method : "PUT",
                body,
                headers : {"Authorization" : `Bearer ${Cookies.get("token")}`}
            }),
            invalidatesTags : ["User", "Users"]
        }),

        deleteUser : builder.mutation({
            query : (id) => ({
                url : `/${id}`,
                method : "DELETE",
                headers : {"Authorization" : `Bearer ${Cookies.get("token")}`}
            }),
            invalidatesTags : ["User", "Users"]
        })
        
    })
})

export const { useAddProfilePhotoMutation,
    useUpdateUserMutation, useDeleteUserMutation} = userApi   
export default userApi