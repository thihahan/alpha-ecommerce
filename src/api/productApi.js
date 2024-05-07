import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import Cookies from "js-cookie"

export const productApi = createApi({
    reducerPath : "productApi",
    baseQuery : fetchBaseQuery({baseUrl : "http://localhost:8000/api"}),
    tagTypes : ["Product", "Category", "Photo", "Cart", "Order", "OrderItem"],
    endpoints : builder => ({
         // user for need
         getUsers : builder.query({
            query : (params) => ({
                url : `/users?${params}`,
                headers : {"Authorization" : `Bearer ${Cookies.get("token")}`}
            }),
            providesTags : ["User"]
        }),
        getUser : builder.query({
            query : (id) => ({
                url : `/users/${id}`,
                headers : {"Authorization" : `Bearer ${Cookies.get("token")}`}
            }),
            providesTags : ["User"]
        }),
        updateUser : builder.mutation({
            query : ({body, id}) => ({
                url : `/users/${id}`,
                method : "PUT",
                body,
                headers : {"Authorization" : `Bearer ${Cookies.get("token")}`}
            }),
            invalidatesTags : ["User"]
        }),
        deleteUser : builder.mutation({
            query : (id) => ({
                url : `users/${id}`,
                method : "DELETE",
                headers : {"Authorization" : `Bearer ${Cookies.get("token")}`}
            }),
            invalidatesTags : ["User"]
        }),
        updateProfilePhoto : builder.mutation({
            query : ({formData, id}) => ({
                url : `users/profile-photos/${id}`,
                method : "POST",
                body : formData,
                headers : {"Authorization" : `Bearer ${Cookies.get("token")}`}
            }),
            invalidatesTags : ["User"]
        }),

        getProducts : builder.query({
            query : (params) => ({
                url : `/products?${params}`,
            }),
            providesTags : ["Product"]
        }),

        getProduct : builder.query({
            query : (id) => ({
                url : `/products/${id}`,
            }),
            providesTags : ["Product"]
        }),

        createProduct : builder.mutation({
            query : (data) => ({
                url : "/products",
                method : "POST",
                body : data,
                headers : {"Authorization" : `Bearer ${Cookies.get("token")}`}
            }),
            invalidatesTags : ["Product", "Category"]

        }),

        updateProduct : builder.mutation({
            query : ({formData, id}) => ({
                url :  `/products/${id}`,
                method : "POST",
                body : formData,
                headers : {"Authorization" : `Bearer ${Cookies.get("token")}`,},
            }),
            invalidatesTags : ["Product", "Category"]
        }),

        deleteProduct : builder.mutation({
            query : (id) => ({
                url :  `/products/${id}`,
                method : "DELETE",
                headers : {"Authorization" : `Bearer ${Cookies.get("token")}`,},
            }),
            invalidatesTags : ["Product", "Category"]
        }),

        // Category
        getCategories : builder.query({
            query : () => ({
                url : "/categories",
                headers : {"Authorization" : `Bearer ${Cookies.get("token")}`}
            }),
            providesTags : ["Category"]
        }),

        addCategory : builder.mutation({
            query : (name) => ({
                url : "categories",
                method : "POST",
                body : {name : name},
                headers : {"Authorization" : `Bearer ${Cookies.get("token")}`}
            }),
            invalidatesTags : ["Category", "Product"]
        }),

        deleteCategory : builder.mutation({
            query : (id) => ({
                url : `/categories/${id}`,
                method : "DELETE",
                headers : {"Authorization" : `Bearer ${Cookies.get("token")}`}
            }),
            invalidatesTags : ["Category"]
        }),

        updateCategory : builder.mutation({
            query : ({id, body}) => ({
                url : `/categories/${id}`,
                method : "PUT",
                body,
                headers : {"Authorization" : `Bearer ${Cookies.get("token")}`}
            }),
            invalidatesTags : ["Category"]
        }),

        deletePhotos : builder.mutation({
            query : (data) => ({
                url : "/photos",
                method : "DELETE",
                body : data,
                headers : {"Authorization" : `Bearer ${Cookies.get("token")}`}
            }),
            invalidatesTags : ["Photo"]
        }),


        // orders
        getOrders : builder.query({
            query : (token) => ({
                url : "/orders",
                headers : {"Authorization" : `Bearer ${token}`}
            }),
            providesTags : ["Order"]
        }),

        getOrder : builder.query({
            query : (id) => ({
                url : `/orders/${id}`,
                headers : {"Authorization" : `Bearer ${Cookies.get("token")}`}
            }),
            providesTags : ["Order"]
            
        }),

        addOrder : builder.mutation({
            query : (body) => ({
                url : "orders",
                method : "POST",
                body, 
                headers : {"Authorization" : `Bearer ${Cookies.get("token")}`}
            }),
            invalidatesTags : ["Order", "Cart", "User"]
        }),

        updateOrder : builder.mutation({
            query : ({body, id}) => ({
                url : `/orders/${id}`,
                method : "PUT",
                body,
                headers : {"Authorization" : `Bearer ${Cookies.get("token")}`}
            }),
            invalidatesTags : ["Order", "User"]
        }),

        deleteOrder : builder.mutation({
            query : (id) => ({
                url : `/orders/${id}`,
                method : "DELETE",
                headers : {"Authorization" : `Bearer ${Cookies.get("token")}`}
            }),
            invalidatesTags : ["Order", "User"]
        }),

        // for admin
        getAdminProducts : builder.query({
            query : (pageNumber) => ({
                url : pageNumber ? `/admin/products?page=${pageNumber}` : "/admin/products",
                headers : {"Authorization" : `Bearer ${Cookies.get("token")}`}
            })
        }), 


        getAdminOrders : builder.query({
            query : (params) => ({
                url : `/admin-orders?${params}`,
                headers : {"Authorization" : `Bearer ${Cookies.get("token")}`}
            }),
            providesTags : ["Order", "User"]
        }),



        // order items
        getOrderItem : builder.query({
            query : (id) => ({
                url : `/order-items/${id}`,
                headers : {"Authorization" : `Bearer ${Cookies.get("token")}`}
            }),
            providesTags : ["OrderItem"]
        }),

        updateOrderItem : builder.mutation({
            query : ({body, id}) => ({
                url : `order-items/${id}`,
                method : "PUT",
                body,
                headers : {"Authorization" : `Bearer ${Cookies.get("token")}`}
            }),
            invalidatesTags : ["OrderItem", "User", "Order"]
        }),

        deleteOrderItem : builder.mutation({
            query : (id) => ({
                url : `/order-items/${id}`,
                method : "DELETE",
                headers : {"Authorization" : `Bearer ${Cookies.get("token")}`}
            }),
            invalidatesTags : ["OrderItem", "Order", "User"]
        }),

        getCategoryProducts : builder.query({
            query : ({category, params}) => ({
                url : `categories/${category}/products?${params}`,
                headers : {"Authorization" : `Bearer ${Cookies.get("token")}`}
            })
        }),
       

    })
})

export const { useGetProductsQuery, useGetProductQuery, 
    useCreateProductMutation,useUpdateProductMutation,useDeleteProductMutation,
    useGetCategoriesQuery, useAddCategoryMutation,useDeleteCategoryMutation, useUpdateCategoryMutation,
    useGetOrderQuery,useUpdateOrderMutation,
    useDeletePhotosMutation,  useGetCategoryProductsQuery,
    useAddOrderMutation,useGetOrdersQuery, useDeleteOrderMutation, useGetAdminOrdersQuery,
    useGetOrderItemQuery, useUpdateOrderItemMutation,useDeleteOrderItemMutation,  
    useGetUsersQuery, useGetAdminProductsQuery, 
    useGetUserQuery, useUpdateUserMutation, useDeleteUserMutation,
    useUpdateProfilePhotoMutation } = productApi